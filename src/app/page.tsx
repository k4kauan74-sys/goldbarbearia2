
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/lib/mock-data";
import { Scissors, Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section - Reduzida a altura de h-screen para min-h-[80vh] para trazer o conteúdo seguinte mais para cima */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/barberhero/1920/1080"
            alt="Barbearia Luxury"
            fill
            className="object-cover opacity-30 grayscale"
            priority
            data-ai-hint="luxury barbearia"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">
            Agende seu <span className="text-primary">Corte</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
            Experiência premium em barbearia clássica e moderna no coração da cidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/agendar" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-5 rounded-sm text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Agendar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Reduzido o padding superior de py-24 para pt-8 pb-24 */}
      <section id="servicos" className="py-16 md:pt-8 md:pb-24 bg-card relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
              Tabela de <span className="text-primary">Valores</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {MOCK_SERVICES.map((service) => (
              <div 
                key={service.id} 
                className="flex items-center justify-between p-6 rounded-sm border border-white/5 hover:border-primary/50 transition-colors group bg-background/50"
              >
                <div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{service.name}</h3>
                  <div className="flex items-center text-white/40 text-sm">
                    <Clock className="h-3 w-3 mr-1" />
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

      {/* Professionals Section */}
      <section id="profissionais" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
              Nossos <span className="text-primary">Especialistas</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {MOCK_PROFESSIONALS.map((prof) => (
              <Card key={prof.id} className="overflow-hidden border-none group bg-transparent">
                <div className="relative aspect-[4/5] mb-4">
                  <Image 
                    src={prof.photo} 
                    alt={prof.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                    data-ai-hint="man barber"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-bold">ATIVO</Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                    {prof.name}
                  </h3>
                  <p className="text-white/60 font-medium">{prof.specialty}</p>
                </CardContent>
              </Card>
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
            &copy; {new Date().getFullYear()} GoldBarbearia. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
