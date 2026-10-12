
"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Scissors, 
  CheckCircle2, 
  Crown, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ArrowRight,
  ListOrdered,
  Users
} from "lucide-react";
import Link from "next/link";

export default function SaibaMaisPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none opacity-20" />

      <main className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Breadcrumb */}
        <div className="mb-10">
          <Link href="/">
            <Button variant="ghost" className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] p-0 h-auto gap-2">
              <ChevronLeft className="w-4 h-4" /> Voltar ao início
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-5xl md:text-8xl font-anton text-white uppercase tracking-tighter mb-4">
            REGRAS DOS <span className="text-shimmer">PLANOS</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">Gold Barbearia — Transparência e Exclusividade</p>
        </div>

        <div className="grid gap-16 md:gap-24">
          {/* Plano Básico */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="bg-white/5 p-4 rounded-2xl">
                <Scissors className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                PLANO <span className="text-primary">BÁSICO</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-6">
                <p className="text-white/60 text-lg leading-relaxed">
                  O Plano Básico foi criado para quem deseja manter o visual sempre em dia com praticidade e economia. 
                  Ideal para o homem moderno que busca agilidade sem abrir mão da qualidade Gold.
                </p>
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-anton text-white uppercase tracking-widest text-sm mb-1">Funcionamento</p>
                      <p className="text-white/40 text-xs">Atendimento exclusivo por ordem de chegada de terça e quarta-feira.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ListOrdered className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-anton text-white uppercase tracking-widest text-sm mb-1">Limite de Uso</p>
                      <p className="text-white/40 text-xs">É permitido apenas 1 serviço por dia por cliente cadastrado no plano.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  "Cortes ilimitados",
                  "Atendimento de terça e quarta",
                  "Somente corte de cabelo",
                  "Ordem de chegada",
                  "Limite de 1 serviço por dia"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 glass rounded-2xl border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-anton text-white uppercase tracking-widest text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Plano Gold */}
          <section className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                PLANO <span className="text-shimmer">GOLD</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="space-y-6">
                <p className="text-white/60 text-lg leading-relaxed">
                  O Plano Gold foi desenvolvido para clientes que desejam uma experiência mais completa e com maior comodidade. 
                  A elite do cuidado masculino com benefícios exclusivos.
                </p>
                <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] space-y-4 shadow-[0_0_40px_rgba(212,175,55,0.05)]">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-anton text-white uppercase tracking-widest text-sm mb-1">Agendamento</p>
                      <p className="text-white/40 text-xs">Escolha entre agendar seu horário previamente ou ser atendido por ordem de chegada.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="font-anton text-white uppercase tracking-widest text-sm mb-1">Prioridade</p>
                      <p className="text-white/40 text-xs">Atendimento prioritário de terça, quarta e quinta-feira para todos os serviços.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  "Cortes ilimitados",
                  "Atendimento de terça, quarta e quinta",
                  "Cabelo, barba e sobrancelha",
                  "Atendimento prioritário",
                  "Pode agendar horário",
                  "Ordem de chegada disponível",
                  "Limite de 1 serviço por dia"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 glass border-primary/20 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-anton text-white uppercase tracking-widest text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h3 className="text-3xl md:text-5xl font-anton text-white uppercase tracking-tighter">
            PRONTO PARA O <span className="text-primary">PRÓXIMO NÍVEL?</span>
          </h3>
          <Link href="/#planos">
            <Button size="lg" className="h-20 px-16 bg-primary text-black font-anton text-xl uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-2xl shadow-primary/20">
              Escolher meu plano <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer Copy */}
      <footer className="mt-20 py-10 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-bold">
            &copy; {new Date().getFullYear()} Gold Barbearia — Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
