"use client";
import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function Button12({ label, className, asChild, children }: { label: string; className?: string; asChild?: boolean; children?: React.ReactElement }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <Button asChild className={cn("rounded-full gap-1.5", className)}>
        {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { children: (<><span>{label}</span><ArrowUpRight className="h-4 w-4" /></>) })}
      </Button>
    );
  }
  return <Button className={cn("rounded-full gap-1.5", className)}>{label} <ArrowUpRight className="h-4 w-4" /></Button>;
}
