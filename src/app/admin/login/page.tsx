
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="grid grid-cols-6 h-full gap-4 p-4">
          {Array.from({length: 24}).map((_, i) => (
             <Scissors key={i} className="text-white/20 h-full w-full" />
          ))}
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-card border-white/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary w-16 h-16 rounded-sm flex items-center justify-center rotate-45 mb-4 shadow-lg shadow-primary/20">
            <Lock className="text-primary-foreground -rotate-45 h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">
            Área do <span className="text-primary">Admin</span>
          </CardTitle>
          <CardDescription className="text-white/40">Insira suas credenciais para gerenciar a barbearia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-white/60">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  className="pl-10 bg-background/50 border-white/10"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-white/60">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  type="password"
                  className="pl-10 bg-background/50 border-white/10"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest py-6"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar no Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
