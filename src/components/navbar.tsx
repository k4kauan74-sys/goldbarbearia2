"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[672px] z-[100]">
      <nav className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-primary/10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
          <span className="font-serif text-xl tracking-tight text-white uppercase">
            GoldBarbearia
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-medium uppercase tracking-[0.2em] text-[10px]">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">Início</Link>
          <Link href="/admin/login" className="text-neutral-400 hover:text-white transition-colors">Admin</Link>
        </div>

        <Link href="/agendar">
          <button className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all active:scale-95">
            Agendar
          </button>
        </Link>
      </nav>
    </div>
  );
}