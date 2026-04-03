const BASE_URL = 'https://business.instalipa.co.ke';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Generates and caches the Instalipa Access Token
 */
export async function getInstalipaToken(): Promise<string> {
  // Return cached token if it's still valid (with a 60-second safety margin)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const key = process.env.INSTALIPA_CONSUMER_KEY;
  const secret = process.env.INSTALIPA_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error("Instalipa credentials (INSTALIPA_CONSUMER_KEY or INSTALIPA_CONSUMER_SECRET) are missing.");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(`${BASE_URL}/api/v1/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get Instalipa token: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  // expires_in is in seconds. Convert to milliseconds and subtract 60s for safety.
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken as string;
}

/**
 * Sends airtime via Instalipa API
 */
export async function sendAirtime(phoneNumber: string, amount: number, reference: string) {
  const token = await getInstalipaToken();

  const res = await fetch(`${BASE_URL}/api/v1/airtime`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': reference
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      amount: amount.toString(), // API expects a string
      reference: reference
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Instalipa Airtime API failed: ${res.status} - ${errorText}`);
  }

  return await res.json();
}
