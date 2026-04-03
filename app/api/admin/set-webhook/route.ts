import { NextResponse } from 'next/server';

export async function POST() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.APP_URL;
  const secretToken = process.env.TELEGRAM_SECRET_TOKEN;

  if (!botToken) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is not set' }, { status: 500 });
  }

  if (!appUrl) {
    return NextResponse.json({ error: 'APP_URL is not set' }, { status: 500 });
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secretToken,
        allowed_updates: ['message', 'pre_checkout_query', 'successful_payment'],
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({ success: true, description: data.description });
    } else {
      return NextResponse.json({ error: data.description }, { status: 400 });
    }
  } catch (error) {
    console.error('Error setting webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
