import * as React from "react"
import { cn } from "@/lib/utils"
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center gap-1.5 bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black", className)} {...props} />
}
