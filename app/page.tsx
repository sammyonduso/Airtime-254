"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookManager } from "@/components/webhook-manager";
import { UsersTable } from "@/components/admin/users-table";
import { TransactionsTable } from "@/components/admin/transactions-table";
import { GroupsTable } from "@/components/admin/groups-table";
import { Bot, CreditCard, Smartphone, Zap, Users, List, Settings, Shield } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "transactions" | "groups">("dashboard");

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

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6 mt-4">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Settings className="w-5 h-5" />
            Configuration
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "users" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Users className="w-5 h-5" />
            Users & Bans
          </button>
          <button 
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "transactions" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <List className="w-5 h-5" />
            Transactions
          </button>
          <button 
            onClick={() => setActiveTab("groups")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "groups" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <Shield className="w-5 h-5" />
            Affiliate Groups
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8">
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Total Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">KES 0.00</div>
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
                        <li>Go to Telegram and search for <strong>@BotFather</strong>.</li>
                        <li>Send <code>/newbot</code> and follow the instructions.</li>
                        <li>Copy the HTTP API Token to <code>TELEGRAM_BOT_TOKEN</code>.</li>
                        <li>To enable payments, send <code>/mybots</code> to BotFather, select your bot, go to <strong>Payments</strong>, and connect a provider (e.g., Stripe Test).</li>
                        <li>Add the payment token as <code>TELEGRAM_PAYMENT_PROVIDER_TOKEN</code>.</li>
                        <li>Click the &quot;Set Webhook&quot; button above.</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
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
                        {process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/instalipa/callback` : 'https://your-app-url.com/api/instalipa/callback'}
                      </div>
                      <p className="text-xs text-gray-500">
                        This allows the system to know when a transaction finally succeeds or fails after being submitted.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View all users who have interacted with the bot and manage bans.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <UsersTable />
              </CardContent>
            </Card>
          )}

          {activeTab === "transactions" && (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View all airtime purchases and commission payouts.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TransactionsTable />
              </CardContent>
            </Card>
          )}

          {activeTab === "groups" && (
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Groups</CardTitle>
                <CardDescription>Manage groups where the bot is added and view commission balances.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <GroupsTable />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
