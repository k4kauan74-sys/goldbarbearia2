import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { Scissors, Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Golden Fade from Top */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* The Golden Fade Gradient: Gold at top, Black at bottom */}
        <div className="absolute inset-0 z-0 bg-black" />
        <div className="absolute inset-0 z-0 bg-gold-black-fade" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(217,174,26,0.15)_0%,_transparent_70%)]" />
        
        <div className="container relative z-10 px-4 text-center mt-20">
          <div className="inline-block mb-6 py-2 px-6 border border-primary/30 rounded-full bg-black/50 backdrop-blur-sm animate-pulse">
            <span className="text-primary text-xs font-black uppercase tracking-[0.3em]">A Excelência em Cada Detalhe</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black mb-4 tracking-tighter uppercase italic leading-[0.85] text-white">
            Gold <span className="text-primary block md:inline drop-shadow-[0_0_25px_rgba(217,174,26,0.5)]">Barbearia</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 font-light tracking-[0.2em] uppercase">
            Estilo <span className="text-primary font-bold">Premium</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/agendar" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-16 py-6 rounded-sm text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(217,174,26,0.4)]"
            >
              Agendar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Starts on Pure Black */}
      <section id="servicos" className="pb-24 pt-12 bg-black relative z-20">
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-4 tracking-tight italic">
              Nossos <span className="text-primary">Preços</span>
            </h2>
            <div className="w-40 h-1 bg-primary mx-auto shadow-[0_0_15px_rgba(217,174,26,0.6)]" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {MOCK_SERVICES.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-7 rounded-sm border border-white/5 hover:border-primary/40 transition-all group bg-card/40 backdrop-blur-md hover:translate-y-[-4px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                  <div className="flex items-center text-white/40 text-xs font-bold uppercase tracking-widest">
                    <Clock className="h-3.5 w-3.5 mr-2 text-primary/60" />
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
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <Scissors className="text-primary h-8 w-8" />
                <span className="font-headline text-3xl font-bold tracking-tight text-white uppercase italic">
                  Gold<span className="text-primary">Barbearia</span>
                </span>
              </div>
              <p className="text-white/50 text-lg leading-relaxed max-w-sm">
                Cuidando do seu estilo com maestria desde 2010. Onde tradição encontra a modernidade no mais alto padrão.
              </p>
              <div className="flex gap-6">
                <Link href="#" className="p-3 border border-white/10 rounded-full hover:text-primary hover:border-primary transition-all"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="p-3 border border-white/10 rounded-full hover:text-primary hover:border-primary transition-all"><Facebook className="h-6 w-6" /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold uppercase mb-8 tracking-widest border-l-4 border-primary pl-4">Onde estamos</h4>
              <ul className="space-y-6 text-white/60 text-lg">
                <li className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <span>Av. Central, 1234 - Centro<br />São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0" />
                  <span>(11) 98765-4321</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold uppercase mb-8 tracking-widest border-l-4 border-primary pl-4">Horários</h4>
              <ul className="space-y-4 text-white/60 text-lg">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="font-medium">Segunda - Sexta</span>
                  <span className="text-white">09:00 - 19:00</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="font-medium">Sábado</span>
                  <span className="text-white">09:00 - 17:00</span>
                </li>
                <li className="flex justify-between text-secondary font-bold">
                  <span>Domingo</span>
                  <span className="uppercase tracking-widest">Fechado</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-center text-white/30 text-sm font-bold uppercase tracking-[0.3em]">
            &copy; 2025 GoldBarbearia. Design de Ouro.
          </div>
        </div>
      </footer>
    </div>
  );
}
