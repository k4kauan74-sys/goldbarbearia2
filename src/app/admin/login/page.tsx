
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Professional } from "@/lib/types";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Check for Admin
      if (username.toLowerCase() === "admin@barber.com" && password === "admin123") {
        const adminUser = {
          id: 'admin',
          name: 'Administrador',
          email: username,
          role: 'admin'
        };
        localStorage.setItem("gold_user", JSON.stringify(adminUser));
        router.push("/admin/dashboard");
        return;
      }

      // Check for Professionals
      const savedProfs: Professional[] = JSON.parse(localStorage.getItem('gold_professionals') || '[]');
      const prof = savedProfs.find(p => p.email?.toLowerCase() === username.toLowerCase() && (p.password || "123") === password);

      if (prof) {
        const barberUser = {
          id: prof.id,
          name: prof.name,
          email: username,
          role: 'barber'
        };
        localStorage.setItem("gold_user", JSON.stringify(barberUser));
        router.push("/admin/dashboard");
      } else {
        toast({ 
          title: "Erro de Autenticação", 
          description: "Usuário ou senha inválidos.", 
          variant: "destructive" 
        });
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-white/40 hover:text-white font-anton uppercase tracking-widest text-[10px] gap-2">
            <ChevronLeft className="h-4 w-4" /> VOLTAR AO INÍCIO
          </Button>
        </Link>
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37] rounded-full blur-[140px] opacity-10 animate-float" />
      </div>

      <div className="text-center mb-8 relative z-10">
        <h1 className="text-5xl md:text-6xl font-anton tracking-tighter uppercase leading-none flex flex-col items-center">
          <span className="text-[#D4AF37]">GOLD</span>
          <span className="text-[#F5F5F5]">ADMIN</span>
        </h1>
        <p className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Painel de Controle Gold</p>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center pt-10 pb-4">
          <CardDescription className="text-black/40 text-[9px] font-black uppercase tracking-[0.3em]">Autenticação de Segurança</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 ml-1">E-mail Corporativo</Label>
              <Input 
                type="email"
                className="bg-transparent border-black/10 border-b border-t-0 border-x-0 rounded-none py-6 text-base font-medium text-black placeholder:text-black/10 focus-visible:ring-0 focus-visible:border-primary transition-colors h-auto"
                placeholder="exemplo@goldbarber.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-black/60 ml-1">Senha de Acesso</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent border-black/10 border-b border-t-0 border-x-0 rounded-none py-6 text-base font-medium text-black placeholder:text-black/10 focus-visible:ring-0 focus-visible:border-primary transition-colors h-auto"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#D4AF37] text-black hover:bg-black hover:text-[#D4AF37] font-anton uppercase tracking-[0.2em] py-8 text-lg transition-all duration-300 rounded-2xl"
              disabled={loading}
            >
              {loading ? "VALIDANDO..." : "ENTRAR NO PAINEL"}
            </Button>
            <div className="text-center space-y-1">
              <p className="text-black/20 text-[8px] uppercase tracking-widest">Acesso restrito a colaboradores autorizados</p>
              <p className="text-black/30 text-[7px] uppercase tracking-widest font-bold">Padrão p/ Barbeiros: Email + senha "123"</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
