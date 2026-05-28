"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react";
import {
  AuthError,
  clearAuth,
  fetchCurrentUser,
  getStoredUser,
  getToken,
  type AuthUser,
} from "@/lib/auth";

type User = AuthUser;

interface HeaderProps {
  user?: User | null;
  authPage?: "login" | "signup";
}

const LogoIcon = () => {
  return <div className="text-white font-bold text-lg">M</div>;
};

function SignedInActions({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/meet"
        className="hidden items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 sm:flex"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="text-gray-400">
            <UserCircle className="h-7 w-7" />
          </div>
        )}

        <div className="hidden flex-col sm:flex">
          <span className="text-xs font-semibold leading-tight text-gray-900">
            {user.name}
          </span>
          <span className="text-[10px] leading-tight text-gray-400">
            {user.email}
          </span>
        </div>
      </Link>

      <Link
        href="/meet"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:bg-blue-800"
      >
        Go to Meet
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
      >
        Log out
      </button>
    </div>
  );
}

export default function Header({ user, authPage }: HeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(user ?? null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      return;
    }

    const token = getToken();

    if (!token) {
      setCurrentUser(null);
      return;
    }

    const cachedUser = getStoredUser();
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }

    let cancelled = false;

    const loadCurrentUser = async () => {
      try {
        const freshUser = await fetchCurrentUser();

        if (!cancelled) {
          setCurrentUser(freshUser);
        }
      } catch (err) {
        if (err instanceof AuthError && err.status === 401) {
          clearAuth();
          if (!cancelled) {
            setCurrentUser(null);
          }
          return;
        }

        if (!cachedUser && !cancelled) {
          clearAuth();
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-500/30">
            <LogoIcon />
          </div>

          <span className="text-[17px] font-bold tracking-tight text-gray-900">
            Meeting App
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <SignedInActions user={currentUser} onLogout={handleLogout} />
          ) : (
            <>
              {authPage !== "login" && (
                <Link
                  href="/login"
                  className="hidden rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-200 sm:block"
                >
                  Log in
                </Link>
              )}

              {authPage !== "signup" && (
                <Link
                  href="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:bg-blue-800"
                >
                  Sign up free
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
