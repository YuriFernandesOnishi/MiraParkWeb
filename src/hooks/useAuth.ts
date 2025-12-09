"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

const TOKEN_KEY = "token";

export type User = {
  nome: string;
  email: string;
};

interface LoginParams {
  email: string;
  senha: string;
}

interface AuthResponse {
  token?: string;
  success?: boolean;
  message?: string;
  [k: string]: unknown;
}

export function useAuth() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // garante execução apenas no cliente
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    let mounted = true;

    const init = async (): Promise<void> => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);

        if (!mounted) return;

        if (storedToken) {
          setToken(storedToken);

          try {
            const userData = await authService.me();
            if (mounted) setUser(userData);
          } catch {
            // token inválido/expirado
            localStorage.removeItem(TOKEN_KEY);
            if (mounted) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, senha: string): Promise<AuthResponse | undefined> => {
      setLoading(true);

      try {
        const response = await authService.login({ email, senha } as LoginParams);

        if (response?.token) {
          localStorage.setItem(TOKEN_KEY, response.token);
          setToken(response.token);

          const userData = await authService.me().catch(() => null);
          setUser(userData ?? null);

          // pages router: router.push retorna Promise<void>
          await router.push("/dashboard");
        }

        return response;
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);

      await router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { token, user, login, logout, loading };
}
