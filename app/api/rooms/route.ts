import { neon } from "@neondatabase/serverless";
import { getServerAuth } from "@/lib/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

async function getUser() {
  const auth = getServerAuth();
  if (!auth) return null;
  const { data } = await auth.getSession();
  return data?.user ?? null;
}

export async function GET() {
  const user = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getSql();
  if (!sql) return Response.json({ error: "Database is not configured." }, { status: 503 });

  try {
    const [rooms, presets] = await Promise.all([
      sql`
        SELECT r.id, r.title, r.status, r.privacy_mode, r.created_at, s.title AS scene_title
        FROM podcast_rooms r
        LEFT JOIN scene_presets s ON s.id = r.scene_preset_id
        WHERE r.owner_subject = ${user.id}
        ORDER BY r.created_at DESC
        LIMIT 50
      `,
      sql`
        SELECT id, slug, title, description
        FROM scene_presets
        WHERE is_public = true
        ORDER BY title
        LIMIT 50
      `,
    ]);
    return Response.json({ rooms, presets });
  } catch {
    return Response.json({ error: "Could not load rooms." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  if (!requestOrigin || requestOrigin !== requestUrl.origin) {
    return Response.json({ error: "Cross-origin request denied." }, { status: 403 });
  }

  const user = await getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const sql = getSql();
  if (!sql) return Response.json({ error: "Database is not configured." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = body as { title?: unknown; scenePresetId?: unknown; privacyMode?: unknown };
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (title.length < 1 || title.length > 160) {
    return Response.json({ error: "Title must contain 1–160 characters." }, { status: 400 });
  }

  const privacyMode = input.privacyMode ?? "invite_only";
  if (!["invite_only", "unlisted", "public"].includes(String(privacyMode))) {
    return Response.json({ error: "Invalid privacy mode." }, { status: 400 });
  }

  let scenePresetId: string | null = null;
  if (input.scenePresetId !== undefined && input.scenePresetId !== null && input.scenePresetId !== "") {
    if (typeof input.scenePresetId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.scenePresetId)) {
      return Response.json({ error: "Invalid scene preset." }, { status: 400 });
    }
    scenePresetId = input.scenePresetId;
    try {
      const presets = await sql`SELECT id FROM scene_presets WHERE id = ${scenePresetId}::uuid AND is_public = true LIMIT 1`;
      if (presets.length === 0) return Response.json({ error: "Scene preset is unavailable." }, { status: 400 });
    } catch {
      return Response.json({ error: "Could not validate scene preset." }, { status: 500 });
    }
  }

  try {
    const rows = await sql`
      WITH created AS (
        INSERT INTO podcast_rooms (owner_subject, title, scene_preset_id, privacy_mode)
        VALUES (${user.id}, ${title}, ${scenePresetId}::uuid, ${String(privacyMode)})
        RETURNING id, title, status, privacy_mode, created_at
      ), logged AS (
        INSERT INTO audit_events (actor_subject, action, resource_type, resource_id, result)
        SELECT ${user.id}, 'room.create', 'podcast_room', created.id::text, 'allowed'
        FROM created
        RETURNING id
      )
      SELECT created.id, created.title, created.status, created.privacy_mode, created.created_at
      FROM created CROSS JOIN logged
    `;
    return Response.json({ room: rows[0] }, { status: 201 });
  } catch {
    return Response.json({ error: "Could not create room." }, { status: 500 });
  }
}