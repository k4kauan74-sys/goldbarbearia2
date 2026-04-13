
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
  Edit2, 
  UserPlus, 
  Upload, 
  DollarSign, 
  PieChart, 
  TrendingUp,
  CheckCircle,
  Clock,
  Home,
  Plus,
  Scissors,
  Percent
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

  const handleSaveProfessional = () => {
    if (!profName || !profSpecialty) return;
    let updatedProfs;
    if (editingProf) {
      updatedProfs = professionals.map(p => p.id === editingProf.id ? { 
        ...p, name: profName, specialty: profSpecialty, photo: profPhoto || p.photo, 
        commission: Number(profCommission), email: profEmail, password: profPassword
      } : p);
    } else {
      const newProf: Professional = {
        id: Math.random().toString(36).substr(2, 9),
        name: profName, specialty: profSpecialty, photo: profPhoto || "https://picsum.photos/seed/new/400",
        commission: Number(profCommission), active: true, email: profEmail, password: profPassword
      };
      updatedProfs = [...professionals, newProf];
    }
    setProfessionals(updatedProfs);
    localStorage.setItem('gold_professionals', JSON.stringify(updatedProfs));
    setIsProfDialogOpen(false);
    resetProfForm();
  };

  const deleteProfessional = (id: string) => {
    const updated = professionals.filter(p => p.id !== id);
    setProfessionals(updated);
    localStorage.setItem('gold_professionals', JSON.stringify(updated));
  };

  const resetProfForm = () => {
    setEditingProf(null); setProfName(""); setProfEmail(""); setProfPassword("123");
    setProfSpecialty(""); setProfPhoto(""); setProfCommission("50");
  };

  const openEditProf = (prof: Professional) => {
    setEditingProf(prof); setProfName(prof.name); setProfEmail(prof.email || "");
    setProfPassword(prof.password || "123"); setProfSpecialty(prof.specialty);
    setProfPhoto(prof.photo); setProfCommission(prof.commission?.toString() ?? "50");
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

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    const matchesProf = selectedProfFilter === "all" || a.professionalId === selectedProfFilter;
    return matchesSearch && matchesProf;
  }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  if (!user) return null;

  return (
    <div className="h-[872px] w-[460px] mx-auto bg-[#030303] flex flex-col text-white font-body overflow-hidden border-x border-white/5 relative">
      {/* Mini Sidebar/Top Nav Otimizada */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0a0a0a] z-50">
        <div className="font-anton text-lg tracking-tighter uppercase">GOLD<span className="text-primary">{user.role === 'admin' ? 'ADMIN' : 'STAFF'}</span></div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('appointments')} className={cn("h-8 w-8", viewMode === 'appointments' && "text-primary")}><CalendarIcon className="h-4 w-4" /></Button>
          {isAdmin && (
            <>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('professionals')} className={cn("h-8 w-8", viewMode === 'professionals' && "text-primary")}><Users className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('services')} className={cn("h-8 w-8", viewMode === 'services' && "text-primary")}><Scissors className="h-4 w-4" /></Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setViewMode('finance')} className={cn("h-8 w-8", viewMode === 'finance' && "text-primary")}><DollarSign className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-destructive"><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      {/* Main Content Area - Sem Scroll Global */}
      <main className="flex-1 flex flex-col overflow-hidden p-4 pt-6">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-2xl font-anton uppercase tracking-tight leading-none">
            {viewMode === 'appointments' && "AGENDA"}
            {viewMode === 'professionals' && "EQUIPE"}
            {viewMode === 'services' && "SERVIÇOS"}
            {viewMode === 'finance' && "CAIXA"}
          </h1>
          
          {/* Ações Rápidas por View */}
          <div className="flex gap-2">
            {viewMode === 'appointments' && (
              <Dialog open={isAptDialogOpen} onOpenChange={setIsAptDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-white text-black font-anton uppercase rounded-full"><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase">Reserva</DialogTitle></DialogHeader>
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Cliente</Label><Input value={aptClient} onChange={e=>setAptClient(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">WhatsApp</Label><Input value={aptPhone} onChange={e=>setAptPhone(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Serviço</Label><Select value={aptService} onValueChange={setAptService}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{services.map(s=><SelectItem key={s.id} value={s.id}>{s.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Barbeiro</Label><Select value={aptProf} onValueChange={setAptProf}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{professionals.map(p=><SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Data</Label><Input type="date" value={aptDate} onChange={e=>setAptDate(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Hora</Label><Select value={aptTime} onValueChange={setAptTime}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{TIME_SLOTS.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                  </div>
                  <Button onClick={handleSaveAppointment} className="w-full bg-primary text-black font-anton uppercase h-10 mt-2">Salvar</Button>
                </DialogContent>
              </Dialog>
            )}
            {viewMode === 'professionals' && isAdmin && (
               <Dialog open={isProfDialogOpen} onOpenChange={setIsProfDialogOpen}>
               <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-primary text-black font-anton uppercase rounded-full"><UserPlus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
               <DialogContent className="bg-[#0a0a0a] border-white/10 text-white w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase">Especialista</DialogTitle></DialogHeader>
                 <div className="grid grid-cols-2 gap-3 py-2">
                   <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Nome</Label><Input value={profName} onChange={e=>setProfName(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                   <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Especialidade</Label><Input value={profSpecialty} onChange={e=>setProfSpecialty(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                   <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Email</Label><Input value={profEmail} onChange={e=>setProfEmail(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                   <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Comissão %</Label><Input type="number" value={profCommission} onChange={e=>setProfCommission(e.target.value)} className="h-8 text-xs bg-transparent border-white/10" /></div>
                 </div>
                 <Button onClick={handleSaveProfessional} className="w-full bg-primary text-black font-anton uppercase h-10 mt-2">Salvar</Button>
               </DialogContent>
             </Dialog>
            )}
            {viewMode === 'services' && isAdmin && (
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild><Button size="sm" className="h-8 text-[9px] bg-primary text-black font-anton uppercase rounded-full"><Plus className="h-3 w-3 mr-1" /> Novo</Button></DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white w-[90%]"><DialogHeader><DialogTitle className="font-anton uppercase">Serviço</DialogTitle></DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Nome</Label><Input value={srvName} onChange={e=>setSrvName(e.target.value)} className="h-8 text-xs" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Preço</Label><Input type="number" value={srvPrice} onChange={e=>setSrvPrice(e.target.value)} className="h-8 text-xs" /></div>
                      <div className="space-y-1"><Label className="text-[8px] uppercase opacity-40">Minutos</Label><Input type="number" value={srvDuration} onChange={e=>setSrvDuration(e.target.value)} className="h-8 text-xs" /></div>
                    </div>
                  </div>
                  <Button onClick={handleSaveService} className="w-full bg-primary text-black font-anton uppercase h-10 mt-2">Salvar</Button>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Dash Summary - Super Compacto */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-white/40 uppercase">Geração</div>
            <div className="text-sm font-anton text-primary">R$ {financeData.totalRevenue.toFixed(0)}</div>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-white/40 uppercase">Agenda</div>
            <div className="text-sm font-anton">{filteredAppointments.length}</div>
          </Card>
          <Card className="bg-[#0a0a0a] border-white/5 p-2 rounded-2xl">
            <div className="text-[7px] font-bold text-white/40 uppercase">Saldo</div>
            <div className="text-sm font-anton text-emerald-500">R$ {(user.role === 'admin' ? financeData.netProfit : financeData.totalCommissions).toFixed(0)}</div>
          </Card>
        </div>

        {/* Content Area com Scroll Interno Limitado */}
        <div className="flex-1 overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-3xl">
          <div className="h-full overflow-y-auto custom-scrollbar">
            {viewMode === 'appointments' && (
              <Table>
                <TableBody>
                  {filteredAppointments.map((apt) => (
                    <TableRow key={apt.id} className="border-white/5">
                      <TableCell className="p-3">
                        <div className="text-[10px] font-anton leading-tight">{format(new Date(apt.date + 'T12:00:00'), "dd/MM")} <span className="text-primary">{apt.time}</span></div>
                        <div className="text-[10px] uppercase truncate max-w-[80px] text-white/60">{apt.clientName}</div>
                      </TableCell>
                      <TableCell className="p-3 hidden sm:table-cell">
                        <Badge variant="outline" className="text-[7px] uppercase px-1 py-0">{getServiceName(apt.serviceId)}</Badge>
                      </TableCell>
                      <TableCell className="p-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditApt(apt)} className="h-7 w-7 text-white/20"><Edit2 className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteAppointment(apt.id)} className="h-7 w-7 text-white/20"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {viewMode === 'professionals' && (
              <div className="p-3 space-y-2">
                {professionals.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <img src={p.photo} className="w-10 h-10 rounded-full object-cover grayscale" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-anton uppercase truncate">{p.name}</div>
                      <div className="text-[8px] text-primary uppercase">{p.specialty}</div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditProf(p)} className="h-7 w-7 border border-white/5"><Edit2 className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProfessional(p.id)} className="h-7 w-7 border border-white/5 text-destructive"><Trash2 className="h-3 w-3" /></Button>
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
                      <div className="text-[10px] font-anton uppercase">{s.name}</div>
                      <div className="text-[8px] text-white/40">{s.duration} MIN • <span className="text-primary font-bold">R$ {s.price}</span></div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditService(s)} className="h-7 w-7"><Edit2 className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteService(s.id)} className="h-7 w-7 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'finance' && (
              <div className="p-3 space-y-3">
                <div className="space-y-2">
                  <div className="text-[8px] font-anton uppercase text-white/30 tracking-widest">Resumo por Barbeiro</div>
                  {financeData.profBreakdown.map(row => (
                    <div key={row.id} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="text-[10px] font-anton uppercase">{row.name}</div>
                      <div className="text-right">
                        <div className="text-[10px] font-anton text-primary">R$ {row.commission.toFixed(0)}</div>
                        <div className="text-[7px] text-white/40 uppercase">{row.aptsCount} atendimentos</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Nav Compacta */}
      <footer className="h-10 border-t border-white/5 flex items-center justify-center px-4 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">System Synced • 460x872 Optimized</span>
        </div>
      </footer>
    </div>
  );
}
