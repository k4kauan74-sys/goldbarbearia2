
"use client";

import { Navbar } from "@/components/navbar";
import { BookingForm } from "@/components/booking-form";

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none opacity-20" />
      
      <main className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-8xl font-anton text-white uppercase tracking-tighter mb-4">
            RESERVE SEU <span className="text-shimmer">MOMENTO</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">
            Sincronização em tempo real com nossos especialistas
          </p>
        </div>

        <BookingForm />
      </main>

      {/* Footer Copy */}
      <footer className="mt-20 py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold">
            &copy; {new Date().getFullYear()} Gold Barbearia — Agendamento Seguro Cloud.
          </p>
        </div>
      </footer>
    </div>
  );
}
