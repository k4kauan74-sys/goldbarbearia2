
"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AgendarPage() {
  const EXTERNAL_BOOKING_URL = "https://agendeonline.salonsoft.com.br/goldbarbearia";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="container mx-auto px-4 text-center relative z-10 space-y-8">
        <h1 className="text-5xl md:text-8xl font-anton text-white uppercase tracking-tighter">
          QUASE <span className="text-shimmer">LÁ</span>
        </h1>
        <p className="text-white/40 text-lg md:text-xl font-medium max-w-lg mx-auto uppercase tracking-widest">
          Você será redirecionado para nossa plataforma oficial de agendamentos.
        </p>
        
        <div className="pt-8">
          <Link href={EXTERNAL_BOOKING_URL} target="_blank">
            <Button size="lg" className="h-20 px-12 bg-primary text-black font-anton text-xl uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
              Ir para Agendamento <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
