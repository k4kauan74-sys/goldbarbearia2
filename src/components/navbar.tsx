
"use client";

import Link from "next/link";
import { MessageCircle, Instagram } from "lucide-react";

export function Navbar() {
  const EXTERNAL_BOOKING_URL = "https://agendeonline.salonsoft.com.br/goldbarbearia";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[672px] z-[100]">
      <nav className="glass rounded-full px-3 md:px-6 py-3 flex items-center justify-between shadow-2xl shadow-primary/10 border-white/10">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="https://wa.me/554892465639" target="_blank" className="text-white hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <Link href="https://www.instagram.com/goldbarbearia_/" target="_blank" className="text-white hover:text-primary transition-colors">
            <Instagram className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-8 font-medium uppercase tracking-[0.15em] text-[8px] md:text-[10px] mx-2">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Início</Link>
          <Link href="/#regras" className="text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Regras</Link>
        </div>

        <Link href={EXTERNAL_BOOKING_URL} target="_blank" className="shrink-0">
          <button className="bg-white text-black px-3 md:px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[8px] md:text-[10px] hover:bg-neutral-200 transition-all active:scale-95 shadow-lg">
            Agendar
          </button>
        </Link>
      </nav>
    </div>
  );
}
