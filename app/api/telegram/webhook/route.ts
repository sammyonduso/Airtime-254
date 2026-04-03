import { NextResponse } from 'next/server';
import { sendAirtime } from '@/lib/instalipa';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PAYMENT_TOKEN = process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN;
const SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

async function sendTelegramRequest(method: string, body: any) {
  if (!BOT_TOKEN) return;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (error) {
    console.error(`Error in ${method}:`, error);
  }
}

export async function POST(req: Request) {
  // Verify secret token
  const receivedSecret = req.headers.get('x-telegram-bot-api-secret-token');
  if (SECRET_TOKEN && receivedSecret !== SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const update = await req.json();

    // Handle incoming messages
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || '';

      if (text.startsWith('/start')) {
        await sendTelegramRequest('sendMessage', {
          chat_id: chatId,
          text: 'Welcome to the Airtime Bot! 📱\n\nTo buy airtime, use the command:\n`/buy <amount> <phone_number>`\n\nExample: `/buy 100 254705340183` to buy KES 100 airtime.',
          parse_mode: 'Markdown',
        });
      } 
      else if (text.startsWith('/buy')) {
        const parts = text.split(' ');
        if (parts.length !== 3) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: 'Invalid format. Please use: `/buy <amount> <phone_number>`\nExample: `/buy 100 254705340183`',
            parse_mode: 'Markdown',
          });
          return NextResponse.json({ ok: true });
        }

        const amount = parseInt(parts[1], 10);
        const phoneNumber = parts[2];

        if (isNaN(amount) || amount <= 0) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: 'Invalid amount. Please enter a valid number.',
          });
          return NextResponse.json({ ok: true });
        }

        if (!PAYMENT_TOKEN) {
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: 'Payments are not configured yet. Please contact the administrator.',
          });
          return NextResponse.json({ ok: true });
        }

        // Send Invoice
        // Amount is in the smallest units of the currency (e.g., cents for USD)
        const amountInCents = amount * 100;
        
        await sendTelegramRequest('sendInvoice', {
          chat_id: chatId,
          title: `Airtime Top-up: KES ${amount}`,
          description: `Top up KES ${amount} for phone number ${phoneNumber}`,
          payload: JSON.stringify({ amount, phoneNumber }),
          provider_token: PAYMENT_TOKEN,
          currency: 'KES',
          prices: [{ label: 'Airtime', amount: amountInCents }],
          need_phone_number: false,
          need_email: false,
          need_shipping_address: false,
        });
      }
      
      // Handle successful payment message
      if (msg.successful_payment) {
        const payload = JSON.parse(msg.successful_payment.invoice_payload);
        const { amount, phoneNumber } = payload;
        
        console.log(`Processing top-up for ${phoneNumber} with amount ${amount}`);
        
        try {
          // Use the Telegram payment charge ID as a unique idempotency key
          const reference = msg.successful_payment.telegram_payment_charge_id || `order_${Date.now()}_${chatId}`;
          
          // Call the Instalipa API
          const result = await sendAirtime(phoneNumber, amount, reference);
          console.log('Instalipa Top-up Result:', result);
          
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `✅ Payment received! Successfully submitted top-up of ${amount} to ${phoneNumber}.\nTransaction ID: ${result.transaction_id || reference}\nThank you for using our service!`,
          });
        } catch (err) {
          console.error('Instalipa API Error:', err);
          await sendTelegramRequest('sendMessage', {
            chat_id: chatId,
            text: `⚠️ Payment received, but there was an issue processing the airtime top-up with the provider. Please contact support with your phone number: ${phoneNumber}.`,
          });
        }
      }
    }

    // Handle pre_checkout_query (required to complete payment)
    if (update.pre_checkout_query) {
      const queryId = update.pre_checkout_query.id;
      await sendTelegramRequest('answerPreCheckoutQuery', {
        pre_checkout_query_id: queryId,
        ok: true,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
