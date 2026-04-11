import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-[#171e19]">
        {/* Ambient Blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b7c6c2] rounded-full blur-orb opacity-20 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#bbe2f5] rounded-full blur-orb opacity-20 animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 px-4 flex flex-col items-center">
          <div className="mb-12">
            <h1 className="text-[12vw] md:text-[18vw] font-anton tracking-tighter leading-[0.8] text-white flex flex-col items-center">
              <span>GOLD</span>
              <span className="text-outline">BARBEARIA</span>
            </h1>
          </div>

          <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-end gap-8 mt-12">
            <div className="max-w-[320px] text-accent uppercase text-[10px] font-semibold tracking-[0.3em] leading-relaxed">
              ESTILO PREMIUM. <br />
              CUIDADO EDITORIAL PARA O HOMEM QUE BUSCA EXCELÊNCIA ABSOLUTA EM CADA DETALHE.
            </div>
            
            <Link href="/agendar" className="group flex items-center gap-4">
              <span className="font-anton text-4xl text-white group-hover:text-primary transition-colors uppercase">Agendar Agora</span>
              <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight className="text-white group-hover:text-black" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#171e19] pt-48 pb-12">
        <div className="container mx-auto px-8 md:px-12">
          <div className="mb-32">
            <h2 className="text-8xl md:text-[12rem] font-anton text-white mb-12">LET'S <br /> CREATE.</h2>
            <Link href="mailto:contato@goldbarbearia.com" className="font-anton text-4xl md:text-6xl text-primary underline underline-offset-[16px] decoration-1 hover:text-white transition-colors">
              CONTATO@GOLDBARBEARIA.COM
            </Link>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            <div>© 2025 GOLDBARBEARIA. DESIGN DE ALTO PADRÃO.</div>
            <div className="flex gap-12">
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">Admin Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
