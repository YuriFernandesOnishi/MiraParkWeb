"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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

export default function RegisterCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome é obrigatório.";
    if (!email.trim()) e.email = "Email é obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email inválido.";
    if (password.length < 6) e.password = "Senha deve ter ao menos 6 caracteres.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // Submissão real aqui (API call)
      console.log({ name, email, password });
      // reset opcional
    }
  }

  return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>
            Register your account to start using our services
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <FieldContent>
                      <Input
                          id="name"
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
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
                      {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <FieldContent>
                      <Input
                          id="password"
                          type="password"
                          placeholder="Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          aria-invalid={!!errors.password}
                          aria-describedby={errors.password ? "password-error" : undefined}
                      />
                      {errors.password && (
                          <FieldError id="password-error">{errors.password}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="link" variant="link" href="/login">
            Already have an account? Login here
          </Button>
          <Button type="submit" className="w-full" onClick={(e) => (e.currentTarget.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) )}>
            Register
          </Button>
          <Button variant="outline" className="w-full">
            Register with Google
          </Button>
        </CardFooter>
      </Card>
  );
}
