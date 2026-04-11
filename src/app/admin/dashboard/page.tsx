
"use client";

import { useEffect, useState } from "react";
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
  Home
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
import { MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLogged = localStorage.getItem("gold_admin_logged");
    if (!isLogged) {
      router.push("/admin/login");
      return;
    }

    const data = JSON.parse(localStorage.getItem('gold_appointments') || '[]');
    setAppointments(data);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("gold_admin_logged");
    router.push("/admin/login");
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    localStorage.setItem('gold_appointments', JSON.stringify(updated));
  };

  const getServiceName = (id: string) => MOCK_SERVICES.find(s => s.id === id)?.name || "N/A";
  const getProfName = (id: string) => MOCK_PROFESSIONALS.find(p => p.id === id)?.name || "N/A";

  const filteredAppointments = appointments.filter(a => 
    a.clientName.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <span className="font-headline text-xl font-black tracking-tighter">GOLD<span className="text-primary">ADMIN</span></span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
            <CalendarIcon className="h-4 w-4" /> Agendamentos
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-white/40 hover:text-white font-bold uppercase tracking-widest text-[10px]">
            <Users className="h-4 w-4" /> Profissionais
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-white/40 hover:text-white font-bold uppercase tracking-widest text-[10px]">
            <Settings className="h-4 w-4" /> Configurações
          </Button>
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start gap-3 text-white/40 hover:text-white font-bold uppercase tracking-widest text-[10px]">
                <Home className="h-4 w-4" /> Voltar ao Site
              </Button>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-[10px]">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-background">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Painel de <span className="text-primary">Agendamentos</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Gestão Gold em tempo real</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input 
                placeholder="BUSCAR CLIENTE..." 
                className="pl-10 bg-card border-white/10 w-full md:w-[300px] text-[10px] font-bold tracking-widest uppercase"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Total Hoje</span>
                <Clock className="text-primary h-4 w-4" />
              </div>
              <div className="text-4xl font-black">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Confirmados</span>
                <CheckCircle className="text-green-500 h-4 w-4" />
              </div>
              <div className="text-4xl font-black">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Receita Est.</span>
                <TrendingUp className="text-primary h-4 w-4" />
              </div>
              <div className="text-4xl font-black text-primary">R$ {appointments.reduce((acc, curr) => acc + (MOCK_SERVICES.find(s => s.id === curr.serviceId)?.price || 0), 0).toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card className="bg-card border-white/5 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-sm font-black uppercase tracking-[0.3em]">Lista de Reservas</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader className="bg-background/50">
              <TableRow className="border-white/5">
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40">Data/Hora</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40">Cliente</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40">WhatsApp</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40">Serviço</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40">Profissional</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-white/40 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                <TableRow key={apt.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-xs">{format(new Date(apt.date), "dd/MM/yyyy")}</span>
                      <span className="text-[10px] font-bold text-primary">{apt.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-sm uppercase tracking-tight">{apt.clientName}</TableCell>
                  <TableCell className="text-white/40 font-bold text-xs">{apt.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">{getServiceName(apt.serviceId)}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs uppercase text-white/60">{getProfName(apt.professionalId)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteAppointment(apt.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-white/10 font-black uppercase tracking-[0.3em] text-xs">
                    Nenhum agendamento
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
