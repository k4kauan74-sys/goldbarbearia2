
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || 'APP_USR-2221276034207684-042717-ec1dc710f61e0ce62de9933e069ef4cb-784803379' 
});

export async function POST(req: NextRequest) {
  try {
    const { email, planType, coupon } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Apenas planos semestrais agora
    const prices: any = {
      basico: 69.9,
      gold: 145.0
    };

    if (!prices[planType]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    let amount = prices[planType];

    // Aplicação do desconto de 30% se o cupom for GOLD30
    if (coupon === "GOLD30") {
      amount = Number((amount * 0.7).toFixed(2));
    }

    const preapproval = new PreApproval(client);
    
    // Configuração da assinatura recorrente semestral
    const body = {
      back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
      reason: `Assinatura Club Gold - ${planType.toUpperCase()} SEMESTRAL`,
      auto_recurring: {
        frequency: 6,
        frequency_type: "months",
        transaction_amount: amount,
        currency_id: "BRL"
      },
      payer_email: email,
      status: "pending",
      external_reference: `${email}_${planType}_semestral`
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
