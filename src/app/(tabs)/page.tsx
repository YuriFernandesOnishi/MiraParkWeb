"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image
            src="/images/logo.svg"
            alt="Logo MiraPark"
            width={96}
            height={96}
            className="rounded-xl"
          />

          <h1 className="text-2xl font-bold text-center">
            MiraPark
          </h1>

          <p className="text-sm text-muted-foreground text-center">
            Sistema de controle de estacionamento
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <Button
            href="/login"
            type="link"
            variant="default"
            size="lg"
            className="w-full"
          >
            Login
          </Button>

          <Button
            href="/register"
            type="link"
            variant="outline"
            size="lg"
            className="w-full"
          >
            Registrar
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
