
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, CreditCard, Tag, Sparkles, Percent, TrendingDown, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

type PlanType = 'basico' | 'gold';
type PeriodType = 'semestral';

const PRICES = {
  basico: {
    semestral: 69.90
  },
  gold: {
    semestral: 145.00
  }
};

const INDIVIDUAL_COMPARISON = {
  basico: {
    value: 180.00,
    description: "4 CORTES AVULSOS"
  },
  gold: {
    value: 360.00,
    description: "4 COMBOS COMPLETOS AVULSOS"
  }
};

const PERIOD_MONTHS = {
  semestral: 6
};

// Links de Pagamento Diretos Externos
const DIRECT_LINKS = {
  basico: {
    semestral: "https://invoice.infinitepay.io/plans/thasha_magulas/ANaUkabAIM"
  },
  gold: {
    semestral: "https://invoice.infinitepay.io/plans/gold-barbearia-7/3Kvy4qCYn"
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basico');
  const [selectedPeriod] = useState<PeriodType>('semestral');
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan') as PlanType;
    if (plan && (plan === 'basico' || plan === 'gold')) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const monthlyPrice = PRICES[selectedPlan][selectedPeriod];
  const baseTotalPrice = monthlyPrice * PERIOD_MONTHS[selectedPeriod];
  
  const hasDiscount = appliedCoupon === "GOLD30" && selectedPeriod === "semestral";
  const discountAmount = hasDiscount ? baseTotalPrice * 0.3 : 0;
  const totalPrice = baseTotalPrice - discountAmount;

  const individualMonthly = INDIVIDUAL_COMPARISON[selectedPlan].value;
  const effectiveMonthlyPrice = (totalPrice / PERIOD_MONTHS[selectedPeriod]);
  const monthlySavings = individualMonthly - effectiveMonthlyPrice;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === "GOLD30") {
      setAppliedCoupon(code);
      toast({
        title: "Cupom Aplicado!",
        description: "30% de desconto aplicado com sucesso.",
      });
    } else {
      toast({
        title: "Cupom Inválido",
        description: "O código inserido não existe ou expirou.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Atenção",
        description: "Você precisa estar logado para assinar um plano.",
        variant: "destructive",
      });
      router.push("/login?redirect=/checkout");
      return;
    }

    setIsProcessing(true);

    const whatsappBase = "https://wa.me/554892465639";
    const planName = selectedPlan === 'basico' ? 'Básico' : 'Gold';
    const message = `Olá! Gostaria de assinar o Plano ${planName} (Semestral). Meu email é ${user.email}.`;
    const whatsappLink = `${whatsappBase}?text=${encodeURIComponent(message)}`;

    const link = DIRECT_LINKS[selectedPlan][selectedPeriod];

    if (appliedCoupon) {
      window.open(whatsappLink, '_blank');
      setIsProcessing(false);
      return;
    }

    window.open(link, '_blank');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col pt-32 pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <Link href="/#planos">
            <Button variant="ghost" className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] p-0 h-auto gap-2">
              <ChevronLeft className="w-4 h-4" /> Voltar aos planos
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-anton text-white uppercase tracking-tighter mb-2">
                SEU <span className="text-primary">PLANO</span>
              </h1>
              <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                Assine e garanta seu visual impecável
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-1 glass rounded-3xl border-white/5">
              <button
                onClick={() => setSelectedPlan('basico')}
                className={cn(
                  "py-4 rounded-2xl font-anton text-sm uppercase tracking-widest transition-all",
                  selectedPlan === 'basico' ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/60"
                )}
              >
                Plano Básico
              </button>
              <button
                onClick={() => setSelectedPlan('gold')}
                className={cn(
                  "py-4 rounded-2xl font-anton text-sm uppercase tracking-widest transition-all",
                  selectedPlan === 'gold' ? "bg-primary text-black shadow-xl" : "text-white/40 hover:text-white/60"
                )}
              >
                Plano Gold
              </button>
            </div>

            <Card className="relative overflow-hidden bg-white/[0.02] border-white/5 p-8 rounded-[2.5rem] group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-16 h-16 text-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-white text-lg font-anton uppercase tracking-tight leading-tight mb-2">
                  PLANO SEMESTRAL SELECIONADO
                </p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  Melhor custo-benefício garantido para sua rotina de cuidados.
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <Card className="glass border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-primary/5">
              <h2 className="text-3xl font-anton text-white uppercase tracking-tighter mb-8">
                RESUMO DO <span className="text-shimmer">PEDIDO</span>
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-start border-b border-white/5 pb-6">
                  <div>
                    <p className="font-anton text-xl text-white uppercase tracking-widest">
                      {selectedPlan === 'basico' ? 'Plano Básico' : 'Plano Gold'}
                    </p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em] mt-1">
                      Período: Semestral (6 meses)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-anton text-lg text-primary">R$ {monthlyPrice.toFixed(2)}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest">por mês</p>
                  </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-anton text-primary uppercase tracking-widest">
                    <TrendingDown className="w-4 h-4" /> Por que assinar?
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-white/40">
                      <span>Custo Avulso Mensal</span>
                      <span className="line-through">R$ {individualMonthly.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-emerald-500 font-bold">
                      <span>Sua Economia Mensal</span>
                      <span>- R$ {monthlySavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-primary font-anton pt-1">
                      <span className="opacity-50 text-white/60">Pague somente</span>
                      <span>R$ {effectiveMonthlyPrice.toFixed(2)} / mês</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {hasDiscount && (
                    <div className="flex justify-between text-[11px] text-emerald-500 uppercase font-bold tracking-[0.2em]">
                      <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Desconto (GOLD30)</span>
                      <span>- R$ {(discountAmount / PERIOD_MONTHS[selectedPeriod]).toFixed(2)}/mês</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <Label className="text-[9px] uppercase tracking-[0.2em] font-black text-white/40 ml-1">Cupom de Desconto</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="CÓDIGO"
                        className="h-12 bg-white/[0.02] border-white/10 rounded-xl font-anton uppercase tracking-widest text-xs focus-visible:ring-primary/20"
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        className="h-12 px-6 bg-white/5 hover:bg-white/10 text-white font-anton uppercase text-[10px] tracking-widest border border-white/10"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      <span className="font-anton text-[10px] text-emerald-500 uppercase tracking-widest">{appliedCoupon} Aplicado</span>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-[9px] text-white/40 hover:text-white uppercase font-black tracking-widest"
                    >
                      Remover
                    </button>
                  </div>
                )}

                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full h-20 bg-primary text-black hover:bg-white hover:text-black transition-all rounded-full font-anton text-xl uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(212,175,55,0.2)] group"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    <>
                      {appliedCoupon ? (
                        <>Finalizar no WhatsApp <MessageCircle className="ml-2 w-5 h-5 group-hover:scale-125 transition-transform" /></>
                      ) : (
                        <>Assinar Agora <Sparkles className="ml-2 w-5 h-5 group-hover:scale-125 transition-transform" /></>
                      )}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-[9px] text-white/20 uppercase font-bold tracking-widest">
                  <CreditCard className="w-3 h-3" /> Pagamento 100% Seguro
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030303] flex items-center justify-center text-white font-anton uppercase tracking-widest">Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
