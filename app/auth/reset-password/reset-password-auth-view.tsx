"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth/next";
import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";

const authClient = createAuthClient();

export default function ResetPasswordAuthView() {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      redirectTo="/auth/sign-in"
    >
      <AuthView path="reset-password" />
    </NeonAuthUIProvider>
  );
}
