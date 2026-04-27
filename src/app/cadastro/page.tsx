
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
import { validateCPF, formatCPF } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
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
        email,
        cpf,
        plan: null,
        planType: null,
        subscriptionStatus: "inativa",
        createdAt: new Date().toISOString(),
        expiresAt: null
      });

      toast({ title: "Sucesso!", description: "Conta criada com sucesso." });
      router.push("/dashboard");
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32">
      <Navbar />
      <main className="container mx-auto px-4 flex justify-center">
        <Card className="w-full max-w-md bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2rem]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-anton text-white uppercase tracking-tighter">CADASTRO</CardTitle>
            <CardDescription className="text-white/40 uppercase tracking-widest text-[10px]">Crie sua conta Club Gold</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCadastro} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">Nome Completo</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-transparent border-white/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border-white/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">CPF</Label>
                <Input value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} className="bg-transparent border-white/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">Senha</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent border-white/10 text-white" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-14 text-lg">
                {loading ? "CRIANDO..." : "CRIAR CONTA"}
              </Button>
              <p className="text-center text-[10px] text-white/40 uppercase tracking-widest">
                Já tem conta? <Link href="/login" className="text-[#D4AF37] hover:underline">Faça login</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  const cadastrar = async () => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.senha
    );

    await setDoc(doc(db, "clientes", userCred.user.uid), {
      uid: userCred.user.uid,
      nome: form.nome,
      email: form.email,
      cpf: form.cpf,
      plano: null,
      status_assinatura: "inativa",
      data_criacao: new Date(),
    });

    alert("Conta criada!");
  };

  return (
    <div>
      <input placeholder="Nome" onChange={e => setForm({...form, nome: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="CPF" onChange={e => setForm({...form, cpf: e.target.value})} />
      <input type="password" placeholder="Senha" onChange={e => setForm({...form, senha: e.target.value})} />

      <button onClick={cadastrar}>Cadastrar</button>
    </div>
  );
}