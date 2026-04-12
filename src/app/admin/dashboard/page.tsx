
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
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
  X
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
import { MOCK_SERVICES, MOCK_PROFESSIONALS, TIME_SLOTS } from "@/lib/mock-data";
import { Professional, Appointment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'appointments' | 'professionals';

export default function AdminDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProfFilter, setSelectedProfFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Dialog States
  const [isProfDialogOpen, setIsProfDialogOpen] = useState(false);
  const [isAptDialogOpen, setIsAptDialogOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  
  // Form State for Professional
  const [profName, setProfName] = useState("");
  const [profSpecialty, setProfSpecialty] = useState("");
  const [profPhoto, setProfPhoto] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Appointment
  const [aptClient, setAptClient] = useState("");
  const [aptPhone, setAptPhone] = useState("");
  const [aptService, setAptService] = useState("");
  const [aptProf, setAptProf] = useState("");
  const [aptDate, setAptDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [aptTime, setAptTime] = useState("");

  const router = useRouter();

  useEffect(() => {
    const isLogged = localStorage.getItem("gold_admin_logged");
    if (!isLogged) {
      router.push("/admin/login");
      return;
    }

    // Load Appointments
    const savedApts = JSON.parse(localStorage.getItem('gold_appointments') || '[]');
    setAppointments(savedApts);

    // Load Professionals
    const savedProfs = JSON.parse(localStorage.getItem('gold_professionals') || '[]');
    if (savedProfs.length === 0) {
      localStorage.setItem('gold_professionals', JSON.stringify(MOCK_PROFESSIONALS));
      setProfessionals(MOCK_PROFESSIONALS);
    } else {
      setProfessionals(savedProfs);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("gold_admin_logged");
    router.push("/admin/login");
  };

  // Appointment CRUD
  const handleSaveAppointment = () => {
    if (!aptClient || !aptPhone || !aptService || !aptProf || !aptDate || !aptTime) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    let updatedApts;
    if (editingApt) {
      updatedApts = appointments.map(a => a.id === editingApt.id ? { 
        ...a, 
        clientName: aptClient, 
        phone: aptPhone, 
        serviceId: aptService, 
        professionalId: aptProf, 
        date: aptDate, 
        time: aptTime 
      } : a);
    } else {
      const newApt: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: aptClient,
        phone: aptPhone,
        serviceId: aptService,
        professionalId: aptProf,
        date: aptDate,
        time: aptTime,
        status: 'confirmed'
      };
      updatedApts = [...appointments, newApt];
    }
    
    setAppointments(updatedApts);
    localStorage.setItem('gold_appointments', JSON.stringify(updatedApts));
    setIsAptDialogOpen(false);
    resetAptForm();
    toast({ title: "Sucesso", description: "Agendamento salvo com sucesso." });
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

  // Professional CRUD
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfessional = () => {
    if (!profName || !profSpecialty) {
      toast({ title: "Erro", description: "Nome e especialidade são obrigatórios.", variant: "destructive" });
      return;
    }

    let updatedProfs;
    if (editingProf) {
      updatedProfs = professionals.map(p => p.id === editingProf.id ? { 
        ...p, 
        name: profName, 
        specialty: profSpecialty, 
        photo: profPhoto || p.photo 
      } : p);
    } else {
      const newProf: Professional = {
        id: Math.random().toString(36).substr(2, 9),
        name: profName,
        specialty: profSpecialty,
        photo: profPhoto || "https://picsum.photos/seed/newprof/400/500",
        active: true
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
    // Optional: cleanup appointments
    const updatedApts = appointments.filter(a => a.professionalId !== id);
    setAppointments(updatedApts);
    localStorage.setItem('gold_appointments', JSON.stringify(updatedApts));
    toast({ title: "Removido", description: "Profissional e sua agenda foram removidos." });
  };

  const resetProfForm = () => {
    setEditingProf(null);
    setProfName("");
    setProfSpecialty("");
    setProfPhoto("");
  };

  const openEditProf = (prof: Professional) => {
    setEditingProf(prof);
    setProfName(prof.name);
    setProfSpecialty(prof.specialty);
    setProfPhoto(prof.photo);
    setIsProfDialogOpen(true);
  };

  const getServiceName = (id: string) => MOCK_SERVICES.find(s => s.id === id)?.name || "N/A";
  const getProfName = (id: string) => professionals.find(p => p.id === id)?.name || "N/A";

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    const matchesProf = selectedProfFilter === "all" || a.professionalId === selectedProfFilter;
    return matchesSearch && matchesProf;
  }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col md:flex-row text-white font-body">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <span className="font-anton text-2xl tracking-tighter uppercase">GOLD<span className="text-primary">ADMIN</span></span>
        </div>
        <nav className="flex-1 p-6 space-y-3">
          <Button 
            variant="ghost" 
            onClick={() => setViewMode('appointments')}
            className={cn(
              "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-6",
              viewMode === 'appointments' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
            )}
          >
            <CalendarIcon className="h-4 w-4" /> Agendamentos
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setViewMode('professionals')}
            className={cn(
              "w-full justify-start gap-3 font-anton uppercase tracking-widest text-[10px] py-6",
              viewMode === 'professionals' ? "bg-primary/10 text-primary border border-primary/20" : "text-white/40 hover:text-white"
            )}
          >
            <Users className="h-4 w-4" /> Equipe / Profissionais
          </Button>
          
          <div className="pt-6 mt-6 border-t border-white/5">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3 text-white/40 hover:text-white font-anton uppercase tracking-widest text-[10px]">
                <Home className="h-4 w-4" /> Voltar ao Site
              </Button>
            </Link>
          </div>
        </nav>
        <div className="p-6 border-t border-white/5">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 font-anton uppercase tracking-widest text-[10px]">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#030303]">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-anton uppercase tracking-tighter">
              {viewMode === 'appointments' ? "PAINEL DE " : "GESTÃO DE "}
              <span className="text-shimmer">
                {viewMode === 'appointments' ? "AGENDAMENTOS" : "PROFISSIONAIS"}
              </span>
            </h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Gestão em tempo real sincronizada</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {viewMode === 'appointments' ? (
              <>
                <div className="flex items-center gap-3">
                  <Filter className="h-4 w-4 text-white/20" />
                  <Select value={selectedProfFilter} onValueChange={setSelectedProfFilter}>
                    <SelectTrigger className="bg-[#0a0a0a] border-white/10 w-[180px] h-12 text-[10px] font-anton tracking-widest uppercase">
                      <SelectValue placeholder="FILTRAR POR..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                      <SelectItem value="all">TODOS OS PROFISSIONAIS</SelectItem>
                      {professionals.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    placeholder="BUSCAR CLIENTE..." 
                    className="pl-12 bg-[#0a0a0a] border-white/10 rounded-full h-12 w-full md:w-[250px] text-[10px] font-anton tracking-widest uppercase focus:border-primary/40 transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Dialog open={isAptDialogOpen} onOpenChange={(open) => { setIsAptDialogOpen(open); if(!open) resetAptForm(); }}>
                  <DialogTrigger asChild>
                    <Button className="bg-white text-black hover:bg-primary font-anton uppercase tracking-widest text-[10px] px-8 py-6 rounded-full transition-all">
                      <Plus className="mr-2 h-4 w-4" /> Novo Horário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="font-anton text-2xl uppercase tracking-widest">
                        {editingApt ? "Editar Agendamento" : "Criar Novo Agendamento"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Cliente</Label>
                          <Input 
                            value={aptClient}
                            onChange={(e) => setAptClient(e.target.value)}
                            className="bg-transparent border-white/10 border-b rounded-none py-6 focus:border-primary uppercase"
                            placeholder="NOME"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Telefone</Label>
                          <Input 
                            value={aptPhone}
                            onChange={(e) => setAptPhone(e.target.value)}
                            className="bg-transparent border-white/10 border-b rounded-none py-6 focus:border-primary"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Serviço</Label>
                          <Select value={aptService} onValueChange={setAptService}>
                            <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12">
                              <SelectValue placeholder="SELECIONE" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              {MOCK_SERVICES.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name.toUpperCase()}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Barbeiro</Label>
                          <Select value={aptProf} onValueChange={setAptProf}>
                            <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12">
                              <SelectValue placeholder="SELECIONE" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              {professionals.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name.toUpperCase()}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Data</Label>
                          <Input 
                            type="date"
                            value={aptDate}
                            onChange={(e) => setAptDate(e.target.value)}
                            className="bg-transparent border-white/10 border-b rounded-none py-6 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-white/40">Hora</Label>
                          <Select value={aptTime} onValueChange={setAptTime}>
                            <SelectTrigger className="bg-transparent border-white/10 border-b rounded-none h-12">
                              <SelectValue placeholder="SELECIONE" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                              {TIME_SLOTS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleSaveAppointment}
                        className="w-full bg-primary text-black hover:bg-white font-anton uppercase tracking-widest py-8"
                      >
                        {editingApt ? "ATUALIZAR RESERVA" : "CONFIRMAR AGENDAMENTO"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <Dialog open={isProfDialogOpen} onOpenChange={(open) => { setIsProfDialogOpen(open); if(!open) resetProfForm(); }}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-black hover:bg-white font-anton uppercase tracking-widest text-[10px] px-8 py-6 rounded-full transition-all">
                    <UserPlus className="mr-2 h-4 w-4" /> Novo Profissional
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="font-anton text-2xl uppercase tracking-widest">
                      {editingProf ? "Editar Profissional" : "Adicionar Profissional"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-900 group relative">
                        {profPhoto ? (
                          <img src={profPhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <Users className="h-12 w-12" />
                          </div>
                        )}
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Upload className="h-6 w-6 text-white" />
                        </button>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                      />
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Clique para enviar foto</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-white/40">Nome do Especialista</Label>
                      <Input 
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="bg-transparent border-white/10 border-b rounded-none py-6 text-lg focus:border-primary uppercase"
                        placeholder="NOME COMPLETO"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-white/40">Especialidade</Label>
                      <Input 
                        value={profSpecialty}
                        onChange={(e) => setProfSpecialty(e.target.value)}
                        className="bg-transparent border-white/10 border-b rounded-none py-6 text-lg focus:border-primary uppercase"
                        placeholder="EX: CORTES CLÁSSICOS"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSaveProfessional}
                      className="w-full bg-primary text-black hover:bg-white font-anton uppercase tracking-widest py-8"
                    >
                      Salvar Alterações
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {viewMode === 'appointments' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl p-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Total Visível</span>
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-5xl font-anton tracking-tighter">{filteredAppointments.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl p-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Hoje</span>
                    <CheckCircle className="text-emerald-500 h-5 w-5" />
                  </div>
                  <div className="text-5xl font-anton tracking-tighter">
                    {appointments.filter(a => a.date === format(new Date(), "yyyy-MM-dd")).length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#0a0a0a] border-white/5 rounded-3xl p-4">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Faturamento Est.</span>
                    <TrendingUp className="text-primary h-5 w-5" />
                  </div>
                  <div className="text-5xl font-anton tracking-tighter text-primary">
                    R$ {filteredAppointments.reduce((acc, curr) => acc + (MOCK_SERVICES.find(s => s.id === curr.serviceId)?.price || 0), 0).toFixed(0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Table */}
            <Card className="bg-[#0a0a0a] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] py-8">
                <CardTitle className="text-xs font-anton uppercase tracking-[0.4em] text-white/60">
                  {selectedProfFilter === "all" ? "Lista de Reservas em Tempo Real" : `Agenda de ${getProfName(selectedProfFilter)}`}
                </CardTitle>
              </CardHeader>
              <Table>
                <TableHeader className="bg-black/40">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30 h-16">Data / Hora</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30">Cliente</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30">WhatsApp</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30">Serviço</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30">Profissional</TableHead>
                    <TableHead className="font-anton uppercase text-[10px] tracking-[0.2em] text-white/30 text-right pr-12">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                    <TableRow key={apt.id} className="border-white/5 hover:bg-white/[0.03] transition-colors group">
                      <TableCell className="py-8">
                        <div className="flex flex-col">
                          <span className="font-anton text-sm">{format(new Date(apt.date + 'T12:00:00'), "dd/MM/yyyy")}</span>
                          <span className="text-[10px] font-mono text-primary uppercase tracking-widest">{apt.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-anton text-sm uppercase tracking-tight">{apt.clientName}</TableCell>
                      <TableCell className="text-white/40 font-mono text-[10px] tracking-widest">{apt.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-anton uppercase tracking-widest px-3 py-1">
                          {getServiceName(apt.serviceId)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-anton text-[10px] uppercase text-white/60 tracking-widest">
                        {getProfName(apt.professionalId)}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditApt(apt)}
                            className="text-white/20 hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteAppointment(apt.id)}
                            className="text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center text-white/10 font-anton uppercase tracking-[0.5em] text-xs">
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </>
        ) : (
          /* Professionals Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {professionals.map((prof) => (
              <Card key={prof.id} className="bg-[#0a0a0a] border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all duration-500">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden">
                    <img 
                      src={prof.photo} 
                      alt={prof.name} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-anton text-2xl uppercase tracking-widest text-white">{prof.name}</h3>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-anton tracking-[0.2em] uppercase px-3">Ativo</Badge>
                      </div>
                      <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-6">{prof.specialty}</p>
                      
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-white/20 uppercase tracking-widest font-mono">Agendamentos</span>
                          <span className="font-anton text-lg">{appointments.filter(a => a.professionalId === prof.id).length}</span>
                        </div>
                        <Button 
                          variant="link" 
                          onClick={() => { setSelectedProfFilter(prof.id); setViewMode('appointments'); }}
                          className="p-0 h-auto text-[9px] text-primary uppercase tracking-widest font-bold"
                        >
                          Ver Agenda Completa →
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-10">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditProf(prof)}
                        className="flex-1 border border-white/10 text-white/40 hover:text-white hover:border-white/20 font-anton uppercase tracking-widest text-[9px] rounded-xl h-12"
                      >
                        <Edit2 className="mr-2 h-3 w-3" /> Editar Perfil
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteProfessional(prof.id)}
                        className="border border-white/10 text-white/20 hover:text-destructive hover:bg-destructive/10 rounded-xl h-12 w-12"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <button 
              onClick={() => setIsProfDialogOpen(true)}
              className="border-2 border-dashed border-white/5 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 text-white/10 hover:text-primary hover:border-primary/20 hover:bg-primary/[0.02] transition-all group duration-500"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8" />
              </div>
              <span className="font-anton uppercase tracking-[0.4em] text-[10px]">Contratar Especialista</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
