
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight, Scissors, Check } from "lucide-react";

export default function Home() {
  const EXTERNAL_BOOKING_URL = "https://agendeonline.salonsoft.com.br/goldbarbearia";

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      {/* Hero Section Inicial */}
      <section className="relative min-h-screen flex flex-col justify-start items-center overflow-hidden pt-36 pb-32">
        {/* Ambient Blurs */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

        {/* Grid Background Sutil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="container relative z-10 px-4 flex flex-col items-center text-center">
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-[18vw] md:text-[10rem] font-anton leading-[0.85] text-white flex flex-col items-center uppercase tracking-tighter">
              <span>GOLD</span>
              <span className="text-shimmer">BARBEARIA</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-center gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="shiny-border">
              <Link href={EXTERNAL_BOOKING_URL} target="_blank" className="shiny-border-content px-12 py-5 flex items-center gap-3 group">
                <span className="font-bold uppercase tracking-[0.3em] text-xs text-white group-hover:text-primary transition-colors">Agendar Agora</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Seção Hero Premium */}
            <div className="flex flex-col items-center gap-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 mt-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">PLANO EXCLUSIVO | BARBEARIA</span>
              </div>

              <h2 className="text-4xl md:text-7xl font-anton leading-[1.1] text-white uppercase tracking-tighter max-w-sm md:max-w-4xl">
                JA PENSOU <span className="text-[#F5F5F5]">CORTAR</span> O <span className="text-[#D4AF37]">CABELO</span> QUANTAS VEZES QUISER?
              </h2>
              
              <div className="flex flex-col items-center gap-10">
                <p className="text-[#F5F5F5] text-2xl md:text-5xl font-anton uppercase tracking-tight leading-none">
                  A PARTIR DE <span className="text-[#D4AF37]">69,90 R$/MÊS</span> É POSSIVEL
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <Link href="#planos" className="flex-1">
                    <button className="w-full bg-[#D4AF37] text-black h-16 rounded-full font-anton text-sm uppercase tracking-[0.2em] hover:bg-[#C9A227] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-95">
                      Quero entrar
                    </button>
                  </Link>
                  <Link href="#planos" className="flex-1">
                    <button className="w-full bg-transparent text-white border border-[#2A2A2A] h-16 rounded-full font-anton text-sm uppercase tracking-[0.2em] hover:border-[#D4AF37]/40 transition-all active:scale-95">
                      saiba mais
                    </button>
                  </Link>
                </div>
              </div>
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

      {/* Seção de Planos */}
      <section id="planos" className="relative py-24 md:py-40 bg-[#030303] overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="text-primary uppercase text-[10px] font-black tracking-[0.5em] mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
              Planos e preços
            </span>
            <h2 className="text-5xl md:text-8xl font-anton text-white uppercase tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Escolha o plano ideal para você
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-bold uppercase tracking-widest text-[#F5F5F5]/40 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Atendimento prioritário
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" /> Economia mensal garantida
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-6xl mx-auto">
            {/* Plano Básico - MAIS POPULAR */}
            <div className="relative group animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/10 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative h-full glass border-primary/20 p-8 md:p-16 rounded-[3rem] flex flex-col items-start text-left shadow-[0_0_50px_rgba(212,175,55,0.05)]">
                <div className="absolute top-8 right-8">
                  <span className="bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                    Mais Popular
                  </span>
                </div>
                
                <div className="mb-10">
                  <h3 className="text-4xl font-anton text-white uppercase tracking-tighter mb-3">Plano Básico</h3>
                  <p className="text-[#F5F5F5]/40 text-[11px] uppercase font-bold tracking-[0.2em] leading-relaxed max-w-[240px]">
                    Perfeito para manter o visual em dia com praticidade
                  </p>
                </div>

                <div className="mb-12 flex items-baseline gap-2">
                  <span className="text-5xl md:text-7xl font-anton text-primary">R$ 69,90</span>
                  <span className="text-[#F5F5F5]/20 text-[12px] uppercase font-black tracking-widest">/mês</span>
                </div>

                <div className="space-y-6 mb-16 flex-1 w-full">
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Cortes ilimitados
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Segunda a quarta
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Corte de cabelo
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Atendimento ágil
                  </div>
                </div>

                <div className="w-full mt-auto pt-8 border-t border-white/5">
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
                      <span>Valor Avulso (4 cortes)</span>
                      <span className="line-through">R$ 180,00</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-emerald-500 font-bold">
                      <span>Economia no Semestral</span>
                      <span>- R$ 110,10</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-primary font-anton mt-1">
                      pague somente 69,90 R$/mês
                    </div>
                  </div>
                  <Link href="/checkout?plan=basico" className="w-full">
                    <button className="w-full h-20 bg-primary text-black font-anton text-lg uppercase tracking-[0.3em] rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)]">
                      Escolher plano
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Plano Gold */}
            <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="relative h-full glass border-white/10 p-8 md:p-16 rounded-[3rem] flex flex-col items-start text-left hover:border-primary/20 transition-all duration-700">
                <div className="mb-10">
                  <h3 className="text-4xl font-anton text-white uppercase tracking-tighter mb-3">Plano Gold</h3>
                  <p className="text-[#F5F5F5]/40 text-[11px] uppercase font-bold tracking-[0.2em] leading-relaxed max-w-[240px]">
                    Experiência completa para quem quer sempre estar impecável
                  </p>
                </div>

                <div className="mb-12 flex items-baseline gap-2">
                  <span className="text-5xl md:text-7xl font-anton text-white">R$ 145,00</span>
                  <span className="text-[#F5F5F5]/20 text-[12px] uppercase font-black tracking-widest">/mês</span>
                </div>

                <div className="space-y-6 mb-16 flex-1 w-full overflow-y-auto max-h-[300px] custom-scrollbar">
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Cortes ilimitados
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Segunda a quinta
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Barba
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Sobrancelha
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Atendimento prioritário
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Desconto em produtos
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Brindes exclusivos
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Sorteios mensais
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-[#F5F5F5]/80 uppercase font-bold tracking-[0.2em] border-b border-white/5 pb-5">
                    <Check className="w-5 h-5 text-primary shrink-0" /> Hidratação capilar e facial
                  </div>
                </div>

                <div className="w-full mt-auto pt-8 border-t border-white/5">
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
                      <span>Valor Avulso (4x Completo)</span>
                      <span className="line-through">R$ 360,00</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-emerald-500 font-bold">
                      <span>Economia no Semestral</span>
                      <span>- R$ 215,00</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-primary font-anton mt-1">
                      pague somente 145,00 R$/mês
                    </div>
                  </div>
                  <Link href="/checkout?plan=gold" className="w-full">
                    <button className="w-full h-20 bg-transparent text-white border border-white/10 font-anton text-lg uppercase tracking-[0.3em] rounded-full hover:bg-white hover:text-black hover:border-white transition-all active:scale-95">
                      Escolher plano
                    </button>
                  </Link>
                </div>
              </div>
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
