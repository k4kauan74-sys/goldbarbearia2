import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { Scissors, Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'custom-hero-bg')?.imageUrl || "https://picsum.photos/seed/barberhero/1920/1080";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroImage}
            alt="Gold Barbearia Background"
            fill
            className="object-cover opacity-50 grayscale-[0.2] hero-mask"
            priority
            unoptimized={heroImage.includes('drive.google.com')}
            data-ai-hint="luxury background"
          />
          {/* Overlay Gradients for smooth transition to black/gold */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 text-center mt-12">
          <h1 className="text-6xl md:text-9xl font-black mb-4 tracking-tighter uppercase italic leading-none">
            Gold <span className="text-primary">Barbearia</span>
          </h1>
          <p className="text-xl md:text-3xl text-white/90 max-w-2xl mx-auto mb-10 font-light tracking-widest uppercase">
            Estilo <span className="text-primary font-bold">Premium</span> para Homens de Ouro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/agendar" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded-sm text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30"
            >
              Agendar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Tabela de Valores mais próxima do Hero */}
      <section id="servicos" className="py-12 bg-card relative z-20 -mt-10 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight italic">
              Nossos <span className="text-primary">Preços</span>
            </h2>
            <div className="w-32 h-1 bg-primary mx-auto shadow-[0_0_10px_rgba(217,174,26,0.5)]" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto">
            {MOCK_SERVICES.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-5 rounded-sm border border-white/5 hover:border-primary/50 transition-all group bg-background/80 backdrop-blur-sm hover:translate-y-[-2px]"
              >
                <div>
                  <h3 className="text-lg font-bold mb-0.5 group-hover:text-primary transition-colors">{service.name}</h3>
                  <div className="flex items-center text-white/40 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
                <div className="text-xl font-black text-primary italic">
                  R$ {service.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-16 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Scissors className="text-primary h-6 w-6" />
                <span className="font-headline text-2xl font-bold tracking-tight text-white uppercase italic">
                  Gold<span className="text-primary">Barbearia</span>
                </span>
              </div>
              <p className="text-white/60 leading-relaxed mb-6">
                Cuidando do seu estilo com maestria desde 2010. Onde tradição encontra a modernidade.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="hover:text-primary transition-colors"><Instagram /></Link>
                <Link href="#" className="hover:text-primary transition-colors"><Facebook /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold uppercase mb-6 tracking-wider">Onde estamos</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span>Av. Central, 1234 - Centro<br />São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>(11) 98765-4321</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold uppercase mb-6 tracking-wider">Horários</h4>
              <ul className="space-y-2 text-white/60">
                <li className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span>09:00 - 19:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado</span>
                  <span>09:00 - 17:00</span>
                </li>
                <li className="flex justify-between text-secondary font-bold">
                  <span>Domingo</span>
                  <span>Fechado</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-white/40 text-sm">
            &copy; 2025 GoldBarbearia. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
