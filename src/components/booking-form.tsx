
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // Step Progress
  const steps: Step[] = ['service', 'professional', 'datetime', 'contact', 'success'];
  const currentStepIndex = steps.indexOf(step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast({ title: "Ops!", description: "Por favor, preencha seu nome e telefone.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      // In a real app, we'd save to DB here
      const newAppointment = {
        id: Math.random().toString(36).substr(2, 9),
        clientName,
        phone: clientPhone,
        serviceId: selectedService?.id,
        professionalId: selectedProfessional?.id,
        date: format(selectedDate!, "yyyy-MM-dd"),
        time: selectedTime,
        status: 'confirmed'
      };
      
      const existing = JSON.parse(localStorage.getItem('gold_appointments') || '[]');
      localStorage.setItem('gold_appointments', JSON.stringify([...existing, newAppointment]));
    }, 1500);
  };

  const nextStep = () => {
    if (step === 'service' && !selectedService) return;
    if (step === 'professional' && !selectedProfessional) return;
    if (step === 'datetime' && (!selectedDate || !selectedTime)) return;
    
    setStep(steps[currentStepIndex + 1]);
  };

  const prevStep = () => {
    setStep(steps[currentStepIndex - 1]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      {/* Progress Stepper */}
      {step !== 'success' && (
        <div className="flex justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          {steps.slice(0, 4).map((s, idx) => (
            <div 
              key={s} 
              className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                idx <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-card border border-white/10 text-white/40"
              )}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      )}

      <Card className="bg-card border-white/10 shadow-2xl overflow-hidden">
        {step === 'service' && (
          <>
            <CardHeader className="text-center bg-background/30 py-8">
              <CardTitle className="text-3xl font-black uppercase tracking-tight italic">
                Escolha o <span className="text-primary">Serviço</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {MOCK_SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); nextStep(); }}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-sm border transition-all hover:scale-[1.01] active:scale-[0.99]",
                      selectedService?.id === s.id 
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
                        : "border-white/5 bg-background/40 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-sm">
                        <Scissors className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg">{s.name}</h3>
                        <p className="text-sm text-white/40">{s.duration} minutos</p>
                      </div>
                    </div>
                    <div className="text-xl font-black italic text-primary">R$ {s.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </>
        )}

        {step === 'professional' && (
          <>
            <CardHeader className="text-center bg-background/30 py-8">
              <CardTitle className="text-3xl font-black uppercase tracking-tight italic">
                Quem vai <span className="text-primary">Atender?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-3 gap-6">
                {MOCK_PROFESSIONALS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProfessional(p); nextStep(); }}
                    className={cn(
                      "flex flex-col items-center p-6 rounded-sm border transition-all hover:scale-[1.02] active:scale-[0.98]",
                      selectedProfessional?.id === p.id 
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/5" 
                        : "border-white/5 bg-background/40 hover:border-white/20"
                    )}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    </div>
                    <h3 className="font-bold text-center mb-1">{p.name}</h3>
                    <p className="text-xs text-white/40 text-center">{p.specialty}</p>
                  </button>
                ))}
              </div>
              <div className="mt-8">
                <Button variant="ghost" onClick={prevStep} className="text-white/40 hover:text-white uppercase tracking-widest text-xs">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'datetime' && (
          <>
            <CardHeader className="text-center bg-background/30 py-8">
              <CardTitle className="text-3xl font-black uppercase tracking-tight italic">
                Data e <span className="text-primary">Hora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-white/60 uppercase text-xs tracking-widest font-bold">1. Selecione a Data</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-sm border border-white/10 bg-background/20"
                    locale={ptBR}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-white/60 uppercase text-xs tracking-widest font-bold">2. Horários Disponíveis</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-2 px-3 text-sm font-bold rounded-sm border transition-all",
                          selectedTime === time 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-white/10 bg-background/40 hover:border-primary/50 text-white/60"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-between items-center">
                <Button variant="ghost" onClick={prevStep} className="text-white/40 hover:text-white uppercase tracking-widest text-xs">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <Button 
                  onClick={nextStep} 
                  disabled={!selectedDate || !selectedTime}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 font-bold uppercase tracking-widest"
                >
                  Continuar <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'contact' && (
          <>
            <CardHeader className="text-center bg-background/30 py-8">
              <CardTitle className="text-3xl font-black uppercase tracking-tight italic">
                Finalizar <span className="text-primary">Agendamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Summary */}
                <div className="space-y-6 bg-background/40 p-6 rounded-sm border border-white/5">
                  <h3 className="text-xl font-bold uppercase italic text-primary border-b border-white/10 pb-4">Resumo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Scissors className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-white/40 uppercase">Serviço</p>
                        <p className="font-bold">{selectedService?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-white/40 uppercase">Profissional</p>
                        <p className="font-bold">{selectedProfessional?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-white/40 uppercase">Data</p>
                        <p className="font-bold">{selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-white/40 uppercase">Horário</p>
                        <p className="font-bold">{selectedTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="font-bold uppercase tracking-widest text-sm">Total</span>
                    <span className="text-2xl font-black text-primary italic">R$ {selectedService?.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold text-white/60">Seu Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: João Silva" 
                      className="bg-background/40 border-white/10 py-6"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-widest font-bold text-white/60">Seu WhatsApp</Label>
                    <Input 
                      id="phone" 
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="(00) 00000-0000" 
                      className="bg-background/40 border-white/10 py-6"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-8 text-xl font-black uppercase tracking-widest italic shadow-xl shadow-primary/20"
                  >
                    {isSubmitting ? "Confirmando..." : "Confirmar Agendamento"}
                  </Button>
                </form>
              </div>
              <div className="mt-8">
                <Button variant="ghost" onClick={prevStep} className="text-white/40 hover:text-white uppercase tracking-widest text-xs">
                  <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'success' && (
          <CardContent className="py-20 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 animate-bounce shadow-2xl shadow-primary/40">
              <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-4 tracking-tighter">
              Tudo <span className="text-primary">Pronto!</span>
            </h2>
            <p className="text-xl text-white/60 max-w-md mx-auto mb-12">
              Seu agendamento foi confirmado com sucesso. Te esperamos em breve para sua experiência Gold!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => router.push('/')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 font-bold uppercase tracking-widest"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
