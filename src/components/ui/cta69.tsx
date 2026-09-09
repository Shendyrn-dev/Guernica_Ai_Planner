"use client";

import { Badge7 } from "@/components/ui/cta69-utils/badge7";
import { Button12 } from "@/components/ui/cta69-utils/button12";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface Cta69Labels {
  marqueePhrase?: string;
  note?: string;
  footnote?: string;
}

interface Cta69Props {
  badge?: Badge;
  heading?: string;
  button?: ActionButton;
  labels?: Cta69Labels;
  className?: string;
}

export const cta69Demo: Cta69Props = {
  badge: { label: "Last word" },
  heading: "Let's make something worth keeping.",
  button: {
    label: "Start the conversation",
    href: "https://beste.co",
  },
  labels: {
    marqueePhrase: "Worth keeping",
    note: "No decks, no detours: one room, your problem, and a studio that ships.",
    footnote: "Booking two new partners for the autumn cycle.",
  },
};

const REPEATS = 8;

export function Cta69({
  badge,
  heading,
  button,
  labels = {},
  className,
}: Cta69Props) {
  const marqueePhrase = labels.marqueePhrase;
  const marqueeLine = marqueePhrase
    ? `${marqueePhrase} \u00B7 `.repeat(REPEATS)
    : "";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background py-24 md:py-36 w-full",
        className,
      )}
    >
      <style jsx>{`
        @keyframes cta69-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {marqueePhrase && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none"
        >
          <div className="flex w-max shrink-0 animate-[cta69-marquee_40s_linear_infinite] whitespace-nowrap text-foreground/[0.06]">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="text-[22vw] font-bold leading-none tracking-tighter md:text-[16vw]"
              >
                {marqueeLine}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6">
        {badge && (
          <Reveal y={14}>
            <Badge7 label={badge.label} />
          </Reveal>
        )}
        {heading && (
          <Reveal delay={0.06} y={20}>
            <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              {heading}
            </h2>
          </Reveal>
        )}
        {labels.note && (
          <Reveal delay={0.14} y={14}>
            <p className="mt-6 max-w-xl text-balance text-lg text-muted-foreground md:text-xl">{labels.note}</p>
          </Reveal>
        )}
        {button && (
          <Reveal delay={0.2} y={14} className="contents">
            <div className="mt-12">
              <Button12 asChild label={button.label}>
                <Link href={button.href} />
              </Button12>
            </div>
          </Reveal>
        )}
        {labels.footnote && (
          <Reveal delay={0.26} y={10}>
            <p className="mt-8 text-base text-muted-foreground">{labels.footnote}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default Cta69;
