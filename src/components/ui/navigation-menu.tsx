"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu } from "lucide-react";
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

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm h-12",
          !isExpanded && "cursor-pointer justify-center"
        )}
      >
        <motion.div variants={logoVariants} className="flex-shrink-0 flex items-center gap-2 font-semibold pl-4 pr-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
  );
}
