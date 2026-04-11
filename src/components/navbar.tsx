"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] h-20 mix-blend-nav px-8 md:px-12 flex items-center justify-between">
      <Link href="/" className="group">
        <span className="font-anton text-2xl tracking-widest text-white uppercase">
          GoldBarbearia
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-10 font-medium uppercase tracking-[0.2em] text-[10px]">
        <Link href="/" className="text-white hover:text-primary transition-colors">Início</Link>
        <Link href="/#servicos" className="text-white hover:text-primary transition-colors">Serviços</Link>
        <Link href="/admin/login" className="text-white/60 hover:text-white transition-colors">Admin</Link>
        <Link 
          href="/agendar" 
          className="border border-white px-8 py-3 hover:bg-white hover:text-black transition-all duration-500 font-semibold"
        >
          Agendar
        </Link>
      </div>

      <div className="md:hidden flex items-center gap-4">
        <Link href="/agendar" className="border border-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white">
          Agendar
        </Link>
      </div>
    </nav>
  );
}
