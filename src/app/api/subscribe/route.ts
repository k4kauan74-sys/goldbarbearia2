import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// Configuração do Mercado Pago utilizando a variável de ambiente correta
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(req: NextRequest) {
  try {
    const { email, plan, period, planType, coupon } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const prices: any = {
      basico: { mensal: 119.9, trimestral: 89.9, semestral: 69.9 },
      gold: { mensal: 199.9, trimestral: 184.9, semestral: 144.87 }
    };

    const periodMonths: any = { mensal: 1, trimestral: 3, semestral: 6 };
    
    if (!prices[planType] || !prices[planType][period]) {
      return NextResponse.json({ error: "Plano ou período inválido" }, { status: 400 });
    }

    let amount = prices[planType][period];

    // Aplicação do desconto de 30% se o cupom for GOLD30 e o plano for semestral
    if (coupon === "GOLD30" && period === "semestral") {
      amount = Number((amount * 0.7).toFixed(2));
    }

    const preapproval = new PreApproval(client);
    
    // Configuração da assinatura recorrente
    const body = {
      back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
      reason: `Assinatura Club Gold - ${planType.toUpperCase()} ${period.toUpperCase()}`,
      auto_recurring: {
        frequency: periodMonths[period],
        frequency_type: "months",
        transaction_amount: amount,
        currency_id: "BRL"
      },
      payer_email: email,
      status: "pending",
      external_reference: `${email}_${planType}_${period}`
    };

    const response = await preapproval.create({ body });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error: any) {
    console.error("Erro MP:", error);
    return NextResponse.json({ 
      error: error.message || "Não foi possível criar a assinatura no Mercado Pago" 
    }, { status: 500 });
  }
}