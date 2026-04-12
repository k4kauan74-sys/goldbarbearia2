"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors, CheckCircle2, ChevronLeft, ArrowRight, Circle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { MOCK_SERVICES, MOCK_PROFESSIONALS, TIME_SLOTS } from "@/lib/mock-data";
import { Service, Professional } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now);
    setToday(now);
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
      <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-primary/5">
        {step === 'service' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-6xl font-anton mb-12 text-white uppercase tracking-tighter">SELECIONE O <br /> <span className="text-shimmer">SERVIÇO</span></h2>
            <div className="grid gap-4">
              {MOCK_SERVICES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('professional'); }}
                  className="flex items-center justify-between p-8 glass rounded-2xl hover:border-primary/40 hover:bg-white/5 transition-all duration-500 group"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-mono text-[10px] text-neutral-500 group-hover:text-primary transition-colors">0{idx + 1}</span>
                    <div className="text-left">
                      <h3 className="font-anton text-2xl text-white group-hover:text-shimmer uppercase tracking-wider">{s.name}</h3>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{s.duration} MINS</p>
                    </div>
                  </div>
                  <div className="font-anton text-2xl text-primary">R$ {s.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'professional' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">ESCOLHA O <br /> <span className="text-shimmer">PROFISSIONAL</span></h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {MOCK_PROFESSIONALS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProfessional(p); setStep('datetime'); }}
                  className="group relative glass p-6 rounded-3xl hover:border-primary/40 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl mb-6 bg-neutral-900 border border-white/5">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  </div>
                  <h3 className="font-anton text-xl text-white mb-1 uppercase tracking-wider">{p.name}</h3>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{p.specialty}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">DATA E <br /> <span className="text-shimmer">HORA</span></h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-7">
                <div className="glass rounded-3xl p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                      }
                    }}
                    className="w-full text-white"
                    locale={ptBR}
                    disabled={(date) => {
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
                        "py-4 px-2 text-[10px] font-mono border rounded-xl transition-all uppercase tracking-widest",
                        selectedTime === time 
                          ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
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
              <h2 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">REVISÃO DOS <br /> <span className="text-shimmer">DADOS</span></h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="glass p-8 rounded-3xl border-white/10">
                  <span className="text-primary uppercase text-[10px] font-mono tracking-[0.4em] mb-8 block">Configuração de Agendamento</span>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase font-mono tracking-widest mb-1">Serviço</p>
                      <p className="font-anton text-xl text-white uppercase">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase font-mono tracking-widest mb-1">Especialista</p>
                      <p className="font-anton text-xl text-white uppercase">{selectedProfessional?.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase font-mono tracking-widest mb-1">Data</p>
                      <p className="font-anton text-xl text-white uppercase">{selectedDate ? format(selectedDate, "dd MMM", { locale: ptBR }) : ''}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase font-mono tracking-widest mb-1">Hora</p>
                      <p className="font-anton text-xl text-white uppercase">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-end">
                    <span className="font-anton text-xl text-white uppercase">Investimento</span>
                    <span className="text-3xl font-anton text-shimmer">R$ {selectedService?.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">Identificação</Label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="DIGITE SEU NOME" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-xl font-medium text-white placeholder:text-neutral-700 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">WhatsApp</Label>
                  <Input 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-xl font-medium text-white placeholder:text-neutral-700 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="shiny-border w-full">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="shiny-border-content w-full bg-transparent text-white hover:bg-white/5 py-12 text-xl font-anton uppercase tracking-[0.3em] transition-all duration-500"
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
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-12 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-6xl md:text-8xl font-anton text-white mb-6 uppercase tracking-tighter">CONFIRMADO</h2>
            <p className="text-neutral-500 uppercase tracking-[0.4em] text-[10px] max-w-md mx-auto mb-16">
              Sua sessão foi agendada nos sistemas Gold. Aguardamos sua chegada no horário sincronizado.
            </p>
            <div className="shiny-border">
              <Button 
                onClick={() => router.push('/')}
                className="shiny-border-content bg-transparent text-white hover:bg-white/5 px-16 py-8 font-anton uppercase tracking-[0.3em] text-xs"
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
