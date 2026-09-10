"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Cara kerja", href: "#cara-kerja" },
  { name: "Output", href: "#output" },
  { name: "Informasi", href: "#untuk-siapa" },
];

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring" as const, damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring" as const, damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring" as const, damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 300, delay: 0.15 },
  },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  React.useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/guernica.png" alt="Guernica" className="h-6 w-6 object-contain invert dark:invert-0" />
          <span className="text-sm tracking-tight">Guernica</span>
          <span className="bg-black px-1.5 py-0.5 text-[10px] font-medium tracking-widest text-white dark:bg-white dark:text-black">MVP</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8 rounded-full px-4 text-xs" asChild>
            <Link href="/create">Mulai Gratis</Link>
          </Button>
          <button
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-background"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <motion.div
        initial={false}
        animate={mobileOpen ? "open" : "closed"}
        variants={{ open: { x: 0 }, closed: { x: "100%" } }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-[320px] flex-col bg-background p-6 shadow-2xl md:hidden"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-semibold">
            <img src="/guernica.png" alt="" className="h-6 w-6 object-contain invert dark:invert-0" />
            Guernica
          </span>
          <button
            aria-label="Tutup menu"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-auto grid gap-3">
          <Button size="lg" className="w-full rounded-full" asChild>
            <Link href="/create" onClick={() => setMobileOpen(false)}>Mulai Gratis</Link>
          </Button>
          <p className="text-center font-mono text-xs text-neutral-500">Tanpa kartu kredit • Export .md</p>
        </div>
      </motion.div>

      <div className="fixed top-6 left-1/2 z-50 hidden -translate-x-1/2 md:block">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={containerVariants}
          whileHover={!isExpanded ? { scale: 1.1 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={cn(
            "flex max-w-[calc(100vw-2rem)] items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm h-12",
            !isExpanded && "cursor-pointer justify-center"
          )}
        >
          <motion.div variants={logoVariants} className="flex-shrink-0 flex items-center gap-2 font-semibold pl-4 pr-2">
            <img src="/guernica.png" alt="Guernica" className="h-6 w-6 object-contain invert dark:invert-0" />
            <span className="text-sm font-semibold tracking-tight">Guernica</span>
            <span className="hidden bg-black px-1.5 py-0.5 text-[10px] font-medium tracking-widest text-white dark:bg-white dark:text-black md:inline-flex">MVP</span>
          </motion.div>

          <motion.div className={cn("flex items-center gap-1 pr-2", !isExpanded && "pointer-events-none")}>
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                variants={itemVariants}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-900 transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
            <motion.div variants={itemVariants} onClick={(e) => e.stopPropagation()} className="ml-1">
              <Button size="sm" className="h-8 rounded-full px-4 text-sm font-medium" asChild>
                <Link href="/create">Mulai Gratis</Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div variants={collapsedIconVariants} animate={isExpanded ? "expanded" : "collapsed"}>
              <Menu className="h-6 w-6" />
            </motion.div>
          </div>
        </motion.nav>
      </div>
    </>
  );
}
