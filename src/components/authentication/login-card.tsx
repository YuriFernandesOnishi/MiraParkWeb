"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

type Errors = Record<string, string>;

export default function LoginCard() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): Errors {
    const e: Errors = {};
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email inválido.";

    if (!password) e.password = "Senha é obrigatória.";
    return e;
  }

  function getErrorMessage(err: unknown): string {
    if (!err) return "Erro desconhecido";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      const candidate = (err as { message?: unknown }).message;
      if (typeof candidate === "string") return candidate;
      const resp = (err as {
        response?: { data?: { message?: unknown } };
      }).response;
      const msg = resp?.data?.message;
      if (typeof msg === "string") return msg;
    }
    try {
      return JSON.stringify(err).slice(0, 200);
    } catch {
      return "Erro desconhecido";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      await login(email, password);
      // useAuth já faz redirect
    } catch (err) {
      const message = getErrorMessage(err);
      setErrors({ form: message });
    }
  }

  async function handleGoogleLogin() {
    window.location.href = "/api/auth/google";
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Faça login na sua conta</CardTitle>
        <CardDescription>Entre com seu e-mail MiraPark para logar</CardDescription>

        <CardAction>
          <Button type="link" variant="link" href="/register">
            Registre-se
          </Button>
        </CardAction>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate>
        <CardContent className="pb-4">
          <div className="space-y-4">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "login-email-error" : undefined}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <FieldError id="login-email-error">{errors.email}</FieldError>
                    )}
                  </FieldContent>
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <a href="#" className="text-sm underline-offset-4 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <FieldContent>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "login-password-error" : undefined}
                      autoComplete="current-password"
                    />
                    {errors.password && (
                      <FieldError id="login-password-error">{errors.password}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>

            {errors.form && (
              <div role="alert" className="text-sm text-red-600">
                {errors.form}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Login"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Login com Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
