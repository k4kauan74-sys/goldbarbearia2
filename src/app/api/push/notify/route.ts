
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// CHAVES VAPID (Para produção, use variáveis de ambiente)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BFLc0T5pWz2R_7r8F3u7H3YpYfD8W-Nq3_k_R_z_w_L_z_E_Y_z_R_L_W_z_w_L_z_E_Y_z_R_L_W';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'C5yR_L_W_z_w_L_z_E_Y_z_R_L_W_z_w_L_z_E_Y';

webpush.setVapidDetails(
  'mailto:contato@goldbarbearia.com.br',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();

    const snapshot = await db.collection('push_subscriptions').get();
    const notifications = snapshot.docs.map(doc => {
      const { subscription } = doc.data();
      return webpush.sendNotification(subscription, JSON.stringify({ title, body }))
        .catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Inscrição expirada ou inválida, remover do banco
            return doc.ref.delete();
          }
          console.error('Erro ao enviar push:', err);
        });
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro na rota de notify:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
