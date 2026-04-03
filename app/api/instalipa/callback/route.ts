import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received Instalipa Callback:', data);

    const { transaction_id, status, details, phone_number, amount, reference } = data;
    const db = getAdminDb();

    if (reference) {
      const txRef = db.collection('transactions').doc(reference);
      const txDoc = await txRef.get();
      
      if (txDoc.exists) {
        if (status === 'Success') {
          await txRef.update({ status: 'Success' });
        } else if (status === 'Failed') {
          await txRef.update({ status: 'Failed', error: details });
          
          // If it failed, we might want to reverse the commission, but for simplicity,
          // we'll leave it or handle it manually. In a production app, you'd reverse it.
        }
      }
    }

    // Instalipa expects a 200 OK with {"status": "ok"}
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Instalipa callback:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
