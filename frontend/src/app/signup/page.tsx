"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import Header from "@/app/components/Header";
import { getGoogleAuthUrl } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordChecks = {
    length: form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      router.push("/login?registered=1");
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
      <Header authPage="signup" />

      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">
              Join thousands of teams using MeetNow
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
              <span className="text-xs text-gray-400">or sign up with email</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  Full name
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-500">
                  <User className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:border-blue-500">
                  <Lock className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Min. 6 characters"
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

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      passwordChecks.length ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-500">Min. 6 characters</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      passwordChecks.uppercase ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-500">One uppercase letter</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      passwordChecks.number ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-500">One number</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 ${
                      passwordChecks.special ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span className="text-gray-500">One special character</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form> 

            <p className="mt-4 text-center text-xs text-gray-400">
              By signing up, you agree to our{" "}
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
