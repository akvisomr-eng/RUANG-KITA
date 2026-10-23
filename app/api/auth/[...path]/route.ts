import { getServerAuth } from "@/lib/auth/server";

type AuthRouteContext = { params: Promise<{ path: string[] }> };

async function dispatch(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", request: Request, context: AuthRouteContext) {
  const auth = getServerAuth();
  if (!auth) {
    return Response.json({ error: "Authentication is not configured on this deployment." }, { status: 503 });
  }
  const handlers = auth.handler();
  return handlers[method](request, context);
}

export const GET = (request: Request, context: AuthRouteContext) => dispatch("GET", request, context);
export const POST = (request: Request, context: AuthRouteContext) => dispatch("POST", request, context);
export const PUT = (request: Request, context: AuthRouteContext) => dispatch("PUT", request, context);
export const DELETE = (request: Request, context: AuthRouteContext) => dispatch("DELETE", request, context);
export const PATCH = (request: Request, context: AuthRouteContext) => dispatch("PATCH", request, context);