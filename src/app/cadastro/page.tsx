
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCPF } from "@/lib/cpf-utils";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cpf.length < 14) {
      toast({ title: "Erro", description: "CPF incompleto.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "clients", user.uid), {
        uid: user.uid,
        name,
        email: email.toLowerCase(),
        cpf,
        plan: null,
        planType: null,
        subscriptionStatus: "inativa",
        createdAt: new Date().toISOString(),
        expiresAt: null
      });

      toast({ title: "Bem-vindo ao Clube!", description: "Sua conta foi criada. Escolha seu plano agora." });
      router.push("/#planos");
    } catch (error: any) {
      toast({ title: "Erro no Cadastro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20 relative overflow-hidden">
      <Navbar />

      <div className="absolute top-32 left-8 z-20 hidden md:block">
        <Link href="/">
          <Button variant="ghost" className="text-[#F5F5F5]/40 hover:text-[#F5F5F5] font-anton uppercase tracking-widest text-[10px] gap-2">
            <ChevronLeft className="h-4 w-4" /> VOLTAR AO INÍCIO
          </Button>
        </Link>
      </div>

      <main className="container mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-anton text-white uppercase tracking-tighter">
            FAÇA PARTE DO <span className="text-shimmer">TIME</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Crie sua identidade Gold Sync</p>
        </div>

        <Card className="w-full max-w-md bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10">
            <CardDescription className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Registro de Novo Membro</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleCadastro} className="space-y-6">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">Nome Completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-5 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">E-mail</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-5 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">CPF</Label>
                <Input value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-5 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">Senha</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-5 text-sm text-white focus-visible:ring-0 focus-visible:border-[#D4AF37]" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black hover:bg-white transition-all font-anton uppercase h-16 text-lg rounded-2xl mt-4">
                {loading ? "CRIANDO CONTA..." : "CONCLUIR CADASTRO"}
              </Button>
              <div className="text-center pt-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  Já é um de nós? <Link href="/login" className="text-[#D4AF37] hover:underline font-bold">Faça login</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
