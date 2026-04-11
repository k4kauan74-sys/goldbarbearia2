
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
        <div className="absolute inset-0 z-0 bg-gold-black-fade opacity-15" />
        
        <div className="container relative z-10 px-4 text-center mt-20">
          <div className="inline-block mb-8 py-2 px-8 border border-primary/20 rounded-sm bg-black/40 backdrop-blur-sm">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Excelência Absoluta</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black mb-6 tracking-tighter uppercase leading-[0.8] text-white">
            Gold <span className="block md:inline text-outline-gold">Barbearia</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-2xl mx-auto mb-16 font-black tracking-[0.4em] uppercase">
            Estilo <span className="text-primary">Premium</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/agendar" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-16 py-7 rounded-sm text-xs font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
            >
              Agendar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="pb-32 pt-16 bg-transparent relative z-20">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tighter">
              Nossos <span className="text-primary">Preços</span>
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {MOCK_SERVICES.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-8 rounded-sm border border-white/5 hover:border-primary/20 transition-all group bg-card/20 backdrop-blur-sm"
              >
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                  <div className="flex items-center text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Clock className="h-3 w-3 mr-2 text-primary/50" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-primary italic">
                  R$ {service.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-24 border-t border-white/5 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-20 mb-20">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 border border-primary/50 rounded-sm">
                  <span className="font-headline text-lg font-black text-outline-gold leading-none">G</span>
                </div>
                <span className="font-headline text-2xl font-black tracking-tighter text-white uppercase">
                  Gold<span className="text-primary">Barbearia</span>
                </span>
              </div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest leading-loose max-w-sm">
                Cuidando do seu estilo com maestria desde 2010. Onde tradição encontra a modernidade no mais alto padrão.
              </p>
              <div className="flex gap-6">
                <Link href="#" className="p-3 border border-white/5 rounded-sm hover:text-primary hover:border-primary transition-all"><Instagram className="h-4 w-4" /></Link>
                <Link href="#" className="p-3 border border-white/5 rounded-sm hover:text-primary hover:border-primary transition-all"><Facebook className="h-4 w-4" /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase mb-10 tracking-[0.3em] border-l-4 border-primary pl-4">Localização</h4>
              <ul className="space-y-8 text-white/40 text-xs font-bold uppercase tracking-widest">
                <li className="flex items-start gap-4">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="leading-relaxed">Av. Central, 1234 - Centro<br />São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>(11) 98765-4321</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase mb-10 tracking-[0.3em] border-l-4 border-primary pl-4">Expediente</h4>
              <ul className="space-y-6 text-white/40 text-xs font-bold uppercase tracking-widest">
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span>Seg - Sex</span>
                  <span className="text-white font-black">09:00 - 19:00</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-3">
                  <span>Sábado</span>
                  <span className="text-white font-black">09:00 - 17:00</span>
                </li>
                <li className="flex justify-between text-primary font-black">
                  <span>Domingo</span>
                  <span className="tracking-[0.2em]">Fechado</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 text-center text-white/10 text-[9px] font-black uppercase tracking-[0.5em]">
            &copy; 2025 GoldBarbearia. Design de Ouro.
          </div>
        </div>
      </footer>
    </div>
  );
}
