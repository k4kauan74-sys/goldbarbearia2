"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scissors, CheckCircle2, ChevronLeft, ArrowRight } from "lucide-react";
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
      <Card className="bg-background border-none shadow-none">
        {step === 'service' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-7xl font-anton mb-12 text-white">CHOOSE <br /> SERVICE</h2>
            <div className="grid gap-4">
              {MOCK_SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('professional'); }}
                  className="flex items-center justify-between p-8 border border-white/10 hover:border-primary transition-all duration-500 group"
                >
                  <div className="flex items-center gap-8">
                    <span className="font-anton text-2xl text-white/20 group-hover:text-primary transition-colors">0{MOCK_SERVICES.indexOf(s) + 1}</span>
                    <div className="text-left">
                      <h3 className="font-anton text-4xl text-white">{s.name}</h3>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{s.duration} MINUTOS</p>
                    </div>
                  </div>
                  <div className="font-anton text-3xl text-primary">R$ {s.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'professional' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-7xl font-anton text-white">SELECT <br /> EXPERT</h2>
              <Button variant="ghost" onClick={prevStep} className="text-accent hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {MOCK_PROFESSIONALS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProfessional(p); setStep('datetime'); }}
                  className="group relative"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-6 bg-muted">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-anton text-3xl text-white mb-1 uppercase">{p.name}</h3>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{p.specialty}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-7xl font-anton text-white">DATE & <br /> TIME</h2>
              <Button variant="ghost" onClick={prevStep} className="text-accent hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-7">
                <div className="border border-white/10 p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
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
                        "py-4 px-2 text-[10px] font-bold border transition-all uppercase tracking-widest",
                        selectedTime === time 
                          ? "bg-primary text-black border-primary" 
                          : "border-white/10 text-white/40 hover:border-white hover:text-white"
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
              <h2 className="text-7xl font-anton text-white">FINALIZE <br /> BOOKING</h2>
              <Button variant="ghost" onClick={prevStep} className="text-accent hover:text-white uppercase tracking-widest text-[10px]">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-20">
              <div className="space-y-12">
                <div className="border-b border-white/10 pb-8">
                  <span className="text-accent uppercase text-[10px] font-black tracking-[0.4em] mb-4 block">Reservation Details</span>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Service</p>
                      <p className="font-anton text-2xl text-white">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Expert</p>
                      <p className="font-anton text-2xl text-white">{selectedProfessional?.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Date</p>
                      <p className="font-anton text-2xl text-white">{selectedDate ? format(selectedDate, "dd MMM", { locale: ptBR }) : ''}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest mb-1">Time</p>
                      <p className="font-anton text-2xl text-white">{selectedTime}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-anton text-2xl text-white">TOTAL</span>
                  <span className="text-5xl font-anton text-primary">R$ {selectedService?.price.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-accent">Nome Completo</Label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="JOÃO SILVA" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-xl font-medium text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-accent">WhatsApp</Label>
                  <Input 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-xl font-medium text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-black hover:bg-white py-12 text-2xl font-anton tracking-widest transition-all duration-500"
                >
                  {isSubmitting ? "PROCESSING..." : "CONFIRM RESERVATION"}
                </Button>
              </form>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-24 flex flex-col items-center text-center animate-in zoom-in duration-700">
            <div className="w-32 h-32 border border-primary rounded-full flex items-center justify-center mb-12">
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-8xl font-anton text-white mb-6">COMPLETED</h2>
            <p className="text-accent uppercase tracking-[0.4em] text-xs max-w-md mx-auto mb-16">
              Sua reserva foi processada com sucesso. Prepare-se para uma experiência de alto padrão.
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-white text-black hover:bg-primary px-16 py-8 font-anton text-xl tracking-widest"
            >
              VOLTAR AO INÍCIO
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
