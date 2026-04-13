import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-start items-center overflow-hidden pt-36">
        {/* Ambient Blurs - Dourado e Alaranjado */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 px-4 flex flex-col items-center text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-[18vw] md:text-[10rem] font-anton leading-[0.85] text-white flex flex-col items-center uppercase tracking-tighter">
              <span>GOLD</span>
              <span className="text-shimmer">BARBEARIA</span>
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
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
