
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({ title: "Erro", description: "Email ou senha inválidos.", variant: "destructive" });
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
            <CardTitle className="text-3xl font-anton text-white uppercase tracking-tighter">LOGIN</CardTitle>
            <CardDescription className="text-white/40 uppercase tracking-widest text-[10px]">Acesse sua conta Club Gold</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border-white/10 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-white/60">Senha</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-transparent border-white/10 text-white" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black font-anton uppercase h-14 text-lg">
                {loading ? "ENTRANDO..." : "ENTRAR"}
              </Button>
              <p className="text-center text-[10px] text-white/40 uppercase tracking-widest">
                Não tem conta? <Link href="/cadastro" className="text-[#D4AF37] hover:underline">Cadastre-se</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
