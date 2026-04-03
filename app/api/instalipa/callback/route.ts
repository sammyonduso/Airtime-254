import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received Instalipa Callback:', data);

    const { transaction_id, status, details, phone_number, amount, reference } = data;

    // Here you would typically update your database with the final status
    // For example:
    // if (status === 'Success') {
    //   await db.transactions.update({ where: { id: reference }, data: { status: 'COMPLETED' } });
    // } else if (status === 'Failed') {
    //   await db.transactions.update({ where: { id: reference }, data: { status: 'FAILED', error: details } });
    // }

    // Instalipa expects a 200 OK with {"status": "ok"}
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Instalipa callback:', error);
    // Return 200 so Instalipa doesn't keep retrying unnecessarily if it's a bad payload,
    // or return 500 if you want them to retry. The docs say "If your server fails to respond with 200 OK, Instalipa will retry".
    // We'll return 500 to allow retries on actual server errors.
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
