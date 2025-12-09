import {BentoGrid, BentoGridItem} from "@/components/ui/bento-grid";
import DarkLightThemeToggle from "@/components/shadcn/DarkLightToggle";


export default function Home() {

  return (
    <>
      <main className="min-h-screen p-10 mx-auto max-w-7xl">

        <div className="flex justify-end mb-6">
          <DarkLightThemeToggle />
        </div>

        <BentoGrid variant="masonry" gap="md" maxWidth="lg">
          <BentoGridItem
            title="Small Masonry Card"
            description="Conteúdo curto."
            size="auto"
            autoRow
          />

        </BentoGrid>
      </main>
    </>
  )
}