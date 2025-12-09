"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import {
  Card,
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
import api from "@/services/api";

export default function RegisterCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome é obrigatório.";
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email inválido.";
    if (password.length < 6) e.password = "Senha deve ter ao menos 6 caracteres.";
    return e;
  }

  async function handleRegister() {
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        nome: name,
        email,
        senha: password,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Usuário registrado com sucesso!");
        window.location.href = "/login";
      } else {
        alert(res.data?.message ?? "Erro ao registrar");
      }

    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;

      alert(
        error.response?.data?.message ??
        "Falha ao conectar ao servidor"
      );

    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length === 0) {
      await handleRegister();
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Registre sua conta</CardTitle>
        <CardDescription>
          Registre-se para começar a usar o MiraPark
        </CardDescription>
      </CardHeader>

      {/* --- AQUI: o botão vai ficar DENTRO do form --- */}
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <div className="flex flex-col gap-6">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <FieldError id="name-error">{errors.name}</FieldError>
                    )}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <FieldError id="email-error">{errors.email}</FieldError>
                    )}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <FieldContent>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                    />
                    {errors.password && (
                      <FieldError id="password-error">
                        {errors.password}
                      </FieldError>
                    )}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="link" variant="link" href="/login">
            Já possui uma conta? Login
          </Button>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>

          <Button variant="outline" className="w-full">
            Registrar com Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
