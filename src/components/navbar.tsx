"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[672px] z-[100]">
      <nav className="glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between shadow-2xl shadow-primary/10">
        <Link href="/" className="flex items-center gap-1.5 group shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
          <span className="font-anton text-base md:text-xl tracking-widest text-white uppercase">
            Gold
          </span>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8 font-medium uppercase tracking-[0.2em] text-[9px] md:text-[10px]">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">Início</Link>
          <Link href="/admin/login" className="text-neutral-400 hover:text-white transition-colors">Admin</Link>
        </div>

        <Link href="/agendar" className="shrink-0">
          <button className="bg-white text-black px-4 md:px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-neutral-200 transition-all active:scale-95">
            Agendar
          </button>
        </Link>
      </nav>
    </div>
  );
}
