import { Nav, Hero, How, OutputBento, CTA, Footer } from "@/components/landing/sections";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <How />
        <OutputBento />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
