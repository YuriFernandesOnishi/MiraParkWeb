"use client";

import Image from "next/image";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import DarkLightThemeToggle from "@/components/shadcn/DarkLightToggle";

export default function DemoPage() {
  return (
    <main className="min-h-screen p-10 mx-auto max-w-7xl">

      {/* Toggle de Tema */}
      <div className="flex justify-end mb-6">
        <DarkLightThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-2">BentoGrid Demo</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Visualização de todos os variants e tamanhos disponíveis.
      </p>

      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Variant: default</h2>

        <BentoGrid variant="default" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Default Grid"
            description="Um layout equilibrado com 3 colunas."
            size="lg"
          />

          <BentoGridItem
            title="Mid Sized"
            description="Cartão tamanho médio."
            size="md"
          />

          <BentoGridItem
            title="Small Card"
            description="Útil para infos rápidas."
            size="sm"
          />

          <BentoGridItem
            title="Auto Row"
            description="Altura definida pelo conteúdo."
            size="auto"
            autoRow
          >
            <p className="text-sm mt-2">
              Este card usa <code>autoRow</code> para ficar mais fluido.
            </p>
          </BentoGridItem>
        </BentoGrid>
      </section>


      <section className="mt-20">
        <h2 className="text-xl font-semibold mb-4">Variant: wide</h2>

        <BentoGrid variant="wide" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Wide Grid"
            description="4 colunas em telas largas."
            size="lg"
          />

          <BentoGridItem
            title="Medium Card"
            description="Outro exemplo no grid wide."
            size="md"
          />

          <BentoGridItem
            title="Small Card"
            description="Cartões menores também funcionam bem."
            size="sm"
          />
        </BentoGrid>
      </section>


      <section className="mt-20">
        <h2 className="text-xl font-semibold mb-4">Variant: dense</h2>

        <BentoGrid variant="dense" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Dense Layout"
            description="6 colunas — ótimo para dashboards densos."
            size="lg"
          />

          <BentoGridItem
            title="Medium"
            description="Exemplo de item médio."
            size="md"
          />

          <BentoGridItem
            title="Another One"
            description="Cards variam mas ocupam bem o espaço."
            size="sm"
          />

          <BentoGridItem
            title="Auto Row"
            description="Este aqui cresce pelo conteúdo."
            autoRow
          >
            <p className="text-sm mt-2">
              Mais texto aqui só para testar o comportamento no modo <b>dense</b>.
            </p>
          </BentoGridItem>
        </BentoGrid>
      </section>


      <section className="mt-20">
        <h2 className="text-xl font-semibold mb-4">Variant: masonry</h2>

        <BentoGrid variant="masonry" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Masonry Style"
            description="Cards em formato de colunas fluidas (Pinterest style)."
            size="auto"
            autoRow
          >
            <Image
              src="https://picsum.photos/500"
              alt="Landscape"
              width={600}
              height={300}
              className="rounded-lg mt-2"
            />
          </BentoGridItem>

          <BentoGridItem
            title="Text Content"
            description="Cartões com tamanhos diferentes ajudam a compor a grade."
            size="auto"
            autoRow
          >
            <p className="mt-3 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet
              pellentesque justo. Vestibulum volutpat posuere nisl.
            </p>
          </BentoGridItem>

          <BentoGridItem
            title="Small Masonry Card"
            description="Conteúdo curto."
            size="auto"
            autoRow
          />
        </BentoGrid>
      </section>


      <section className="mt-20 mb-40">
        <h2 className="text-xl font-semibold mb-4">Variant: auto</h2>

        <BentoGrid variant="auto" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Auto Grid"
            description="Rows baseadas no conteúdo."
            autoRow
          />

          <BentoGridItem
            title="Ideal para textos"
            description="Cards expandidos naturalmente."
            autoRow
          >
            <p className="text-sm mt-3 leading-relaxed">
              Quando você precisa de flexibilidade total, o variant 'auto' remove
              altura fixa e deixa o conteúdo comandar o layout.
            </p>
          </BentoGridItem>

          <BentoGridItem
            title="Imagem livre"
            description="Funciona bem com qualquer mídia."
            autoRow
          >
            <Image
              src="https://picsum.photos/2000"
              alt="Landscape"
              width={600}
              height={300}
              className="rounded-lg mt-3"
            />
          </BentoGridItem>
        </BentoGrid>
      </section>

    </main>
  );
}
