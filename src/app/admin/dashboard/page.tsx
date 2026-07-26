
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  Users, 
  LogOut, 
  Trash2, 
  Edit2, 
  UserPlus, 
  Upload, 
  DollarSign, 
  Plus,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bell,
  BellOff,
  Zap
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { collection, doc, query, onSnapshot, where } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIME_SLOTS } from "@/lib/mock-data";
import { Professional, Appointment, Service, AuthUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase, 
  addDocumentNonBlocking, 
  updateDocumentNonBlocking, 
  deleteDocumentNonBlocking,
  useUser
} from "@/firebase";

type ViewMode = 'appointments' | 'professionals' | 'services' | 'finance';

// Chave Pública VAPID
const VAPID_PUBLIC_KEY = 'BFLc0T5pWz2R_7r8F3u7H3YpYfD8W-Nq3_k_R_z_w_L_z_E_Y_z_R_L_W_z_w_L_z_E_Y_z_R_L_W';

export default function AdminDashboardPage() {
  const [adminSession, setAdminSession] = useState<AuthUser | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('appointments');
  const [search, setSearch] = useState("");
  const [selectedProfFilter, setSelectedProfFilter] = useState<string>("all");
  const [agendaDate, setAgendaDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();
  const { user: firebaseUser, isUserLoading } = useUser();
  const initializedListener = useRef(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  // Dialog states
  const [isProfDialogOpen, setIsProfDialogOpen] = useState(false);
  const [isAptDialogOpen, setIsAptDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  
  // Edit states
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  // Forms
  const [profName, setProfName] = useState("");
  const [profEmail, setProfEmail] = useState("");
  const [profPassword, setProfPassword] = useState("123");
  const [profSpecialty, setProfSpecialty] = useState("");
  const [profPhoto, setProfPhoto] = useState("");
  const [profCommission, setProfCommission] = useState("50");
  const [profWorkingHours, setProfWorkingHours] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aptClient, setAptClient] = useState("");
  const [aptPhone, setAptPhone] = useState("");
  const [aptService, setAptService] = useState("");
  const [aptProf, setAptProf] = useState("");
  const [aptDate, setAptDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [aptTime, setAptTime] = useState("");

  const [srvName, setSrvName] = useState("");
  const [srvPrice, setSrvPrice] = useState("");
  const [srvDuration, setSrvDuration] = useState("");
  const [srvDescription, setSrvDescription] = useState("");

  useEffect(() => {
    const loggedUser = localStorage.getItem("gold_user");
    if (!loggedUser) {
      router.push("/admin/login");
      return;
    }
    const parsedUser: AuthUser = JSON.parse(loggedUser);
    setAdminSession(parsedUser);

    if (parsedUser.role === 'barber') {
      setSelectedProfFilter(parsedUser.id);
    }

    // Verifica se o Service Worker já tem inscrição
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          setIsPushEnabled(!!sub);
        });
      });
    }
  }, [router]);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const togglePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !adminSession) {
      toast({ title: "Erro", description: "Push não suportado neste navegador.", variant: "destructive" });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      if (isPushEnabled) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setIsPushEnabled(false);
          toast({ title: "Notificações", description: "Alertas desativados." });
        }
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast({ title: "Permissão Negada", description: "Ative as notificações no navegador.", variant: "destructive" });
          return;
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        await fetch('/api/push/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, userId: adminSession.id })
        });

        setIsPushEnabled(true);
        toast({ title: "Push Ativado", description: "Você agora recebe alertas em tempo real." });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erro no Push", description: "Não foi possível configurar o VAPID.", variant: "destructive" });
    }
  };

  // Real-time listener para novos agendamentos (local toast)
  useEffect(() => {
    if (!firestore || !adminSession) return;
    if (initializedListener.current) return;
    initializedListener.current = true;

    const appointmentsRef = collection(firestore, "appointments");
    const q = query(appointmentsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && change.doc.metadata.hasPendingWrites === false) {
          const apt = change.doc.data() as Appointment;
          toast({
            title: "Novo Agendamento!",
            description: `${apt.clientName} às ${apt.time}`,
            className: "bg-primary text-black border-none"
          });
        }
      });
    });

    return () => unsubscribe();
  }, [firestore, adminSession, toast]);

  // Firestore Data
  const professionalsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, "professionals");
  }, [firestore, isUserLoading]);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, "services");
  }, [firestore, isUserLoading]);

  const appointmentsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading || !adminSession) return null;
    if (adminSession.role === 'barber') {
      return query(collection(firestore, "appointments"), where("professionalId", "==", adminSession.id));
    }
    return collection(firestore, "appointments");
  }, [firestore, isUserLoading, adminSession]);

  const { data: professionalsData } = useCollection<Professional>(professionalsQuery);
  const { data: servicesData } = useCollection<Service>(servicesQuery);
  const { data: appointmentsData } = useCollection<Appointment>(appointmentsQuery);

  const professionals = professionalsData || [];
  const services = servicesData || [];
  const appointments = appointmentsData || [];

  const isAdmin = adminSession?.role === 'admin';

  const financeData = useMemo(() => {
    const totalRevenue = appointments.reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.serviceId);
      return acc + (service?.price || 0);
    }, 0);

    const totalCommissions = appointments.reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.serviceId);
      const prof = professionals.find(p => p.id === curr.professionalId);
      const commissionAmount = ((service?.price || 0) * (prof?.commission ?? 0)) / 100;
      return acc + commissionAmount;
    }, 0);

    const profBreakdown = professionals
      .filter(p => !adminSession || adminSession.role === 'admin' || p.id === adminSession.id)
      .map(p => {
        const profApts = appointments.filter(a => a.professionalId === p.id);
        const revenue = profApts.reduce((acc, curr) => {
          const service = services.find(s => s.id === curr.serviceId);
          return acc + (service?.price || 0);
        }, 0);
        const commission = (revenue * (p.commission ?? 0)) / 100;

        return {
          id: p.id,
          name: p.name,
          revenue,
          commission,
          percentage: p.commission ?? 0,
          aptsCount: profApts.length
        };
      });

    return {
      totalRevenue,
      totalCommissions,
      netProfit: totalRevenue - totalCommissions,
      profBreakdown
    };
  }, [appointments, professionals, services, adminSession]);

  const handleLogout = () => {
    localStorage.removeItem("gold_user");
    router.push("/admin/login");
  };

  const handleSaveAppointment = () => {
    const profIdToSave = adminSession?.role === 'barber' ? adminSession.id : aptProf;
    if (!aptClient || !aptPhone || !aptService || !profIdToSave || !aptDate || !aptTime) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    
    const isTaken = appointments.some(a => 
      a.professionalId === profIdToSave && 
      a.date === aptDate && 
      a.time === aptTime && 
      a.id !== editingApt?.id
    );

    if (isTaken) {
      toast({ title: "Conflito", description: "Este horário já está ocupado.", variant: "destructive" });
      return;
    }

    const data = {
      clientName: aptClient, 
      phone: aptPhone, 
      serviceId: aptService, 
      professionalId: profIdToSave, 
      date: aptDate, 
      time: aptTime, 
      status: 'confirmed',
      clientId: firebaseUser?.uid || 'admin-manual'
    };

    if (editingApt) {
      updateDocumentNonBlocking(doc(firestore, "appointments", editingApt.id), data);
    } else {
      addDocumentNonBlocking(collection(firestore, "appointments"), data);
    }
    
    setIsAptDialogOpen(false);
    resetAptForm();
  };

  const deleteAppointment = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "appointments", id));
  };

  const resetAptForm = () => {
    setEditingApt(null); setAptClient(""); setAptPhone(""); setAptService("");
    setAptProf(""); setAptDate(format(new Date(), "yyyy-MM-dd")); setAptTime("");
  };

  const openEditApt = (apt: Appointment) => {
    setEditingApt(apt); setAptClient(apt.clientName); setAptPhone(apt.phone);
    setAptService(apt.serviceId); setAptProf(apt.professionalId); setAptDate(apt.date); setAptTime(apt.time);
    setIsAptDialogOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleWorkingHour = (slot: string) => {
    if (profWorkingHours.includes(slot)) {
      setProfWorkingHours(prev => prev.filter(s => s !== slot));
    } else {
      setProfWorkingHours(prev => [...prev, slot].sort());
    }
  };

  const handleSaveProfessional = () => {
    if (!profName || !profSpecialty) return;
    
    const data = { 
      name: profName, specialty: profSpecialty, photo: profPhoto, 
      commission: Number(profCommission), email: profEmail, password: profPassword,
      workingHours: profWorkingHours, active: true
    };

    if (editingProf) {
      updateDocumentNonBlocking(doc(firestore, "professionals", editingProf.id), data);
    } else {
      addDocumentNonBlocking(collection(firestore, "professionals"), data);
    }
    
    setIsProfDialogOpen(false);
    resetProfForm();
  };

  const deleteProfessional = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "professionals", id));
  };

  const resetProfForm = () => {
    setEditingProf(null); setProfName(""); setProfEmail(""); setProfPassword("123");
    setProfSpecialty(""); setProfPhoto(""); setProfCommission("50");
    setProfWorkingHours([]);
  };

  const openEditProf = (prof: Professional) => {
    setEditingProf(prof); setProfName(prof.name); setProfEmail(prof.email || "");
    setProfPassword(prof.password || "123"); setProfSpecialty(prof.specialty);
    setProfPhoto(prof.photo); setProfCommission(prof.commission?.toString() ?? "50");
    setProfWorkingHours(prof.workingHours || []);
    setIsProfDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!srvName || !srvPrice || !srvDuration) return;
    const data = { name: srvName, price: Number(srvPrice), duration: Number(srvDuration), description: srvDescription };
    if (editingService) {
      updateDocumentNonBlocking(doc(firestore, "services", editingService.id), data);
    } else {
      addDocumentNonBlocking(collection(firestore, "services"), data);
    }
    setIsServiceDialogOpen(false);
    resetServiceForm();
  };

  const deleteService = (id: string) => {
    deleteDocumentNonBlocking(doc(firestore, "services", id));
  };

  const resetServiceForm = () => {
    setEditingService(null); setSrvName(""); setSrvPrice(""); setSrvDuration(""); setSrvDescription("");
  };

  const openEditService = (service: Service) => {
    setEditingService(service); setSrvName(service.name); setSrvPrice(service.price.toString());
    setSrvDuration(service.duration.toString()); setSrvDescription(service.description || "");
    setIsServiceDialogOpen(true);
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || "N/A";
  const getProfName = (id: string) => professionals.find(p => p.id === id)?.name || "N/A";

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
      const effectiveFilter = adminSession?.role === 'barber' ? adminSession.id : selectedProfFilter;
      const matchesProf = effectiveFilter === "all" || a.professionalId === effectiveFilter;
      return matchesSearch && matchesProf;
    });
  }, [appointments, search, selectedProfFilter, adminSession]);

  const activeSlots = useMemo(() => {
    const effectiveFilter = adminSession?.role === 'barber' ? adminSession.id : selectedProfFilter;
    if (effectiveFilter === "all") return TIME_SLOTS;
    const prof = professionals.find(p => p.id === effectiveFilter);
    return prof?.workingHours || [];
  }, [selectedProfFilter, professionals, adminSession]);

  const handlePrevDay = () => {
    const prev = subDays(new Date(agendaDate + 'T12:00:00'), 1);
    setAgendaDate(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(new Date(agendaDate + 'T12:00:00'), 1);
    setAgendaDate(format(next, "yyyy-MM-dd"));
  };

  if (!adminSession) return null;

  return (
    <div className="h-[872px] w-[460px] mx-auto bg-[#030303] flex flex-col text-[#F5F5F5] font-body overflow-hidden border-x border-white/5 relative">
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0a0a0a] z-50">
        <div className="font-anton text-lg tracking-tighter uppercase">
          <span className="text-[#D4AF37]">GOLD</span>
          <span className="text-[#F5F5F5]">{adminSession.role === 'admin' ? ' ADMIN' : ' STAFF'}</span>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={togglePushNotifications} 
            className={cn("h-8 w-8 transition-colors", isPushEnabled ? "text-[#D4AF37]" : "text-white/20")}
          >
            {isPushEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('appointments')} className={cn("h-8 w-8", viewMode === 'appointments' && "text-[#D4AF37]")}><CalendarIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('professionals')} className={cn("h-8 w-8", viewMode === 'professionals' && "text-[#D4AF37]")}><Users className="h-4 w-4" /></Button>
          {isAdmin && (
            <Button variant="ghost" size="icon" onClick={() => setViewMode('services')} className={cn("h-8 w-8", viewMode === 'services' && "text-[#D4AF37]")}><Scissors className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setViewMode('finance')} className={cn("h-8 w-8", viewMode === 'finance' && "text-[#D4AF37]")}><DollarSign className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-destructive"><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden p-4 pt-6">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-anton uppercase tracking-tight leading-none text-[#F5F5F5]">
              {viewMode === 'appointments' && "AGENDA"}
              {viewMode === 'professionals' && (isAdmin ? "EQUIPE" : "MEU PERFIL")}
              {viewMode === 'services' && "SERVIÇOS"}
              {viewMode === 'finance' && "CAIXA"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("w-1.5 h-1.5 rounded-full", isPushEnabled ? "bg-[#D4AF37] animate-pulse" : "bg-white/10")} />
              <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold">
                {isPushEnabled ? "VAPID PUSH ACTIVE" : "PUSH SYNC STANDBY"}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {viewMode === 'appointments' && (
              <Dialog open={isAptDialogOpen} onOpenChange={setIsAptDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#F5F5F5] text-black font-anton uppercase rounded-full"><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">Reserva</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Cliente</Label><Input value={aptClient} onChange={e=>setAptClient(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">WhatsApp</Label><Input value={aptPhone} onChange={e=>setAptPhone(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Serviço</Label><Select value={aptService} onValueChange={setAptService}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{(services || []).map(s=><SelectItem key={s.id} value={s.id}>{s.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Barbeiro</Label><Select value={adminSession.role === 'barber' ? adminSession.id : aptProf} onValueChange={setAptProf} disabled={adminSession.role === 'barber'}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{(professionals || []).map(p=><SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Data</Label><Input type="date" value={aptDate} onChange={e=>setAptDate(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Hora</Label><Select value={aptTime} onValueChange={setAptTime}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{TIME_SLOTS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <Button onClick={handleSaveAppointment} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-10 mt-2">Salvar</Button>
                </DialogContent>
              </Dialog>
            )}
            {viewMode === 'professionals' && (
               <Dialog open={isProfDialogOpen} onOpenChange={setIsProfDialogOpen}>
               <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#D4AF37] text-black font-anton uppercase rounded-full">{isAdmin ? <UserPlus className="h-3 w-3 mr-1" /> : <Edit2 className="h-3 w-3 mr-1" />} {isAdmin ? "Novo" : "Editar"}</Button></DialogTrigger>
               <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%] max-h-[90vh] flex flex-col">
                 <DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">{isAdmin ? "Especialista" : "Novo"}</DialogTitle></DialogHeader>
                 <ScrollArea className="flex-1 pr-2">
                   <div className="grid grid-cols-2 gap-3 py-2">
                     <div className="space-y-1 col-span-2 flex flex-col items-center mb-2">
                       <Label className="text-[8px] uppercase opacity-40 mb-2 text-[#F5F5F5]">Foto de Perfil</Label>
                       <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 overflow-hidden cursor-pointer flex items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                         {profPhoto ? <img src={profPhoto} className="w-full h-full object-cover" /> : <Upload className="h-4 w-4 opacity-20" />}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                     </div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nome</Label><Input value={profName} onChange={e=>setProfName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Especialidade</Label><Input value={profSpecialty} onChange={e=>setProfSpecialty(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Email</Label><Input value={profEmail} onChange={e=>setProfEmail(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     {isAdmin && <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Comissão %</Label><Input type="number" value={profCommission} onChange={e=>setProfCommission(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>}
                     <div className="col-span-2 space-y-2 mt-2">
                       <Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Expediente (00:00 - 23:30)</Label>
                       <ScrollArea className="h-48 border border-white/5 rounded-xl p-2 bg-white/[0.02]">
                         <div className="grid grid-cols-4 gap-2">
                           {TIME_SLOTS.map(slot => (
                             <button key={slot} onClick={() => toggleWorkingHour(slot)} className={cn("py-1.5 rounded-lg text-[9px] font-anton border transition-all", profWorkingHours.includes(slot) ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "bg-transparent text-[#F5F5F5]/40 border-white/10")}>{slot}</button>
                           ))}
                         </div>
                       </ScrollArea>
                     </div>
                   </div>
                 </ScrollArea>
                 <Button onClick={handleSaveProfessional} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-10 mt-4 shrink-0">Salvar</Button>
               </DialogContent>
             </Dialog>
            )}
            {viewMode === 'services' && isAdmin && (
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#D4AF37] text-black font-anton uppercase rounded-full" onClick={resetServiceForm}><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%]">
                  <DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">{editingService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="space-y-1 col-span-2"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nome do Serviço</Label><Input value={srvName} onChange={e=>setSrvName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Preço (R$)</Label><Input type="number" value={srvPrice} onChange={e=>setSrvPrice(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Duração (Min)</Label><Input type="number" value={srvDuration} onChange={e=>setSrvDuration(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1 col-span-2"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Descrição</Label><Input value={srvDescription} onChange={e=>setSrvDescription(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                  </div>
                  <Button onClick={handleSaveService} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-10 mt-2">Salvar</Button>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-[#F5F5F5]/40 uppercase">Geração</div>
            <div className="text-sm font-anton text-[#D4AF37]">R$ {financeData.totalRevenue.toFixed(0)}</div>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-[#F5F5F5]/40 uppercase">Agenda</div>
            <div className="text-sm font-anton text-[#F5F5F5]">{filteredAppointments.length}</div>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-[#F5F5F5]/40 uppercase">Saldo</div>
            <div className="text-sm font-anton text-[#D4AF37]">R$ {(adminSession.role === 'admin' ? financeData.netProfit : financeData.totalCommissions).toFixed(0)}</div>
          </Card>
        </div>

        <div className="flex-1 overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col shadow-inner">
          {viewMode === 'appointments' && (
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-7 w-7 text-[#F5F5F5]"><ChevronLeft className="h-4 w-4" /></Button>
                <div className="text-[10px] font-anton text-[#D4AF37] uppercase min-w-[120px] text-center">
                  {format(new Date(agendaDate + 'T12:00:00'), "EEEE, dd 'DE' MMMM", { locale: ptBR })}
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-7 w-7 text-[#F5F5F5]"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              {isAdmin && (
                <Select value={selectedProfFilter} onValueChange={setSelectedProfFilter}>
                  <SelectTrigger className="h-7 text-[8px] w-24 border-white/10 uppercase font-anton text-[#F5F5F5]">
                    <SelectValue placeholder="FILTRO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">TODOS</SelectItem>
                    {(professionals || []).map(p => <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {viewMode === 'appointments' && (
              <div className="p-4 space-y-2">
                {activeSlots.map(slot => {
                  const slotApts = filteredAppointments.filter(a => a.date === agendaDate && a.time === slot);
                  return (
                    <div key={slot} className="flex gap-4 group">
                      <div className="w-10 text-[10px] font-anton text-[#F5F5F5]/40 pt-1 text-right">{slot}</div>
                      <div className="flex-1 min-h-[48px] border-l border-white/10 pl-4 pb-4">
                        {slotApts.length > 0 ? (
                          <div className="space-y-2">
                            {slotApts.map(apt => (
                              <div key={apt.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex justify-between items-center group/item hover:border-[#D4AF37]/50 transition-colors shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                <div className="min-w-0">
                                  <div className="text-[11px] font-anton uppercase truncate text-[#D4AF37] leading-tight">{apt.clientName}</div>
                                  <div className="text-[8px] text-[#F5F5F5]/40 uppercase truncate flex items-center gap-1 mt-1">
                                    <Scissors className="h-2 w-2" /> {getServiceName(apt.serviceId)}
                                    {isAdmin && (
                                      <>
                                        <span className="opacity-20 mx-1">|</span>
                                        <Users className="h-2 w-2" /> {getProfName(apt.professionalId)}
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                   <Button variant="ghost" size="icon" onClick={() => openEditApt(apt)} className="h-7 w-7 text-[#F5F5F5]/40 hover:text-[#F5F5F5]"><Edit2 className="h-3 w-3" /></Button>
                                   <Button variant="ghost" size="icon" onClick={() => deleteAppointment(apt.id)} className="h-7 w-7 text-destructive/40 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center">
                            <div className="w-full border-b border-dashed border-white/5 opacity-10" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'professionals' && (
              <div className="p-3 space-y-2">
                {(professionals || [])
                  .filter(p => isAdmin || (adminSession && p.id === adminSession.id))
                  .map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <img src={p.photo || 'https://picsum.photos/seed/default/100'} className="w-10 h-10 rounded-full object-cover grayscale" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-anton uppercase text-[#F5F5F5]">{p.name}</div>
                      <div className="text-[8px] text-[#D4AF37] uppercase">{p.specialty}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-2 w-2 text-[#F5F5F5]/20" />
                        <span className="text-[7px] text-[#F5F5F5]/30 uppercase">Expediente: {p.workingHours?.length || 0} slots</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {(isAdmin || (adminSession && p.id === adminSession.id)) && (
                        <Button variant="ghost" size="icon" onClick={() => openEditProf(p)} className="h-7 w-7 border border-white/5 text-[#F5F5F5]"><Edit2 className="h-3 w-3" /></Button>
                      )}
                      {isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => deleteProfessional(p.id)} className="h-7 w-7 border border-white/5 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'services' && (
              <div className="p-3 space-y-2">
                {(services || []).map(s => (
                  <div key={s.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-[10px] font-anton uppercase text-[#F5F5F5]">{s.name}</div>
                      <div className="text-[8px] text-[#F5F5F5]/40">{s.duration} MIN • <span className="text-[#D4AF37] font-bold">R$ {s.price}</span></div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditService(s)} className="h-7 w-7 text-[#F5F5F5]"><Edit2 className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteService(s.id)} className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'finance' && (
              <div className="p-3 space-y-3">
                <div className="space-y-2">
                  <div className="text-[8px] font-anton uppercase text-[#F5F5F5]/30 tracking-widest">Resumo {isAdmin ? "por Barbeiro" : "Pessoal"}</div>
                  {(financeData.profBreakdown || []).map(row => (
                    <div key={row.id} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="text-[10px] font-anton uppercase text-[#F5F5F5]">{row.name}</div>
                      <div className="text-right">
                        <div className="text-[10px] font-anton text-[#D4AF37]">R$ {row.commission.toFixed(0)}</div>
                        <div className="text-[7px] text-[#F5F5F5]/40 uppercase">{row.aptsCount} atendimentos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="h-10 border-t border-white/5 flex items-center justify-center px-4 bg-black">
        <div className="flex items-center gap-2">
          <Zap className="h-3 w-3 text-[#D4AF37] animate-pulse" />
          <span className="text-[7px] font-mono text-[#F5F5F5]/20 uppercase tracking-widest">VAPID Native Push Synchronized</span>
        </div>
      </footer>
    </div>
  );
}
