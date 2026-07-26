
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Scissors, CheckCircle2, ChevronLeft, ArrowRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { collection, query, where } from "firebase/firestore";

import { TIME_SLOTS } from "@/lib/mock-data";
import { Service, Professional, Appointment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CustomCalendar } from "@/components/custom-calendar";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, useUser } from "@/firebase";

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
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now);
    setToday(now);
  }, []);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, "services");
  }, [firestore, isUserLoading]);

  const professionalsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, "professionals");
  }, [firestore, isUserLoading]);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !selectedProfessional || !selectedDate) return null;
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return query(
      collection(firestore, "appointments"),
      where("professionalId", "==", selectedProfessional.id),
      where("date", "==", dateStr)
    );
  }, [firestore, isUserLoading, selectedProfessional, selectedDate]);

  const { data: services = [] } = useCollection<Service>(servicesQuery);
  const { data: professionals = [] } = useCollection<Professional>(professionalsQuery);
  const { data: appointments = [] } = useCollection<Appointment>(appointmentsQuery);

  const steps: Step[] = ['service', 'professional', 'date', 'time', 'contact', 'success'];
  const currentStepIndex = steps.indexOf(step);

  const takenSlots = useMemo(() => {
    if (!appointments) return [];
    return (appointments || [])
      .filter(a => a.status !== 'cancelled')
      .map(a => a.time);
  }, [appointments]);

  const profWorkingHours = useMemo(() => {
    if (!selectedProfessional) return TIME_SLOTS;
    return selectedProfessional.workingHours || [];
  }, [selectedProfessional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      toast({ title: "Ops!", description: "Por favor, preencha seu nome e telefone.", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "Aguarde", description: "Sincronizando conexão segura...", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    const newAppointmentData = {
      clientId: user.uid,
      clientName,
      phone: clientPhone,
      serviceId: selectedService?.id || '',
      professionalId: selectedProfessional?.id || '',
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      time: selectedTime || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // 1. Salva no Firestore
    addDocumentNonBlocking(collection(firestore, "appointments"), newAppointmentData);
    
    // 2. Dispara Notificação Push VAPID para o Staff
    fetch('/api/push/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'GOLD: Novo Agendamento',
        body: `${clientName} agendou ${selectedService?.name} para ${selectedTime}.`
      })
    }).catch(err => console.error('Erro ao notificar push:', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1000);
  };

  const prevStep = () => {
    setStep(steps[currentStepIndex - 1]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 md:py-8 px-4">
      <div className="bg-[#0a0a0a]/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
        {step !== 'success' && (
          <div className="flex items-center gap-4 mb-10 text-white/20">
            {steps.slice(0, 5).map((s, i) => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", i <= currentStepIndex ? "bg-[#D4AF37]" : "bg-white/5")} />
            ))}
          </div>
        )}

        {step === 'service' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-5xl font-anton mb-10 text-white uppercase tracking-tighter">SERVIÇO</h2>
            <div className="space-y-3">
              {(services || []).map((s) => (
                <button key={s.id} onClick={() => { setSelectedService(s); setStep('professional'); }} className="w-full flex items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl transition-all group">
                  <div className="text-left">
                    <h3 className="font-anton text-lg md:text-xl text-white uppercase tracking-widest">{s.name}</h3>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{s.duration} MIN</p>
                  </div>
                  <div className="font-anton text-xl text-[#D4AF37]">R$ {s.price.toFixed(0)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'professional' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-5xl font-anton text-white uppercase tracking-tighter">PROFISSIONAL</h2>
              <Button variant="ghost" onClick={prevStep} className="text-white/30 hover:text-white uppercase tracking-widest font-anton text-[9px] gap-2"><ChevronLeft className="h-3 w-3" /> Voltar</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {(professionals || []).map((p) => (
                <button key={p.id} onClick={() => { setSelectedProfessional(p); setStep('date'); }} className="group flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/5 group-hover:border-[#D4AF37] transition-all duration-500">
                    <img src={p.photo || 'https://picsum.photos/seed/default/200'} alt={p.name} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-anton text-[10px] md:text-xs text-white uppercase tracking-widest">{p.name.split(' ')[0]}</h3>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">{p.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'date' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-5xl font-anton text-white uppercase tracking-tighter">DATA</h2>
              <Button variant="ghost" onClick={prevStep} className="text-white/30 hover:text-white uppercase tracking-widest font-anton text-[9px] gap-2"><ChevronLeft className="h-3 w-3" /> Voltar</Button>
            </div>
            <div className="max-w-md mx-auto">
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
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-5xl font-anton text-white uppercase tracking-tighter">HORA</h2>
              <Button variant="ghost" onClick={prevStep} className="text-white/30 hover:text-white uppercase tracking-widest font-anton text-[9px] gap-2"><ChevronLeft className="h-3 w-3" /> Voltar</Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {TIME_SLOTS.map((time) => {
                const isTaken = takenSlots.includes(time);
                const isWorkingHour = profWorkingHours.includes(time);
                const isDisabled = isTaken || !isWorkingHour;
                return (
                  <button key={time} disabled={isDisabled} onClick={() => { setSelectedTime(time); setStep('contact'); }} className={cn("py-4 text-xs font-anton border rounded-xl transition-all uppercase tracking-widest", isDisabled ? "bg-white/[0.01] border-white/5 text-white/5 cursor-not-allowed" : selectedTime === time ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-white/[0.03] border-white/5 text-white/40 hover:border-[#D4AF37]/40 hover:text-white")}>{time}</button>
                );
              })}
            </div>
          </div>
        )}

        {step === 'contact' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl md:text-5xl font-anton text-white uppercase tracking-tighter">RESERVAR</h2>
              <Button variant="ghost" onClick={prevStep} className="text-white/30 hover:text-white uppercase tracking-widest font-anton text-[9px] gap-2"><ChevronLeft className="h-3 w-3" /> Voltar</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.5em] mb-6 block">Resumo</span>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Serviço</span><span className="text-xs font-anton text-white uppercase">{selectedService?.name}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Barbeiro</span><span className="text-xs font-anton text-white uppercase">{selectedProfessional?.name.split(' ')[0]}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Data</span><span className="text-xs font-anton text-white uppercase">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ''}</span></div>
                    <div className="flex justify-between"><span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Hora</span><span className="text-xs font-anton text-white uppercase">{selectedTime}</span></div>
                    <div className="pt-4 border-t border-white/5 flex justify-between"><span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest">Valor</span><span className="text-lg font-anton text-[#D4AF37]">R$ {selectedService?.price.toFixed(0)}</span></div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2"><Label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Seu Nome</Label><Input value={clientName} onChange={(e) => setClientName(e.target.value)} className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none h-12 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required /></div>
                <div className="space-y-2"><Label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">WhatsApp</Label><Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="(00) 00000-0000" className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none h-12 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required /></div>
                <Button type="submit" disabled={isSubmitting || !user} className="w-full bg-[#D4AF37] text-black h-16 text-lg font-anton uppercase tracking-[0.3em] rounded-2xl mt-4">{isSubmitting ? "SINCRONIZANDO..." : "CONFIRMAR AGORA"}</Button>
              </form>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20"><CheckCircle2 className="h-8 w-8 text-emerald-500" /></div>
            <h2 className="text-5xl md:text-7xl font-anton text-white mb-4 uppercase tracking-tighter">RESERVADO</h2>
            <p className="text-white/30 uppercase tracking-[0.3em] text-[10px] mb-12">Sincronizado com sucesso. Nos vemos em breve.</p>
            <Button onClick={() => router.push('/')} className="bg-white text-black px-12 h-14 font-anton uppercase tracking-[0.2em] rounded-full">VOLTAR AO INÍCIO</Button>
          </div>
        )}
      </div>
    </div>
  );
}
