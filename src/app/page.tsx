import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight, Scissors, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section Inicial */}
      <section className="relative min-h-screen flex flex-col justify-start items-center overflow-hidden pt-36">
        {/* Ambient Blurs */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 px-4 flex flex-col items-center text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-[18vw] md:text-[10rem] font-anton leading-[0.85] text-white flex flex-col items-center uppercase tracking-tighter">
              <span>GOLD</span>
              <span className="text-shimmer">BARBEARIA</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="shiny-border">
              <Link href="/agendar" className="shiny-border-content px-12 py-5 flex items-center gap-3 group">
                <span className="font-bold uppercase tracking-[0.3em] text-xs text-white group-hover:text-primary transition-colors">Agendar Agora</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Metrics Ticker */}
        <div className="absolute bottom-0 w-full glass border-y border-white/5 py-4 overflow-hidden">
          <div className="ticker-scroll">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-16 px-8 items-center">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Local</span>
                  <span className="text-sm font-mono text-white uppercase">Rod. Gabriel Arns, 4806</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Atendimento</span>
                  <span className="text-sm font-mono text-primary">10/10 PREMIUM</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">WhatsApp</span>
                  <span className="text-sm font-mono text-secondary">(48) 9246-5639</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Premium - Seção de Assinatura */}
      <section className="relative py-24 md:py-32 bg-[#0A0A0A] overflow-hidden border-t border-white/5">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        {/* Glow Suave Dourado */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Lado Esquerdo - Conteúdo */}
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Plano Exclusivo | Barbearia</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-anton leading-[0.9] uppercase tracking-tighter">
                <span className="text-[#F5F5F5]">Pare de</span><br />
                <span className="text-[#D4AF37]">gastar</span><br />
                <span className="text-[#F5F5F5]">com cabelo</span>
              </h2>

              <p className="text-[#A8A8A8] text-sm md:text-base leading-relaxed tracking-wide font-light">
                Corte o cabelo quantas vezes quiser, com a liberdade de um plano feito pra quem valoriza estilo e praticidade. Um plano simples, direto e inteligente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="#" className="flex-1">
                  <button className="w-full bg-[#D4AF37] text-black h-16 rounded-full font-anton text-sm uppercase tracking-[0.2em] hover:bg-[#C9A227] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-95">
                    Quero entrar | R$69/mês
                  </button>
                </Link>
                <Link href="#" className="flex-1">
                  <button className="w-full bg-transparent text-white border border-[#2A2A2A] h-16 rounded-full font-anton text-sm uppercase tracking-[0.2em] hover:border-[#D4AF37]/40 transition-all active:scale-95">
                    Ver como funciona
                  </button>
                </Link>
              </div>
            </div>

            {/* Lado Direito - Elemento Visual */}
            <div className="relative group hidden md:block">
              <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-square glass rounded-[3rem] overflow-hidden border-white/5 flex items-center justify-center p-12">
                <Scissors className="w-48 h-48 text-[#D4AF37] opacity-20 rotate-12" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent" />
              </div>
            </div>

          </div>

          {/* Provas - Rodapé da Seção */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 pt-12 border-t border-white/5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-anton text-[#F5F5F5] uppercase tracking-widest text-sm">Cortes ilimitados</h4>
              </div>
              <p className="text-[#A8A8A8] text-[10px] uppercase tracking-widest pl-4">Sem restrições de agenda</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-anton text-[#F5F5F5] uppercase tracking-widest text-sm">Plano mensal</h4>
              </div>
              <p className="text-[#A8A8A8] text-[10px] uppercase tracking-widest pl-4">Simples, direto e automático</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <h4 className="font-anton text-[#F5F5F5] uppercase tracking-widest text-sm">Sem fidelidade</h4>
              </div>
              <p className="text-[#A8A8A8] text-[10px] uppercase tracking-widest pl-4">Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-8 md:px-12">
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="font-anton text-2xl text-white uppercase tracking-widest">GoldBarbearia</div>
            
            <div className="flex flex-col md:flex-row gap-12 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              <Link href="/" className="hover:text-white transition-colors">Início</Link>
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">Acesso Admin</Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
              <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
