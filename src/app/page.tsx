import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { ArrowRight, Instagram, Facebook } from "lucide-react";

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
              Estilo Premium. <br />
              Cuidado editorial para o homem que busca excelência absoluta em cada detalhe.
            </div>
            
            <Link href="/agendar" className="group flex items-center gap-4">
              <span className="font-anton text-4xl text-white group-hover:text-primary transition-colors">AGENDAR AGORA</span>
              <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowRight className="text-white group-hover:text-black" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio/Services Section */}
      <section id="servicos" className="bg-white py-32 text-[#171e19]">
        <div className="container mx-auto px-8 md:px-12">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <h2 className="text-8xl md:text-[10rem] font-anton leading-none">
              SELECTED <br /> SERVICES
            </h2>
            <div className="text-[12px] font-bold uppercase tracking-[0.4em] border-b border-[#171e19] pb-4">
              Our Craftsmanship
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-20 gap-y-32">
            {MOCK_SERVICES.map((service, idx) => (
              <div key={service.id} className={idx % 2 !== 0 ? "md:mt-32" : ""}>
                <div className="group relative overflow-hidden bg-gray-100 aspect-[4/5] mb-8">
                   <div className="absolute inset-0 bg-[#171e19]/0 group-hover:bg-[#171e19]/60 transition-all duration-500 z-10 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 flex items-center justify-center">
                        <span className="font-anton text-sm tracking-widest">VIEW</span>
                      </div>
                   </div>
                   <img 
                    src={`https://picsum.photos/seed/${service.id}/800/1000`} 
                    alt={service.name}
                    className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-110"
                   />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-anton text-4xl mb-2">{service.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{service.duration} MIN / EXPERT LEVEL</p>
                  </div>
                  <div className="font-anton text-3xl">R$ {service.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-[#171e19] py-32 overflow-hidden">
        <div className="container mx-auto px-8 md:px-12">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-full h-full bg-[#d5f4f9]/5" />
              <img 
                src="https://picsum.photos/seed/featured/1000/1200" 
                alt="Expertise" 
                className="relative z-10 w-full grayscale"
              />
            </div>
            <div>
              <span className="text-primary font-anton text-2xl tracking-widest mb-6 block">EXPERTISE</span>
              <h2 className="text-6xl md:text-8xl font-anton text-white mb-8">ELEVATING <br /> THE STANDARD</h2>
              <p className="text-accent text-lg max-w-md mb-12 font-light">
                Combinamos tradição secular com visão contemporânea para criar não apenas um corte, mas uma identidade única para cada cliente.
              </p>
              <Link href="/agendar" className="group flex items-center gap-4 text-white hover:text-primary transition-colors">
                <span className="font-anton text-2xl">SAIBA MAIS</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-[#fafafa] py-32 text-[#171e19]">
        <div className="container mx-auto px-8 md:px-12">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="text-accent uppercase text-[10px] font-black tracking-[0.4em] mb-12 block">Capabilities</span>
              <ul className="space-y-6">
                {['Corte Clássico', 'Visagismo de Barba', 'Tratamento Capilar', 'Estética Facial'].map((item) => (
                  <li key={item} className="group flex items-center gap-4">
                    <div className="h-[1px] w-10 bg-accent group-hover:w-16 transition-all duration-500" />
                    <span className="font-bold uppercase tracking-widest text-xs">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-8">
              <h3 className="text-5xl md:text-7xl font-light leading-tight">
                PROPORCIONAMOS UMA <span className="italic text-accent">EXPERIÊNCIA CINEMATOGRÁFICA</span> ONDE O SEU ESTILO É O PROTAGONISTA.
              </h3>
            </div>
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
