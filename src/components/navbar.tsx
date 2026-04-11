
"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent border-b border-white/5 h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-headline text-xl font-black tracking-tighter text-white uppercase">
            Gold<span className="text-primary">Barbearia</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-bold uppercase tracking-widest text-[10px]">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="/#servicos" className="hover:text-primary transition-colors">Serviços</Link>
          <Link href="/agendar" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-sm transition-all font-black">Agendar</Link>
          <Link href="/admin/login" className="text-white/40 hover:text-white border border-white/10 px-2 py-1 rounded-sm">Admin</Link>
        </div>
        <div className="md:hidden flex items-center gap-4">
           <Link href="/" className="text-white/40 text-[10px] font-black uppercase tracking-widest">Início</Link>
           <Link href="/agendar" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-sm font-black text-[10px] uppercase tracking-widest">AGENDAR</Link>
        </div>
      </div>
    </nav>
  );
}
