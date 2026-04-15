
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Scissors, CheckCircle2, ChevronLeft, ArrowRight, Circle, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { collection, doc } from "firebase/firestore";

import { TIME_SLOTS } from "@/lib/mock-data";
import { Service, Professional, Appointment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CustomCalendar } from "@/components/custom-calendar";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";

type Step = 'service' | 'professional' | 'date' | 'time' | 'contact' | 'success';

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
  const firestore = useFirestore();

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now);
    setToday(now);
  }, []);

  const servicesQuery = useMemoFirebase(() => collection(firestore, "services"), [firestore]);
  const professionalsQuery = useMemoFirebase(() => collection(firestore, "professionals"), [firestore]);
  const appointmentsQuery = useMemoFirebase(() => collection(firestore, "appointments"), [firestore]);

  const { data: services = [] } = useCollection<Service>(servicesQuery);
  const { data: professionals = [] } = useCollection<Professional>(professionalsQuery);
  const { data: appointments = [] } = useCollection<Appointment>(appointmentsQuery);

  const steps: Step[] = ['service', 'professional', 'date', 'time', 'contact', 'success'];
  const currentStepIndex = steps.indexOf(step);

  const takenSlots = useMemo(() => {
    if (!selectedProfessional || !selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return appointments
      .filter(a => a.date === dateStr && a.professionalId === selectedProfessional.id && a.status !== 'cancelled')
      .map(a => a.time);
  }, [appointments, selectedProfessional, selectedDate]);

  const profWorkingHours = useMemo(() => {
    if (!selectedProfessional) return TIME_SLOTS;
    return selectedProfessional.workingHours || TIME_SLOTS;
  }, [selectedProfessional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast({ title: "Ops!", description: "Por favor, preencha seu nome e telefone.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const newAppointmentData = {
      clientName,
      phone: clientPhone,
      serviceId: selectedService?.id || '',
      professionalId: selectedProfessional?.id || '',
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: selectedTime || '',
      status: 'confirmed'
    };

    addDocumentNonBlocking(collection(firestore, "appointments"), newAppointmentData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
  };

  const prevStep = () => {
    setStep(steps[currentStepIndex - 1]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 md:py-12 px-4">
      <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl shadow-primary/5 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

        {step === 'service' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-6xl font-anton mb-8 md:mb-12 text-white uppercase tracking-tighter">
              SELECIONE O <span className="text-shimmer">SERVIÇO</span>
            </h2>
            <div className="grid gap-4">
              {services?.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s); setStep('professional'); }}
                  className="flex items-center justify-between p-6 md:p-8 glass rounded-2xl md:rounded-3xl hover:border-primary/40 hover:bg-white/[0.03] transition-all duration-500 group"
                >
                  <div className="flex items-center gap-4 md:gap-8">
                    <span className="font-mono text-[8px] md:text-[10px] text-neutral-600 group-hover:text-primary transition-colors">0{idx + 1}</span>
                    <div className="text-left">
                      <h3 className="font-anton text-lg md:text-2xl text-white group-hover:text-shimmer uppercase tracking-widest">{s.name}</h3>
                      <p className="text-[8px] md:text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">{s.duration} MINUTOS</p>
                    </div>
                  </div>
                  <div className="font-anton text-lg md:text-2xl text-primary">R$ {s.price.toFixed(0)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'professional' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                ESCOLHA O <span className="text-shimmer">ESPECIALISTA</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {professionals?.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProfessional(p); setStep('date'); }}
                  className="group flex flex-col items-center gap-4 transition-all duration-300"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-primary transition-colors bg-neutral-900 shadow-xl group-hover:shadow-primary/20">
                    <img 
                      src={p.photo} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-anton text-[10px] md:text-xs text-white group-hover:text-primary uppercase tracking-widest transition-colors">{p.name.split(' ')[0]}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'date' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
              <h2 className="text-3xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                ESCOLHA A <span className="text-shimmer">DATA</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2 self-end">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>

            <div className="glass rounded-[2rem] p-6 md:p-10 border-white/5 shadow-inner">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <CalendarIcon className="w-3 h-3 text-primary" />
                <p className="text-[9px] font-mono text-primary uppercase tracking-[0.3em]">01. Selecione o Dia</p>
              </div>
              <CustomCalendar
                selectedDate={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setStep('time'); }}
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
        )}

        {step === 'time' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
              <h2 className="text-3xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                ESCOLHA O <span className="text-shimmer">HORÁRIO</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2 self-end">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Clock className="w-3 h-3 text-primary" />
                <p className="text-[9px] font-mono text-primary uppercase tracking-[0.3em]">02. Selecione o Horário</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((time) => {
                  const isTaken = takenSlots.includes(time);
                  const isWorkingHour = profWorkingHours.includes(time);
                  const isDisabled = isTaken || !isWorkingHour;

                  return (
                    <button
                      key={time}
                      disabled={isDisabled}
                      onClick={() => { setSelectedTime(time); setStep('contact'); }}
                      className={cn(
                        "py-5 px-2 text-[11px] md:text-xs font-mono border rounded-2xl transition-all uppercase tracking-widest flex flex-col items-center justify-center gap-1",
                        isDisabled 
                          ? "bg-white/[0.02] border-white/5 text-white/10 cursor-not-allowed line-through" 
                          : selectedTime === time 
                            ? "bg-primary text-black border-primary shadow-[0_0_25px_rgba(251,191,36,0.3)] scale-105" 
                            : "glass border-white/5 text-neutral-400 hover:border-primary/40 hover:text-white"
                      )}
                    >
                      <span className={cn(
                        "text-[7px] font-bold uppercase",
                        isDisabled ? "text-destructive" : "text-emerald-500"
                      )}>
                        {isTaken ? "INDISPONÍVEL" : !isWorkingHour ? "FECHADO" : "DISPONÍVEL"}
                      </span>
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end mb-8 md:mb-12">
              <h2 className="text-3xl md:text-6xl font-anton text-white uppercase tracking-tighter">
                CONFIRMAR <span className="text-shimmer">RESERVA</span>
              </h2>
              <Button variant="ghost" onClick={prevStep} className="text-neutral-500 hover:text-white uppercase tracking-widest font-anton text-[10px] gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-10 md:gap-20">
              <div className="space-y-6">
                <div className="glass p-8 md:p-10 rounded-[2rem] border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    <Scissors className="text-primary/10 w-24 h-24 rotate-12" />
                  </div>
                  <span className="text-primary uppercase text-[8px] font-mono tracking-[0.5em] mb-8 block">Bilhete Digital</span>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4 relative z-10">
                    <div>
                      <p className="text-[7px] text-neutral-600 uppercase font-mono tracking-widest mb-1">Serviço</p>
                      <p className="font-anton text-lg text-white uppercase">{selectedService?.name}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-neutral-600 uppercase font-mono tracking-widest mb-1">Especialista</p>
                      <p className="font-anton text-lg text-white uppercase">{selectedProfessional?.name.split(' ')[0]}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-neutral-600 uppercase font-mono tracking-widest mb-1">Data</p>
                      <p className="font-anton text-lg text-white uppercase">{selectedDate ? format(selectedDate, "dd MMM", { locale: ptBR }) : ''}</p>
                    </div>
                    <div>
                      <p className="text-[7px] text-neutral-600 uppercase font-mono tracking-widest mb-1">Hora</p>
                      <p className="font-anton text-lg text-white uppercase">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="font-anton text-lg text-white uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-anton text-shimmer">R$ {selectedService?.price.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <Label className="text-[9px] uppercase tracking-[0.3em] font-mono text-neutral-500">Seu Nome</Label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="DIGITE SEU NOME" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-6 text-xl font-medium text-white placeholder:text-neutral-800 focus-visible:ring-0 focus-visible:border-primary transition-all font-anton"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-[9px] uppercase tracking-[0.3em] font-mono text-neutral-500">WhatsApp</Label>
                  <Input 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(00) 00000-0000" 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-6 text-xl font-medium text-white placeholder:text-neutral-800 focus-visible:ring-0 focus-visible:border-primary transition-all font-anton"
                    required
                  />
                </div>
                <div className="shiny-border w-full mt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="shiny-border-content w-full bg-transparent text-white hover:bg-white/[0.03] py-10 text-xl font-anton uppercase tracking-[0.3em] transition-all duration-500"
                  >
                    {isSubmitting ? "ENVIANDO..." : "AGENDAR AGORA"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-16 md:py-24 flex flex-col items-center text-center animate-in zoom-in duration-700">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full glass flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(197,160,89,0.25)] border-primary/20">
              <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            </div>
            <h2 className="text-5xl md:text-9xl font-anton text-white mb-6 uppercase tracking-tighter">SUCESSO</h2>
            <p className="text-neutral-500 uppercase tracking-[0.3em] text-[9px] md:text-[10px] max-w-xs md:max-w-lg mx-auto mb-16 leading-loose">
              Seu horário foi sincronizado. Aguardamos você para a melhor experiência da cidade.
            </p>
            <div className="shiny-border">
              <Button 
                onClick={() => router.push('/')}
                className="shiny-border-content bg-transparent text-white hover:bg-white/[0.03] px-12 md:px-20 py-8 md:py-10 font-anton uppercase tracking-[0.2em] text-[9px] md:text-[10px]"
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
