
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Garante que o Firebase Admin seja inicializado apenas uma vez
if (!getApps().length) {
  try {
    initializeApp();
  } catch (error) {
    // Em ambiente de build ou se as credenciais estiverem faltando, 
    // evitamos que o erro quebre o deploy.
  }
}

const db = getFirestore();

// CHAVES VAPID vindas do ambiente
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

// Só configuramos o web-push se as chaves existirem e forem válidas
// Isso evita o erro "Vapid public key should be 65 bytes long" durante o build
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(
      'mailto:contato@goldbarbearia.com.br',
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );
  } catch (error) {
    console.error('Erro ao configurar VAPID details:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Serviço de notificações não configurado (VAPID keys faltando)' }, { status: 503 });
    }

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
