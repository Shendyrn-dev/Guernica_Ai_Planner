"use client";

import { motion, useReducedMotion, type Variants, type Transition } from "motion/react";
import { type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  amount = 0.25,
  once = false,
  duration = 0.7,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  amount?: number;
  once?: boolean;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0 },
  };
  const transition: Transition = {
    duration: reduce ? 0.01 : duration,
    ease: [0.16, 1, 0.3, 1],
    delay: reduce ? 0 : delay,
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function RevealParent({
  children,
  className,
  stagger = 0.08,
  amount = 0.2,
  once = false,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
  once?: boolean;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: reduce
        ? undefined
        : { staggerChildren: stagger, delayChildren: 0.05 },
    },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {typeof children === "string" ? (
        <motion.span variants={itemVariants}>{children}</motion.span>
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
