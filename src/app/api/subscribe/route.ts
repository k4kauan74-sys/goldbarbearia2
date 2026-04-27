
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(req: NextRequest) {
  try {
    const { email, plan, period, planType } = await req.json();

    const prices: any = {
      basico: { mensal: 119.9, trimestral: 89.9, semestral: 69.9 },
      gold: { mensal: 200.0, trimestral: 185.0, semestral: 144.87 }
    };

    const periodMonths: any = { mensal: 1, trimestral: 3, semestral: 6 };
    const amount = prices[planType][period];

    const preapproval = new PreApproval(client);
    const body = {
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      reason: `Assinatura Club Gold - ${planType.toUpperCase()} ${period.toUpperCase()}`,
      auto_recurring: {
        frequency: periodMonths[period],
        frequency_type: "months",
        transaction_amount: amount,
        currency_id: "BRL"
      },
      payer_email: email,
      status: "pending"
    };

    const response = await preapproval.create({ body });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
