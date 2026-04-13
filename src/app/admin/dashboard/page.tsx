
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Users, 
  LogOut, 
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Home,
  Plus,
  Edit2,
  UserPlus,
  Filter,
  Upload,
  DollarSign,
  PieChart,
  Percent,
  Scissors,
  ShieldAlert,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

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
import { Textarea } from "@/components/ui/textarea";
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
    toast({ title: "Sucesso", description: "Agendamento salvo." });
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('gold_appointments', JSON.stringify(updated));
    toast({ title: "Removido", description: "Agendamento excluído." });
  };

  const resetAptForm = () => {
    setEditingApt(null);
    setAptClient("");
    setAptPhone("");
    setAptService("");
    setAptProf("");
    setAptDate(format(new Date(), "yyyy-MM-dd"));
    setAptTime("");
  };

  const openEditApt = (apt: Appointment) => {
    setEditingApt(apt);
    setAptClient(apt.clientName);
    setAptPhone(apt.phone);
    setAptService(apt.serviceId);
    setAptProf(apt.professionalId);
    setAptDate(apt.date);
    setAptTime(apt.time);
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

  const handleSaveProfessional = () => {
    if (!profName || !profSpecialty) {
      toast({ title: "Erro", description: "Campos obrigatórios.", variant: "destructive" });
      return;
    }

    let updatedProfs;
    if (editingProf) {
      updatedProfs = professionals.map(p => p.id === editingProf.id ? { 
        ...p, name: profName, specialty: profSpecialty, 
        photo: profPhoto || p.photo, commission: Number(profCommission),
        email: profEmail, password: profPassword
      } : p);
    } else {
      const newProf: Professional = {
        id: Math.random().toString(36).substr(2, 9),
        name: profName, specialty: profSpecialty,
        photo: profPhoto || "https://picsum.photos/seed/newprof/400/500",
        commission: Number(profCommission), active: true,
        email: profEmail, password: profPassword
      };
      updatedProfs = [...professionals, newProf];
    }
    
    setProfessionals(updatedProfs);
    localStorage.setItem('gold_professionals', JSON.stringify(updatedProfs));
    setIsProfDialogOpen(false);
    resetProfForm();
    toast({ title: "Sucesso", description: "Profissional salvo." });
  };

  const deleteProfessional = (id: string) => {
    const updated = professionals.filter(p => p.id !== id);
    setProfessionals(updated);
    localStorage.setItem('gold_professionals', JSON.stringify(updated));
    toast({ title: "Removido", description: "Profissional excluído." });
  };

  const resetProfForm = () => {
    setEditingProf(null);
    setProfName("");
    setProfEmail("");
    setProfPassword("123");
    setProfSpecialty("");
    setProfPhoto("");
    setProfCommission("50");
  };

  const openEditProf = (prof: Professional) => {
    setEditingProf(prof);
    setProfName(prof.name);
    setProfEmail(prof.email || "");
    setProfPassword(prof.password || "123");
    setProfSpecialty(prof.specialty);
    setProfPhoto(prof.photo);
    setProfCommission(prof.commission?.toString() ?? "50");
    setIsProfDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!srvName || !srvPrice || !srvDuration) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }

    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? { 
        ...s, name: srvName, price: Number(srvPrice), 
        duration: Number(srvDuration), description: srvDescription 
      } : s);
    } else {
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: srvName,
        price: Number(srvPrice),
        duration: Number(srvDuration),
        description: srvDescription
      };
      updatedServices = [...services, newService];
    }
    
    setServices(updatedServices);
    localStorage.setItem('gold_services', JSON.stringify(updatedServices));
    setIsServiceDialogOpen(false);
    resetServiceForm();
    toast({ title: "Sucesso", description: "Serviço salvo." });
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('gold_services', JSON.stringify(updated));
    toast({ title: "Removido", description: "Serviço excluído." });
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setSrvName("");
    setSrvPrice("");
    setSrvDuration("");
    setSrvDescription("");
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setSrvName(service.name);
    setSrvPrice(service.price.toString());
    setSrvDuration(service.duration.toString());
    setSrvDescription(service.description || "");
    setIsServiceDialogOpen(true);
  };

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || "N/A";
  const getProfName = (id: string) => professionals.find(p => p.id === id)?.name || "N/A";

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    const matchesProf = selectedProfFilter === "all" || a.professionalId === selectedProfFilter;
    return matchesSearch && matchesProf;
  }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col md:flex-row text-white font-body">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between md:justify-start gap-3">
          <span className="font-anton text-xl md:text-2xl tracking-tighter uppercase">GOLD<span className="text-primary">{user.role === 'admin' ? 'ADMIN' : 'STAFF'}</span></span>
        </div>
        <nav className="flex-1 p-4 md:p-6 space-y-2 md:space-y-3">
          <Button 
            variant="ghost" 
            onClick={() => setViewMode('appointments')}
            className={cn(
              "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-4 md:py-6",
              viewMode === 'appointments' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
            )}
          >
            <CalendarIcon className="h-4 w-4" /> {user.role === 'admin' ? 'Agendamentos' : 'Minha Agenda'}
          </Button>
          
          {isAdmin && (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setViewMode('professionals')}
                className={cn(
                  "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-4 md:py-6",
                  viewMode === 'professionals' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
                )}
              >
                <Users className="h-4 w-4" /> Equipe
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setViewMode('services')}
                className={cn(
                  "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-4 md:py-6",
                  viewMode === 'services' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
                )}
              >
                <Scissors className="h-4 w-4" /> Serviços
              </Button>
            </>
          )}

          <Button 
            variant="ghost" 
            onClick={() => setViewMode('finance')}
            className={cn(
              "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-4 md:py-6",
              viewMode === 'finance' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
            )}
          >
            <DollarSign className="h-4 w-4" /> {user.role === 'admin' ? 'Gestão de Caixa' : 'Meu Financeiro'}
          </Button>
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3 text-white/40 hover:text-white font-anton uppercase tracking-widest text-[10px]">
                <Home className="h-4 w-4" /> Voltar ao Site
              </Button>
            </Link>
          </div>
        </nav>
        <div className="p-4 md:p-6 border-t border-white/5">
          <div className="mb-4 px-3 flex flex-col">
            <span className="text-[8px] text-white/20 uppercase tracking-widest">Logado como</span>
            <span className="text-[10px] font-anton text-primary uppercase truncate">{user.name}</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 font-anton uppercase tracking-widest text-[10px]">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-y-auto bg-[#030303]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-anton uppercase tracking-tighter leading-none">
              {viewMode === 'appointments' && (user.role === 'admin' ? "PAINEL DE " : "MINHA ")}
              {viewMode === 'professionals' && "GESTÃO DE "}
              {viewMode === 'services' && "TABELA DE "}
              {viewMode === 'finance' && (user.role === 'admin' ? "GESTÃO DE " : "MEU ")}
              <span className="text-shimmer block md:inline">
                {viewMode === 'appointments' && (user.role === 'admin' ? "AGENDAMENTOS" : "AGENDA")}
                {viewMode === 'professionals' && "PROFISSIONAIS"}
                {viewMode === 'services' && "SERVIÇOS"}
                {viewMode === 'finance' && (user.role === 'admin' ? "CAIXA & COMISSÕES" : "FECHAMENTO")}
              </span>
            </h1>
            <p className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 md:mt-3">Sincronização editorial em tempo real</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {viewMode === 'appointments' && (
              <>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Select value={selectedProfFilter} onValueChange={setSelectedProfFilter}>
                      <SelectTrigger className="bg-[#0a0a0a] border-white/10 w-[140px] md:w-[180px] h-10 md:h-12 text-[9px] md:text-[10px] font-anton tracking-widest uppercase">
                        <SelectValue placeholder="FILTRAR..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                        <SelectItem value="all">TODOS OS BARBEIROS</SelectItem>
                        {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Dialog open={isAptDialogOpen} onOpenChange={(open) => { setIsAptDialogOpen(open); if(!open) resetAptForm(); }}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-black hover:bg-primary font-anton uppercase tracking-widest text-[9px] md:text-[10px] px-4 md:px-8 py-4 md:py-6 h-auto rounded-full">
                      <Plus className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Novo Horário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
                    <DialogHeader><DialogTitle className="font-anton text-2xl uppercase tracking-widest text-left">Reserva</DialogTitle></DialogHeader>
                    <div className="space-y-4 md:space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">Cliente</Label>
                          <Input value={aptClient} onChange={(e) => setAptClient(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none uppercase" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">WhatsApp</Label>
                          <Input value={aptPhone} onChange={(e) => setAptPhone(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">Serviço</Label>
                          <Select value={aptService} onValueChange={setAptService}>
                            <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] text-white">
                              {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name.toUpperCase()}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">Barbeiro</Label>
                          {user.role === 'barber' ? (
                            <div className="h-12 flex items-center px-4 border-b border-white/10 text-primary font-anton text-xs uppercase">{user.name}</div>
                          ) : (
                            <Select value={aptProf} onValueChange={setAptProf}>
                              <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-[#0a0a0a] text-white">
                                {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">Data</Label>
                          <Input type="date" value={aptDate} onChange={(e) => setAptDate(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase text-white/40">Hora</Label>
                          <Select value={aptTime} onValueChange={setAptTime}>
                            <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] text-white">
                              {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveAppointment} className="w-full bg-primary text-black font-anton uppercase h-12">Salvar Reserva</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}

            {viewMode === 'professionals' && isAdmin && (
              <Dialog open={isProfDialogOpen} onOpenChange={(open) => { setIsProfDialogOpen(open); if(!open) resetProfForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-white font-anton uppercase tracking-widest text-[9px] md:text-[10px] px-4 md:px-8 py-4 md:py-6 h-auto rounded-full">
                    <UserPlus className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Novo Especialista
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
                  <DialogHeader><DialogTitle className="font-anton text-2xl uppercase tracking-widest text-left">{editingProf ? 'Editar Especialista' : 'Novo Especialista'}</DialogTitle></DialogHeader>
                  <div className="space-y-4 md:space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-900 group relative">
                        {profPhoto ? <img src={profPhoto} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Users /></div>}
                        <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center"><Upload className="h-5 w-5" /></button>
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">Nome</Label>
                        <Input value={profName} onChange={(e) => setProfName(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none uppercase" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">Especialidade</Label>
                        <Input value={profSpecialty} onChange={(e) => setProfSpecialty(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none uppercase" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">E-mail (Login)</Label>
                        <Input value={profEmail} onChange={(e) => setProfEmail(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">Senha</Label>
                        <Input value={profPassword} onChange={(e) => setProfPassword(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-white/40">Comissão (%)</Label>
                      <div className="relative">
                        <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <Input type="number" value={profCommission} onChange={(e) => setProfCommission(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveProfessional} className="w-full bg-primary text-black font-anton uppercase py-4 md:py-6 h-auto">Salvar Perfil</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {viewMode === 'services' && isAdmin && (
              <Dialog open={isServiceDialogOpen} onOpenChange={(open) => { setIsServiceDialogOpen(open); if(!open) resetServiceForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-white font-anton uppercase tracking-widest text-[9px] md:text-[10px] px-4 md:px-8 py-4 md:py-6 h-auto rounded-full">
                    <Plus className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Novo Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
                  <DialogHeader><DialogTitle className="font-anton text-2xl uppercase tracking-widest text-left">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle></DialogHeader>
                  <div className="space-y-4 md:space-y-6 py-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-white/40">Nome do Serviço</Label>
                      <Input value={srvName} onChange={(e) => setSrvName(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none uppercase" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">Preço (R$)</Label>
                        <Input type="number" value={srvPrice} onChange={(e) => setSrvPrice(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase text-white/40">Duração (Min)</Label>
                        <Input type="number" value={srvDuration} onChange={(e) => setSrvDuration(e.target.value)} className="bg-transparent border-white/10 border-b rounded-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase text-white/40">Descrição</Label>
                      <Textarea value={srvDescription} onChange={(e) => setSrvDescription(e.target.value)} className="bg-transparent border-white/10 rounded-xl min-h-[80px] md:min-h-[100px]" placeholder="Breve descrição do serviço..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveService} className="w-full bg-primary text-black font-anton uppercase py-4 md:py-6 h-auto">Salvar Serviço</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {viewMode === 'appointments' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="bg-[#0a0a0a] border-white/5 p-4 rounded-3xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Revenue</span>
                    <TrendingUp className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-2xl md:text-4xl font-anton tracking-tighter">R$ {financeData.totalRevenue.toFixed(0)}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 p-4 rounded-3xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Appointments</span>
                    <Clock className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-2xl md:text-4xl font-anton tracking-tighter">{filteredAppointments.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 p-4 rounded-3xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{user.role === 'admin' ? 'Net Profit' : 'My Commission'}</span>
                    <CheckCircle className="text-emerald-500 h-4 w-4" />
                  </div>
                  <div className="text-2xl md:text-4xl font-anton tracking-tighter text-primary">R$ {(user.role === 'admin' ? financeData.netProfit : financeData.totalCommissions).toFixed(0)}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#0a0a0a] border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow className="border-white/5">
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 h-14 md:h-16">Data / Hora</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30">Cliente</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 hidden sm:table-cell">Serviço</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 hidden md:table-cell">Barbeiro</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 text-right pr-6 md:pr-12">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((apt) => (
                      <TableRow key={apt.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                        <TableCell className="py-4 md:py-6">
                          <div className="flex flex-col">
                            <span className="font-anton text-[11px] md:text-sm">{format(new Date(apt.date + 'T12:00:00'), "dd/MM/yy")}</span>
                            <span className="text-[9px] md:text-[10px] text-primary uppercase">{apt.time}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-anton text-[11px] md:text-sm uppercase max-w-[80px] md:max-w-none truncate">{apt.clientName}</TableCell>
                        <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[8px] md:text-[9px] uppercase px-2 py-0">{getServiceName(apt.serviceId)}</Badge></TableCell>
                        <TableCell className="font-anton text-[9px] text-white/60 uppercase hidden md:table-cell">{getProfName(apt.professionalId)}</TableCell>
                        <TableCell className="text-right pr-4 md:pr-8">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditApt(apt)} className="text-white/20 hover:text-primary h-8 w-8"><Edit2 className="h-3 w-3 md:h-4 md:w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteAppointment(apt.id)} className="text-white/20 hover:text-destructive h-8 w-8"><Trash2 className="h-3 w-3 md:h-4 md:w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </>
        )}

        {viewMode === 'professionals' && isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {professionals.map((prof) => (
              <Card key={prof.id} className="bg-[#0a0a0a] border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-40 h-48 md:h-auto overflow-hidden">
                    <img src={prof.photo} alt={prof.name} className="w-full h-full object-cover grayscale opacity-50 md:opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-anton text-xl md:text-2xl uppercase tracking-widest truncate">{prof.name}</h3>
                        <Badge className="bg-primary/20 text-primary border-none text-[8px] md:text-[9px] uppercase px-2 md:px-3">{(prof.commission ?? 0)}%</Badge>
                      </div>
                      <p className="text-[9px] md:text-[10px] font-mono text-primary uppercase tracking-widest">{prof.specialty}</p>
                      <p className="text-[8px] text-white/20 mt-2 uppercase tracking-widest truncate">Login: {prof.email || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2 md:gap-3 mt-6 md:mt-10">
                      <Button variant="ghost" onClick={() => openEditProf(prof)} className="flex-1 border border-white/10 text-white/40 hover:text-white uppercase text-[8px] md:text-[9px] h-10 md:h-12 rounded-xl"><Edit2 className="mr-2 h-3 w-3" /> Editar</Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProfessional(prof.id)} className="border border-white/10 text-white/20 hover:text-destructive h-10 w-10 md:h-12 md:w-12 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === 'services' && isAdmin && (
          <div className="space-y-4">
            {/* Mobile Cards (460px optimization) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {services.map((service) => (
                <Card key={service.id} className="bg-[#0a0a0a] border-white/5 p-5 rounded-[1.5rem]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="max-w-[70%]">
                      <h3 className="font-anton text-lg uppercase tracking-widest text-white leading-tight">{service.name}</h3>
                      <Badge variant="outline" className="mt-1 text-[7px] border-white/10 text-white/40">{service.duration} MIN</Badge>
                    </div>
                    <span className="font-anton text-lg text-primary">R$ {service.price.toFixed(0)}</span>
                  </div>
                  <p className="text-[9px] text-white/30 line-clamp-2 mb-4 h-6 uppercase font-mono">{service.description || "Sem descrição"}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => openEditService(service)} className="flex-1 bg-white/5 border border-white/5 text-white/60 hover:text-white text-[8px] uppercase font-anton h-10 rounded-xl"><Edit2 className="mr-2 h-3 w-3" /> Editar</Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} className="bg-destructive/10 border border-destructive/10 text-destructive/60 hover:text-destructive h-10 w-10 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table (kept for larger screens) */}
            <Card className="hidden md:block bg-[#0a0a0a] border-white/5 rounded-[2rem] overflow-hidden">
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-white/5">
                    <TableHead className="font-anton uppercase text-[10px] tracking-widest text-white/30 h-16">Serviço</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-widest text-white/30">Descrição</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-widest text-white/30">Duração</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-widest text-white/30">Preço</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-widest text-white/30 text-right pr-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                      <TableCell className="py-6">
                        <span className="font-anton text-sm uppercase tracking-widest">{service.name}</span>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="text-[10px] text-white/40 truncate">{service.description || "Sem descrição"}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] border-white/10 text-white/60">{service.duration} MIN</Badge>
                      </TableCell>
                      <TableCell className="font-anton text-lg text-primary">
                        R$ {service.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditService(service)} className="text-white/20 hover:text-primary"><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)} className="text-white/20 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {viewMode === 'finance' && (
          <div className="space-y-6 md:space-y-12">
            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-[#0a0a0a] border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem]">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="p-2 md:p-3 bg-primary/10 rounded-xl md:rounded-2xl"><TrendingUp className="text-primary h-5 w-5 md:h-6 md:w-6" /></div>
                  <span className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Valor Gerado</span>
                </div>
                <div className="text-3xl md:text-5xl font-anton">R$ {financeData.totalRevenue.toFixed(2)}</div>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem]">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="p-2 md:p-3 bg-secondary/10 rounded-xl md:rounded-2xl"><PieChart className="text-secondary h-5 w-5 md:h-6 md:w-6" /></div>
                  <span className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Total Comissões</span>
                </div>
                <div className="text-3xl md:text-5xl font-anton text-secondary">R$ {financeData.totalCommissions.toFixed(2)}</div>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                  <div className="p-2 md:p-3 bg-emerald-500/10 rounded-xl md:rounded-2xl"><CheckCircle className="text-emerald-500 h-5 w-5 md:h-6 md:w-6" /></div>
                  <span className="text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{user.role === 'admin' ? 'Lucro Líquido' : 'Meu Saldo'}</span>
                </div>
                <div className="text-3xl md:text-5xl font-anton text-emerald-500">R$ {(user.role === 'admin' ? financeData.netProfit : financeData.totalCommissions).toFixed(2)}</div>
              </Card>
            </div>

            {/* Commissions Table */}
            <Card className="bg-[#0a0a0a] border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
              <CardHeader className="p-6 md:p-8 border-b border-white/5">
                <CardTitle className="text-[10px] md:text-xs font-anton uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/60">{user.role === 'admin' ? 'Fechamento por Colaborador' : 'Detalhamento de Atendimentos'}</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-black/20">
                    <TableRow className="border-white/5">
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 h-14 md:h-16">{user.role === 'admin' ? 'Especialista' : 'Descrição'}</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30">Cortes / Serv.</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30">Valor Gerado</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 hidden sm:table-cell">Sua %</TableHead>
                      <TableHead className="font-anton uppercase text-[9px] md:text-[10px] tracking-widest text-white/30 text-right pr-6 md:pr-12">Comissão Devida</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeData.profBreakdown.map((row) => (
                      <TableRow key={row.id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="py-6 md:py-8 font-anton uppercase tracking-widest text-[11px] md:text-sm">{row.name}</TableCell>
                        <TableCell className="font-mono text-[10px]">{row.aptsCount} un</TableCell>
                        <TableCell className="font-anton text-sm md:text-lg">R$ {row.revenue.toFixed(2)}</TableCell>
                        <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="border-white/10 text-white/40 text-[8px] uppercase">{row.percentage}%</Badge></TableCell>
                        <TableCell className="text-right pr-6 md:pr-12 font-anton text-lg md:text-2xl text-primary">R$ {row.commission.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
