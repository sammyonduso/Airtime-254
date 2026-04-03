import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookManager } from "@/components/webhook-manager";
import { Bot, CreditCard, Smartphone, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">AirtimeBot Admin</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
              <p className="text-xs text-gray-500 mt-1">Mock data for preview</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Mock data for preview</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Successful Top-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Mock data for preview</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bot Configuration</CardTitle>
                <CardDescription>
                  Set up your Telegram bot webhook to start receiving messages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WebhookManager />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <ol className="list-decimal list-inside space-y-3">
                  <li>
                    Go to Telegram and search for <strong>@BotFather</strong>.
                  </li>
                  <li>
                    Send <code>/newbot</code> and follow the instructions to create a bot.
                  </li>
                  <li>
                    Copy the HTTP API Token provided by BotFather.
                  </li>
                  <li>
                    Add the token to your environment variables as <code>TELEGRAM_BOT_TOKEN</code>.
                  </li>
                  <li>
                    To enable payments, send <code>/mybots</code> to BotFather, select your bot, go to <strong>Payments</strong>, and connect a provider (e.g., Stripe Test).
                  </li>
                  <li>
                    Add the payment token as <code>TELEGRAM_PAYMENT_PROVIDER_TOKEN</code>.
                  </li>
                  <li>
                    Click the &quot;Set Webhook&quot; button above to connect your bot to this application.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instalipa Callback Setup</CardTitle>
                <CardDescription>
                  Configure this in your Instalipa Airtime Portal to receive final transaction status updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <ol className="list-decimal list-inside space-y-3">
                  <li>Log in to your Instalipa Airtime Portal.</li>
                  <li>Navigate to <strong>API &rarr; Callback URL</strong>.</li>
                  <li>Enter the following URL:</li>
                </ol>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-xs break-all border border-gray-200">
                  {process.env.APP_URL ? `${process.env.APP_URL}/api/instalipa/callback` : 'https://your-app-url.com/api/instalipa/callback'}
                </div>
                <p className="text-xs text-gray-500">
                  This allows the system to know when a transaction finally succeeds or fails after being submitted.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest airtime purchases from your users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                  <Bot className="w-12 h-12 text-gray-300 mb-3" />
                  <h3 className="text-sm font-medium text-gray-900">No transactions yet</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                    When users buy airtime through your bot, they will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
