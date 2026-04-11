
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

    // Simulated login
    setTimeout(() => {
      if (username === "admin" && password === "gold123") {
        localStorage.setItem("gold_admin_logged", "true");
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Card className="w-full max-w-md relative z-10 bg-card border-white/5 shadow-2xl">
        <CardHeader className="text-center space-y-6">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              Acesso <span className="text-primary">Admin</span>
            </CardTitle>
            <CardDescription className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Painel de Controle Gold</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  className="pl-10 bg-background/50 border-white/5 py-6 text-xs font-bold uppercase tracking-widest"
                  placeholder="DIGITE SEU USUÁRIO"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 bg-background/50 border-white/5 py-6 text-xs font-bold uppercase tracking-widest"
                  placeholder="DIGITE SUA SENHA"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-[0.3em] py-8 text-xs shadow-xl shadow-primary/10"
              disabled={loading}
            >
              {loading ? "VERIFICANDO..." : "ENTRAR NO PAINEL"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
