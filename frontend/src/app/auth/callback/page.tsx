"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser, setAuth } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const completeAuth = async () => {
      const rawToken = new URLSearchParams(window.location.search).get("token");
      const token = rawToken ? decodeURIComponent(rawToken) : null;

      if (!token) {
        setMessage("Authentication failed. Redirecting...");
        router.replace("/login?error=oauth_failed");
        return;
      }

      try {
        setAuth(token, { name: "", email: "" });
        await fetchCurrentUser();
        router.replace("/home");
      } catch {
        setMessage("Authentication failed. Redirecting...");
        router.replace("/login?error=oauth_failed");
      }
    };

    completeAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
