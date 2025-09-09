"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: number;
};

type AuthState = {
  users: AuthUser[];
  currentUserId: string | null;
};

type RegisterInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthStore = AuthState & {
  registerUser: (
    input: RegisterInput
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const encodeBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i]);
  return typeof window === "undefined"
    ? Buffer.from(binary, "binary").toString("base64")
    : btoa(binary);
};

const generateSalt = (length = 16) => {
  const saltBytes = new Uint8Array(length);
  crypto.getRandomValues(saltBytes);
  return encodeBase64(saltBytes);
};

const hashPassword = async (password: string, salt: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return encodeBase64(new Uint8Array(hashBuffer));
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      registerUser: async (input) => {
        const fullName = input.fullName.trim();
        const email = normalizeEmail(input.email);
        const phone = input.phone?.trim() || undefined;

        const existing = get().users.find((u) => u.email === email);
        if (existing)
          return { ok: false as const, error: "El email ya está registrado" };

        const passwordSalt = generateSalt();
        const passwordHash = await hashPassword(input.password, passwordSalt);
        const id =
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const user: AuthUser = {
          id,
          fullName,
          email,
          phone,
          passwordHash,
          passwordSalt,
          createdAt: Date.now(),
        };

        set((prev) => ({
          users: [...prev.users, user],
          currentUserId: user.id,
        }));
        return { ok: true as const };
      },

      login: async (email, password) => {
        const normalized = normalizeEmail(email);
        const user = get().users.find((u) => u.email === normalized);
        if (!user)
          return { ok: false as const, error: "Credenciales inválidas" };
        const candidateHash = await hashPassword(password, user.passwordSalt);
        if (candidateHash !== user.passwordHash)
          return { ok: false as const, error: "Credenciales inválidas" };
        set({ currentUserId: user.id });
        return { ok: true as const };
      },

      logout: () => set({ currentUserId: null }),
    }),
    {
      name: "auth-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

export const useAuth = () => {
  const users = useAuthStore((s) => s.users);
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const registerUser = useAuthStore((s) => s.registerUser);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const currentUser = currentUserId
    ? users.find((u) => u.id === currentUserId) ?? null
    : null;
  return { users, currentUser, registerUser, login, logout };
};
