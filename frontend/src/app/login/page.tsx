"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Header from "@/app/components/Header";
import {
  fetchCurrentUser,
  getGoogleAuthUrl,
  getToken,
  setAuth,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success] = useState(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "1") {
      return "Account created! Please log in to continue.";
    }
    return "";
  });

  const oauthErrorMessage = (() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error === "oauth_cancelled") {
      return "Google sign-in was cancelled.";
    }
    if (error === "oauth_no_email") {
      return "Google account has no email. Use email sign-in instead.";
    }
    if (error === "oauth_failed") {
      return "Google sign-in failed. Please try again.";
    }
    return "";
  })();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) return;

      try {
        await fetchCurrentUser();
        router.replace("/home");
      } catch {
        // stay on login
      }
    };

    checkAuth();
  }, [router]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setAuth(data.token, data.user);
      router.push("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header authPage="login" />

      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Log in to continue using MeetNow
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={18}
                height={18}
                unoptimized
              />
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or log in with email</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {success && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-center text-xs text-green-700">
                  {success}
                </p>
              )}

              {(error || oauthErrorMessage) && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                  {error || oauthErrorMessage}
                </p>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-500">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="alice@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-500">
                  <Lock className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
