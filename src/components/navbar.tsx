
"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function Navbar() {
  const EXTERNAL_BOOKING_URL = "https://agendeonline.salonsoft.com.br/goldbarbearia";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[672px] z-[100]">
      <nav className="glass rounded-full px-3 md:px-6 py-3 flex items-center justify-between shadow-2xl shadow-primary/10 border-white/10">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="https://wa.me/554892465639" target="_blank" className="text-white hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <Link href="https://tiktok.com/@goldbarbearia" target="_blank" className="text-white hover:text-primary transition-colors">
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.3a6.786 6.786 0 0 1-1.87-1.51c-.01 1.29.01 2.58-.01 3.87 0 3.12-.99 6.34-3.76 7.97a8.846 8.846 0 0 1-8.52.09 8.243 8.243 0 0 1-3.61-4.21c-.81-2.13-.71-4.66.41-6.66 1.12-1.99 3.11-3.4 5.34-3.7 1.28-.17 2.6-.03 3.8.35v4.11a4.234 4.234 0 0 0-2.22-.32 4.095 4.095 0 0 0-3.32 3.09 4.316 4.316 0 0 0 1.28 4.3c1.02.84 2.41 1.08 3.63.59a4.234 4.234 0 0 0 2.45-3.83c.01-4.47.01-8.94.01-13.41z"/>
            </svg>
          </Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-8 font-medium uppercase tracking-[0.15em] text-[8px] md:text-[10px] mx-2">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Início</Link>
          <Link href="/admin/login" className="text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Admin</Link>
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
