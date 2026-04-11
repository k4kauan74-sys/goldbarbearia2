"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from "next/link";
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

    setTimeout(() => {
      if (username === "admin@barber.com" && password === "admin123") {
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
      <div className="absolute top-8 left-8 z-20">
        <Link href="/">
          <Button variant="ghost" className="text-white/40 hover:text-white font-anton uppercase tracking-widest text-[10px] gap-2">
            <ChevronLeft className="h-4 w-4" /> VOLTAR AO INÍCIO
          </Button>
        </Link>
      </div>

      {/* Ambient Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-10 animate-float" />
      </div>

      <Card className="w-full max-w-md relative z-10 bg-transparent border-none shadow-none">
        <CardHeader className="text-center space-y-6">
          <div className="space-y-4">
            <CardTitle className="text-6xl font-anton text-white tracking-tighter uppercase">
              ADMIN <span className="text-primary">ACCESS</span>
            </CardTitle>
            <CardDescription className="text-primary/60 text-[10px] font-bold uppercase tracking-[0.4em]">Painel de Controle Editorial</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60">E-mail</Label>
              <div className="relative">
                <Input 
                  type="email"
                  className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-lg font-medium text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  placeholder="ADMIN@BARBER.COM"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60">Senha</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  className="bg-transparent border-white/10 border-b border-t-0 border-x-0 rounded-none py-8 text-lg font-medium text-white placeholder:text-white/10 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-black hover:bg-white font-anton uppercase tracking-[0.3em] py-12 text-xl transition-all duration-500"
              disabled={loading}
            >
              {loading ? "VERIFYING..." : "ENTER PANEL"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
