"use client";
import { cn } from "@/lib/utils";
export function Badge7({ label, className }: { label: string; className?: string }) {
  return <div className={cn("inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300", className)}>{label}</div>;
}
