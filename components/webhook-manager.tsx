"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function WebhookManager() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSetWebhook = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/set-webhook", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage("Webhook successfully set!");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to set webhook");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Webhook Status</label>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSetWebhook} 
            disabled={status === "loading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Set / Update Webhook
          </Button>
        </div>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="h-4 w-4" />
          <p>{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
