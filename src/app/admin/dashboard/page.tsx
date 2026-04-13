
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar as CalendarIcon, 
  Users, 
  LogOut, 
  Search, 
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
  Check
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_SERVICES, MOCK_PROFESSIONALS, TIME_SLOTS } from "@/lib/mock-data";
import { Professional, Appointment, Service, AuthUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'appointments' | 'professionals' | 'services' | 'finance';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProfFilter, setSelectedProfFilter] = useState<string>("all");
  const [agendaDate, setAgendaDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { toast } = useToast();
  
  const [isProfDialogOpen, setIsProfDialogOpen] = useState(false);
  const [isAptDialogOpen, setIsAptDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
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

  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem("gold_user");
    if (!loggedUser) {
      router.push("/admin/login");
      return;
    }
    const parsedUser: AuthUser = JSON.parse(loggedUser);
    setUser(parsedUser);

    if (parsedUser.role === 'barber') {
      setSelectedProfFilter(parsedUser.id);
    }

    const savedApts = JSON.parse(localStorage.getItem('gold_appointments') || '[]');
    setAppointments(savedApts);

    const savedProfs = JSON.parse(localStorage.getItem('gold_professionals') || '[]');
    if (savedProfs.length === 0) {
      localStorage.setItem('gold_professionals', JSON.stringify(MOCK_PROFESSIONALS));
      setProfessionals(MOCK_PROFESSIONALS);
    } else {
      setProfessionals(savedProfs);
    }

    const savedServices = JSON.parse(localStorage.getItem('gold_services') || '[]');
    if (savedServices.length === 0) {
      localStorage.setItem('gold_services', JSON.stringify(MOCK_SERVICES));
      setServices(MOCK_SERVICES);
    } else {
      setServices(savedServices);
    }
  }, [router]);

  const isAdmin = user?.role === 'admin';

  const financeData = useMemo(() => {
    const relevantApts = user?.role === 'barber' 
      ? appointments.filter(a => a.professionalId === user.id)
      : appointments;

    const totalRevenue = relevantApts.reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.serviceId);
      return acc + (service?.price || 0);
    }, 0);

    const totalCommissions = relevantApts.reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.serviceId);
      const prof = professionals.find(p => p.id === curr.professionalId);
      const commissionAmount = ((service?.price || 0) * (prof?.commission ?? 0)) / 100;
      return acc + commissionAmount;
    }, 0);

    const profBreakdown = professionals
      .filter(p => user?.role === 'admin' || p.id === user?.id)
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
  }, [appointments, professionals, services, user]);

  const handleLogout = () => {
    localStorage.removeItem("gold_user");
    router.push("/admin/login");
  };

  const handleSaveAppointment = () => {
    const profIdToSave = user?.role === 'barber' ? user.id : aptProf;
    if (!aptClient || !aptPhone || !aptService || !profIdToSave || !aptDate || !aptTime) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    let updatedApts;
    if (editingApt) {
      updatedApts = appointments.map(a => a.id === editingApt.id ? { 
        ...a, clientName: aptClient, phone: aptPhone, serviceId: aptService, 
        professionalId: profIdToSave, date: aptDate, time: aptTime 
      } : a);
    } else {
      const newApt: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: aptClient, phone: aptPhone, serviceId: aptService,
        professionalId: profIdToSave, date: aptDate, time: aptTime, status: 'confirmed'
      };
      updatedApts = [...appointments, newApt];
    }
    setAppointments(updatedApts);
    localStorage.setItem('gold_appointments', JSON.stringify(updatedApts));
    setIsAptDialogOpen(false);
    resetAptForm();
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('gold_appointments', JSON.stringify(updated));
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
    let updatedProfs;
    if (editingProf) {
      updatedProfs = professionals.map(p => p.id === editingProf.id ? { 
        ...p, name: profName, specialty: profSpecialty, photo: profPhoto || p.photo, 
        commission: Number(profCommission), email: profEmail, password: profPassword,
        workingHours: profWorkingHours
      } : p);
      
      if (editingProf.id === user?.id) {
        const updatedUser = { ...user, name: profName, email: profEmail };
        setUser(updatedUser);
        localStorage.setItem("gold_user", JSON.stringify(updatedUser));
      }
    } else {
      const newProf: Professional = {
        id: Math.random().toString(36).substr(2, 9),
        name: profName, specialty: profSpecialty, photo: profPhoto || "https://picsum.photos/seed/new/400",
        commission: Number(profCommission), active: true, email: profEmail, password: profPassword,
        workingHours: profWorkingHours
      };
      updatedProfs = [...professionals, newProf];
    }
    setProfessionals(updatedProfs);
    localStorage.setItem('gold_professionals', JSON.stringify(updatedProfs));
    setIsProfDialogOpen(false);
    resetProfForm();
    toast({ title: "Sucesso", description: "Perfil e expediente atualizados." });
  };

  const deleteProfessional = (id: string) => {
    const updated = professionals.filter(p => p.id !== id);
    setAppointments(prev => prev.filter(a => a.professionalId !== id)); // Clean up appointments
    setProfessionals(updated);
    localStorage.setItem('gold_professionals', JSON.stringify(updated));
    localStorage.setItem('gold_appointments', JSON.stringify(appointments.filter(a => a.professionalId !== id)));
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
    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? { 
        ...s, name: srvName, price: Number(srvPrice), duration: Number(srvDuration), description: srvDescription 
      } : s);
    } else {
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9), name: srvName,
        price: Number(srvPrice), duration: Number(srvDuration), description: srvDescription
      };
      updatedServices = [...services, newService];
    }
    setServices(updatedServices);
    localStorage.setItem('gold_services', JSON.stringify(updatedServices));
    setIsServiceDialogOpen(false);
    resetServiceForm();
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('gold_services', JSON.stringify(updated));
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
      const matchesProf = selectedProfFilter === "all" || a.professionalId === selectedProfFilter;
      return matchesSearch && matchesProf;
    });
  }, [appointments, search, selectedProfFilter]);

  const activeSlots = useMemo(() => {
    if (selectedProfFilter === "all") return TIME_SLOTS;
    const prof = professionals.find(p => p.id === selectedProfFilter);
    return prof?.workingHours || [];
  }, [selectedProfFilter, professionals]);

  const handlePrevDay = () => {
    const prev = subDays(new Date(agendaDate + 'T12:00:00'), 1);
    setAgendaDate(format(prev, "yyyy-MM-dd"));
  };

  const handleNextDay = () => {
    const next = addDays(new Date(agendaDate + 'T12:00:00'), 1);
    setAgendaDate(format(next, "yyyy-MM-dd"));
  };

  if (!user) return null;

  return (
    <div className="h-[872px] w-[460px] mx-auto bg-[#030303] flex flex-col text-[#F5F5F5] font-body overflow-hidden border-x border-white/5 relative">
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0a0a0a] z-50">
        <div className="font-anton text-lg tracking-tighter uppercase">
          <span className="text-[#D4AF37]">GOLD</span>
          <span className="text-[#F5F5F5]">{user.role === 'admin' ? 'ADMIN' : 'STAFF'}</span>
        </div>
        <div className="flex gap-1">
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
          <h1 className="text-2xl font-anton uppercase tracking-tight leading-none text-[#F5F5F5]">
            {viewMode === 'appointments' && "AGENDA"}
            {viewMode === 'professionals' && (isAdmin ? "EQUIPE" : "MEU PERFIL")}
            {viewMode === 'services' && "SERVIÇOS"}
            {viewMode === 'finance' && "CAIXA"}
          </h1>
          
          <div className="flex gap-2">
            {viewMode === 'appointments' && (
              <Dialog open={isAptDialogOpen} onOpenChange={setIsAptDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#F5F5F5] text-black font-anton uppercase rounded-full"><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">Reserva</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Cliente</Label><Input value={aptClient} onChange={e=>setAptClient(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">WhatsApp</Label><Input value={aptPhone} onChange={e=>setAptPhone(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Serviço</Label><Select value={aptService} onValueChange={setAptService}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{services.map(s=><SelectItem key={s.id} value={s.id}>{s.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Barbeiro</Label><Select value={aptProf} onValueChange={setAptProf}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{professionals.map(p=><SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Data</Label><Input type="date" value={aptDate} onChange={e=>setAptDate(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Hora</Label><Select value={aptTime} onValueChange={setAptTime}><SelectTrigger className="h-8 text-xs text-[#F5F5F5]"><SelectValue /></SelectTrigger><SelectContent>{TIME_SLOTS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <Button onClick={handleSaveAppointment} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-10 mt-2">Salvar</Button>
                </DialogContent>
              </Dialog>
            )}
            {viewMode === 'professionals' && isAdmin && (
               <Dialog open={isProfDialogOpen} onOpenChange={setIsProfDialogOpen}>
               <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#D4AF37] text-black font-anton uppercase rounded-full"><UserPlus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
               <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%] max-h-[90vh] flex flex-col">
                 <DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">Especialista</DialogTitle></DialogHeader>
                 <ScrollArea className="flex-1 pr-2">
                   <div className="grid grid-cols-2 gap-3 py-2">
                     <div className="space-y-1 col-span-2 flex flex-col items-center mb-2">
                       <Label className="text-[8px] uppercase opacity-40 mb-2 text-[#F5F5F5]">Foto de Perfil</Label>
                       <div 
                         className="w-16 h-16 rounded-full bg-white/5 border border-white/10 overflow-hidden cursor-pointer flex items-center justify-center"
                         onClick={() => fileInputRef.current?.click()}
                       >
                         {profPhoto ? (
                           <img src={profPhoto} className="w-full h-full object-cover" />
                         ) : (
                           <Upload className="h-4 w-4 opacity-20" />
                         )}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                     </div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nome</Label><Input value={profName} onChange={e=>setProfName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Especialidade</Label><Input value={profSpecialty} onChange={e=>setProfSpecialty(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Email</Label><Input value={profEmail} onChange={e=>setProfEmail(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Senha</Label><Input type="password" value={profPassword} onChange={e=>setProfPassword(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Comissão %</Label><Input type="number" value={profCommission} onChange={e=>setProfCommission(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                     <div className="col-span-2 space-y-2 mt-2">
                       <Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Expediente (00:00 - 23:30)</Label>
                       <ScrollArea className="h-48 border border-white/5 rounded-xl p-2 bg-white/[0.02]">
                         <div className="grid grid-cols-4 gap-2">
                           {TIME_SLOTS.map(slot => (
                             <button
                               key={slot}
                               onClick={() => toggleWorkingHour(slot)}
                               className={cn(
                                 "py-1.5 rounded-lg text-[9px] font-anton border transition-all",
                                 profWorkingHours.includes(slot) 
                                   ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                                   : "bg-transparent text-[#F5F5F5]/40 border-white/10"
                               )}
                             >
                               {slot}
                             </button>
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
            {viewMode === 'professionals' && !isAdmin && (
              <Dialog open={isProfDialogOpen} onOpenChange={setIsProfDialogOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%] max-h-[90vh] flex flex-col">
                  <DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">Meu Perfil</DialogTitle></DialogHeader>
                  <ScrollArea className="flex-1 pr-2">
                    <div className="grid grid-cols-2 gap-3 py-2">
                      <div className="space-y-1 col-span-2 flex flex-col items-center mb-2">
                        <Label className="text-[8px] uppercase opacity-40 mb-2 text-[#F5F5F5]">Foto de Perfil</Label>
                        <div 
                          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 overflow-hidden cursor-pointer flex items-center justify-center"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {profPhoto ? (
                            <img src={profPhoto} className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="h-4 w-4 opacity-20" />
                          )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                        <p className="text-[7px] text-[#F5F5F5]/30 mt-1">Clique p/ alterar foto</p>
                      </div>
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nome</Label><Input value={profName} onChange={e=>setProfName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Email</Label><Input value={profEmail} onChange={e=>setProfEmail(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                      <div className="space-y-1 col-span-2"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nova Senha</Label><Input type="password" value={profPassword} onChange={e=>setProfPassword(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                      <div className="col-span-2 space-y-2 mt-2">
                        <Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Meu Expediente (00:00 - 23:30)</Label>
                        <ScrollArea className="h-48 border border-white/5 rounded-xl p-2 bg-white/[0.02]">
                          <div className="grid grid-cols-4 gap-2">
                            {TIME_SLOTS.map(slot => (
                              <button
                                key={slot}
                                onClick={() => toggleWorkingHour(slot)}
                                className={cn(
                                  "py-1.5 rounded-lg text-[9px] font-anton border transition-all",
                                  profWorkingHours.includes(slot) 
                                    ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                                    : "bg-transparent text-[#F5F5F5]/40 border-white/10"
                                )}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </ScrollArea>
                  <Button onClick={handleSaveProfessional} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-10 mt-4 shrink-0">Atualizar Perfil</Button>
                </DialogContent>
              </Dialog>
            )}
            {viewMode === 'services' && isAdmin && (
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-[#D4AF37] text-black font-anton uppercase rounded-full"><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-[#F5F5F5] w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase text-[#F5F5F5]">Serviço</DialogTitle></DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Nome</Label><Input value={srvName} onChange={e=>setSrvName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Preço</Label><Input type="number" value={srvPrice} onChange={e=>setSrvPrice(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40 text-[#F5F5F5]">Minutos</Label><Input type="number" value={srvDuration} onChange={e=>setSrvDuration(e.target.value)} className="h-8 text-xs bg-transparent border-white/10 text-[#F5F5F5]" /></div>
                    </div>
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
            <div className="text-sm font-anton text-[#D4AF37]">R$ {(user.role === 'admin' ? financeData.netProfit : financeData.totalCommissions).toFixed(0)}</div>
          </Card>
        </div>

        <div className="flex-1 overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col">
          {viewMode === 'appointments' && (
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-7 w-7 text-[#F5F5F5]"><ChevronLeft className="h-4 w-4" /></Button>
                <div className="text-[10px] font-anton text-[#D4AF37] uppercase min-w-[120px] text-center">
                  {format(new Date(agendaDate + 'T12:00:00'), "EEEE, dd 'DE' MMMM", { locale: ptBR })}
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-7 w-7 text-[#F5F5F5]"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <Select value={selectedProfFilter} onValueChange={setSelectedProfFilter}>
                <SelectTrigger className="h-7 text-[8px] w-24 border-white/10 uppercase font-anton text-[#F5F5F5]">
                  <SelectValue placeholder="FILTRO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">TODOS</SelectItem>
                  {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
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
                              <div key={apt.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex justify-between items-center group/item hover:border-[#D4AF37]/50 transition-colors shadow-sm">
                                <div className="min-w-0">
                                  <div className="text-[11px] font-anton uppercase truncate text-[#D4AF37] leading-tight">{apt.clientName}</div>
                                  <div className="text-[8px] text-[#F5F5F5]/40 uppercase truncate flex items-center gap-1 mt-1">
                                    <Scissors className="h-2 w-2" /> {getServiceName(apt.serviceId)}
                                    <span className="opacity-20 mx-1">|</span>
                                    <Users className="h-2 w-2" /> {getProfName(apt.professionalId)}
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
                {professionals.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <img src={p.photo} className="w-10 h-10 rounded-full object-cover grayscale" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-anton uppercase text-[#F5F5F5]">{p.name}</div>
                      <div className="text-[8px] text-[#D4AF37] uppercase">{p.specialty}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-2 w-2 text-[#F5F5F5]/20" />
                        <span className="text-[7px] text-[#F5F5F5]/30 uppercase">Expediente: {p.workingHours?.length || 0} slots</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {(isAdmin || p.id === user.id) && (
                        <Button variant="ghost" size="icon" onClick={() => openEditProf(p)} className="h-7 w-7 border border-white/5 text-[#F5F5F5]">
                          {p.id === user.id ? <Edit2 className="h-3 w-3 text-[#D4AF37]" /> : <Edit2 className="h-3 w-3" />}
                        </Button>
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
                {services.map(s => (
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
                  <div className="text-[8px] font-anton uppercase text-[#F5F5F5]/30 tracking-widest">Resumo por Barbeiro</div>
                  {financeData.profBreakdown.map(row => (
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
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7px] font-mono text-[#F5F5F5]/20 uppercase tracking-widest">System Synced • Timeline Active</span>
        </div>
      </footer>
    </div>
  );
}
