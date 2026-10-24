"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth/next";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";

const authClient = createAuthClient();

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      redirectTo="/dashboard"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
