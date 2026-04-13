
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors, CheckCircle2, ChevronLeft, ArrowRight, Circle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TIME_SLOTS } from "@/lib/mock-data";
import { Service, Professional } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CustomCalendar } from "@/components/custom-calendar";

type Step = 'service' | 'professional' | 'datetime' | 'contact' | 'success';

export function BookingForm() {
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [today, setToday] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now);
    setToday(now);

    // Load dynamic data from localStorage
    const savedServices = JSON.parse(localStorage.getItem('gold_services') || '[]');
    const savedProfs = JSON.parse(localStorage.getItem('gold_professionals') || '[]');

    if (savedServices.length > 0) {
      setServices(savedServices);
    } else {
      import('@/lib/mock-data').then(m => setServices(m.MOCK_SERVICES));
    }

    if (savedProfs.length > 0) {
      setProfessionals(savedProfs);
    } else {
      import('@/lib/mock-data').then(m => setProfessionals(m.MOCK_PROFESSIONALS));
    }
  }, []);

  const steps: Step[] = ['service', 'professional', 'datetime', 'contact', 'success'];
  const currentStepIndex = steps.indexOf(step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast({ title: "Ops!", description: "Por favor, preencha seu nome e telefone.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      const newAppointment = {
        id: Math.random().toString(36).substr(2, 9),
        clientName,
        phone: clientPhone,
        serviceId: selectedService?.id,
        professionalId: selectedProfessional?.id,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        time: selectedTime,
        status: 'confirmed'
      };
      
      const existing = JSON.parse(localStorage.getItem('gold_appointments') || '[]');
      localStorage.setItem('gold_appointments', JSON.stringify([...existing, newAppointment]));
    }, 1500);
  };

  const prevStep = () => {
    setStep(steps[currentStepIndex - 1]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="glass rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-primary/5 border-white/5 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

        {step === 'service' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-6xl font-anton mb-12 text-white uppercase tracking-tighter">
              SELECIONE O <span className="text-shimmer">SERVIÇO</span>
            </h2>
            <div className="grid gap-4">
              {services.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('professional'); }}
                  className="flex items-center justify-between p-8 glass rounded-3xl hover:border-primary/40 hover:bg-white/[0.03] transition-all duration-500 group"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-mono text-[10px] text-neutral-600 group-hover:text-primary transition-colors">0{idx + 1}</span>
                    <div className="text-left">
                      <h3 className="font-anton text-2xl text-white group-hover:text-shimmer uppercase tracking-widest">{s.name}</h3>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">{s.duration} MINUTOS</p>
                    </div>
                  </div>
                  <div className="font-anton text-2xl text-primary">R$ {s.price.toFixed(0)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'professional' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                ESCOLHA O <span className="text-shimmer">PROFISSIONAL</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-10 md:gap-16">
              {professionals.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProfessional(p); setStep('datetime'); }}
                  className="group flex flex-col items-center gap-4 transition-all duration-300"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-primary transition-colors bg-neutral-900 shadow-xl group-hover:shadow-primary/20">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-anton text-sm md:text-lg text-white group-hover:text-primary uppercase tracking-widest transition-colors">{p.name.split(' ')[0]}</h3>
                    <p className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">{p.specialty.split(' ')[0]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                DATA E <span className="text-shimmer">HORA</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-7">
                <div className="glass rounded-[2rem] p-8">
                  <CustomCalendar
                    selectedDate={selectedDate}
                    onSelect={(date) => setSelectedDate(date)}
                    disabledDays={(date) => {
                      if (!today) return false;
                      const compareDate = new Date(date);
                      compareDate.setHours(0, 0, 0, 0);
                      const todayCompare = new Date(today);
                      todayCompare.setHours(0, 0, 0, 0);
                      return compareDate < todayCompare || date.getDay() === 0;
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); setStep('contact'); }}
                      className={cn(
                        "py-5 px-2 text-[10px] font-mono border rounded-2xl transition-all uppercase tracking-widest",
                        selectedTime === time 
                          ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(197,160,89,0.3)]" 
                          : "border-white/5 text-neutral-500 hover:border-white/20 hover:text-white"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                REVISÃO DOS <span className="text-shimmer">DADOS</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="glass p-10 rounded-[2rem] border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <Scissors className="text-primary/10 w-24 h-24 rotate-12" />
                  </div>
                  <span className="text-primary uppercase text-[9px] font-mono tracking-[0.5em] mb-10 block">Comprovante Digital de Agendamento</span>
                  <div className="grid grid-cols-2 gap-y-10 gap-x-8 relative z-10">
                    <div>
                      <p className="text-[8px] text-neutral-600 uppercase font-mono tracking-widest mb-2">Serviço</p>
                      <p className="font-anton text-2xl text-white uppercase tracking-widest">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-neutral-600 uppercase font-mono tracking-widest mb-2">Especialista</p>
                      <p className="font-anton text-2xl text-white uppercase tracking-widest">{selectedProfessional?.name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-neutral-600 uppercase font-mono tracking-widest mb-2">Data</p>
                      <p className="font-anton text-2xl text-white uppercase tracking-widest">{selectedDate ? format(selectedDate, "dd MMM", { locale: ptBR }) : ''}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-neutral-600 uppercase font-mono tracking-widest mb-2">Hora</p>
                      <p className="font-anton text-2xl text-white uppercase tracking-widest">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center">
                    <span className="font-anton text-xl text-white uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-anton text-shimmer">R$ {selectedService?.price.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10 flex flex-col justify-center">
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-mono text-neutral-500">Identificação do Cliente</Label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="DIGITE SEU NOME" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-2xl font-medium text-white placeholder:text-neutral-800 focus-visible:ring-0 focus-visible:border-primary transition-all font-anton"
                    required
                  />
                </div>
                <div className="space-y-6">
                  <Label className="text-[10px] uppercase tracking-[0.3em] font-mono text-neutral-500">WhatsApp / Telefone</Label>
                  <Input 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-2xl font-medium text-white placeholder:text-neutral-800 focus-visible:ring-0 focus-visible:border-primary transition-all font-anton"
                    required
                  />
                </div>
                <div className="shiny-border w-full mt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="shiny-border-content w-full bg-transparent text-white hover:bg-white/[0.03] py-14 text-2xl font-anton uppercase tracking-[0.4em] transition-all duration-500"
                  >
                    {isSubmitting ? "PROCESSANDO..." : "CONFIRMAR RESERVA"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-24 flex flex-col items-center text-center animate-in zoom-in duration-700">
            <div className="w-28 h-28 rounded-full glass flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(197,160,89,0.25)] border-primary/20">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-7xl md:text-9xl font-anton text-white mb-8 uppercase tracking-tighter">SINCRONIZADO</h2>
            <p className="text-neutral-500 uppercase tracking-[0.5em] text-[10px] max-w-lg mx-auto mb-20 leading-loose">
              Seu agendamento foi processado com sucesso em nossos servidores. Aguardamos sua chegada no horário selecionado para uma experiência Gold.
            </p>
            <div className="shiny-border">
              <Button 
                onClick={() => router.push('/')}
                className="shiny-border-content bg-transparent text-white hover:bg-white/[0.03] px-20 py-10 font-anton uppercase tracking-[0.3em] text-[10px]"
              >
                VOLTAR AO INÍCIO
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
