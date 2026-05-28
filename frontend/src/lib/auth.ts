export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const API_URL = `${API_BASE}/api/auth`;

export const getGoogleAuthUrl = () => `${API_URL}/google`;

export type AuthUser = {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
};

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setAuth = (token: string, user: AuthUser) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const token = getToken();
  if (!token) {
    throw new AuthError("No token", 401);
  }

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  let data: { message?: string; user?: AuthUser } = {};
  try {
    data = await res.json();
  } catch {
    // ignore parse errors
  }

  if (!res.ok) {
    throw new AuthError(data.message || "Unauthorized", res.status);
  }

  if (!data.user) {
    throw new AuthError("Invalid user response", 500);
  }

  localStorage.setItem("user", JSON.stringify(data.user));
  return data.user;
};
