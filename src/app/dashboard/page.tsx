
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc } from "firebase/firestore";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShieldAlert, CreditCard, Calendar, User, Scissors } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const clientRef = user ? doc(db, "clients", user.uid) : null;
  const { data: profile, isLoading: isProfileLoading } = useDoc(clientRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-[#D4AF37] font-anton text-2xl animate-pulse">
        CARREGANDO CLOUD SYNC...
      </div>
    );
  }

  if (!profile) return null;

  const isActive = profile.subscriptionStatus === "ativa";

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter">
              OLÁ, <span className="text-[#D4AF37]">{profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Painel do Assinante Premium</p>
          </div>
          <Badge className={cn(
            "h-10 px-6 rounded-full font-anton text-xs uppercase tracking-widest",
            isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
          )}>
            Status: {profile.subscriptionStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Aviso de Bloqueio */}
        {!isActive && (
          <Card className="bg-destructive/5 border-destructive/20 p-6 rounded-[2rem] flex items-center gap-6 animate-pulse">
            <div className="bg-destructive/10 p-4 rounded-full">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-white font-anton uppercase text-lg">Assinatura Inativa</h3>
              <p className="text-white/60 text-xs uppercase tracking-widest">Regularize seu plano para liberar agendamentos e benefícios.</p>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Info Assinatura */}
          <Card className="bg-[#0A0A0A] border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="font-anton text-white text-xl uppercase flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" /> Seu Plano
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Plano Atual</span>
                <span className="font-anton text-white uppercase">{profile.planType ? `Gold ${profile.plan}` : (profile.plan ? `Básico ${profile.plan}` : "Nenhum")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">Vencimento</span>
                <span className="font-anton text-white uppercase">
                  {profile.expiresAt ? format(new Date(profile.expiresAt), "dd 'DE' MMM, yyyy", { locale: ptBR }) : "---"}
                </span>
              </div>
            </div>

            <Link href="/#planos">
              <Button className="w-full bg-[#D4AF37] text-black font-anton uppercase h-14 mt-4 rounded-2xl hover:bg-white transition-all">
                {isActive ? "TROCAR PLANO" : "ASSINAR AGORA"}
              </Button>
            </Link>
          </Card>

          {/* Atalhos Rápidos */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn(
              "bg-[#0A0A0A] border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all",
              isActive ? "opacity-100 hover:border-[#D4AF37]/40 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}>
              <div className="bg-white/5 p-4 rounded-full">
                <Scissors className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-[9px] font-anton text-white uppercase tracking-widest">Novo Corte</span>
            </Card>
            
            <Card className={cn(
              "bg-[#0A0A0A] border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all",
              isActive ? "opacity-100 hover:border-[#D4AF37]/40 cursor-pointer" : "opacity-30 cursor-not-allowed"
            )}>
              <div className="bg-white/5 p-4 rounded-full">
                <Calendar className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-[9px] font-anton text-white uppercase tracking-widest">Minha Agenda</span>
            </Card>

            <Card className="bg-[#0A0A0A] border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 col-span-2">
              <div className="bg-white/5 p-4 rounded-full">
                <User className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div className="text-center">
                <span className="block text-[9px] font-anton text-white uppercase tracking-widest">Perfil</span>
                <span className="text-[8px] text-white/40 uppercase tracking-widest">{profile.cpf}</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
