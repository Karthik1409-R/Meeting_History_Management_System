"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import {
  AuthError,
  type AuthUser,
  clearAuth,
  fetchCurrentUser,
  getStoredUser,
  getToken,
} from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        if (err instanceof AuthError && err.status === 401) {
          clearAuth();
          router.replace("/login");
          return;
        }

        if (!cachedUser) {
          clearAuth();
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          You are logged in as {user.email}
        </p>
      </main>
    </div>
  );
}
