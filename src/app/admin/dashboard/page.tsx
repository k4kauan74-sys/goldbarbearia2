
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedUser = localStorage.getItem("gold_user");
    if (!loggedUser) {
      router.push("/admin/login");
      return;
    }
    setAdminSession(JSON.parse(loggedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("gold_user");
    router.push("/admin/login");
  };

  if (!adminSession) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-[#F5F5F5] font-body flex flex-col">
      <header className="h-16 border-b border-white/5 bg-[#0a0a0a] px-8 flex items-center justify-between">
        <div className="font-anton text-xl tracking-tighter uppercase">
          <span className="text-[#D4AF37]">GOLD</span> ADMIN
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 uppercase font-anton tracking-widest text-[10px]"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-anton uppercase tracking-tighter">Painel de Controle</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Área administrativa limpa e redefinida</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-[#0a0a0a] border-white/5 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 group hover:border-[#D4AF37]/20 transition-all cursor-pointer">
            <div className="bg-white/5 p-4 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors">
              <LayoutDashboard className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-anton text-lg uppercase">Visão Geral</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Métricas essenciais do sistema</p>
            </div>
          </Card>

          <Card className="bg-[#0a0a0a] border-white/5 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 group hover:border-[#D4AF37]/20 transition-all cursor-pointer">
            <div className="bg-white/5 p-4 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors">
              <Settings className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-anton text-lg uppercase">Configurações</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Ajustes básicos da plataforma</p>
            </div>
          </Card>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 text-center">
          <p className="text-white/20 font-anton text-xl uppercase tracking-widest">Conteúdo Removido</p>
          <p className="text-white/10 text-[9px] uppercase tracking-[0.4em] mt-2">Aguardando novas definições de gerenciamento</p>
        </div>
      </main>
    </div>
  );
}
