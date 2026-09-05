
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      toast({ title: "Erro de Acesso", description: "Email ou senha inválidos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20 relative overflow-hidden" suppressHydrationWarning>
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
            CLUB <span className="text-[#D4AF37]">GOLD</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2">Acesse sua experiência premium</p>
        </div>

        <Card className="w-full max-w-md bg-[#0A0A0A] border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pt-10">
            <CardDescription className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Autenticação de Membro</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">E-mail</Label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-6 text-base text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-[#D4AF37] transition-colors" 
                  placeholder="seu@email.com"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/60 ml-1">Senha</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-6 text-base text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-[#D4AF37] transition-colors" 
                    placeholder="••••••••"
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black hover:bg-white transition-all font-anton uppercase h-16 text-lg rounded-2xl">
                {loading ? "VALIDANDO..." : "ENTRAR AGORA"}
              </Button>
              <div className="text-center pt-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  Ainda não é membro? <Link href="/cadastro" className="text-[#D4AF37] hover:underline font-bold">Cadastre-se</Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
