
"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-sm rotate-45 group-hover:rotate-0 transition-transform duration-300">
            <Scissors className="text-primary-foreground -rotate-45 group-hover:rotate-0 transition-transform duration-300 h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-white uppercase italic">
            Gold<span className="text-primary">Barbearia</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-medium uppercase tracking-wider text-sm">
          <Link href="/#servicos" className="hover:text-primary transition-colors">Serviços</Link>
          <Link href="/#profissionais" className="hover:text-primary transition-colors">Profissionais</Link>
          <Link href="/agendar" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-sm transition-all font-bold">Agendar</Link>
          <Link href="/admin/login" className="text-white/60 hover:text-white text-xs border border-white/20 px-3 py-1 rounded-sm">Admin</Link>
        </div>
        <div className="md:hidden">
           <Link href="/agendar" className="bg-primary text-primary-foreground px-4 py-2 rounded-sm font-bold text-sm">AGENDAR</Link>
        </div>
      </div>
    </nav>
  );
}
