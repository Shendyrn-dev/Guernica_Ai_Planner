import { Nav, Hero, How, OutputBento, CTA, Footer } from "@/components/landing/sections";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Nav />
      <main>
        <Hero />
        <How />
        <OutputBento />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
