import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DotPattern } from "@/components/ui/dot-pattern";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Product Planner — Ide mentah jadi blueprint siap coding",
  description: "Ubah ide aplikasi jadi PRD, Feature Spec, dan Coding Tasks siap tempel ke Cursor, Claude Code, Codex. Bukan AI yang coding — AI yang merencanakan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased scroll-smooth overflow-x-hidden`}>
      <body suppressHydrationWarning className="relative flex min-h-full min-w-0 flex-col overflow-x-hidden bg-transparent text-foreground">
        <script dangerouslySetInnerHTML={{ __html: `try{document.querySelectorAll('[bis_skin_checked]').forEach(e=>e.removeAttribute('bis_skin_checked'));new MutationObserver(function(m){m.forEach(function(r){r.addedNodes&&r.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.hasAttribute&&n.hasAttribute('bis_skin_checked'))n.removeAttribute('bis_skin_checked');if(n.querySelectorAll)n.querySelectorAll('[bis_skin_checked]').forEach(function(e){e.removeAttribute('bis_skin_checked')})}});if(r.type==='attributes'&&r.target.hasAttribute('bis_skin_checked'))r.target.removeAttribute('bis_skin_checked')})}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['bis_skin_checked']})}catch(e){}` }} />
        <DotPattern cy={1} cr={1.2} cx={1} width={20} height={20} className="pointer-events-none fixed inset-0 z-0 h-full w-full fill-black/[0.12] dark:fill-white/[0.11]" />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
