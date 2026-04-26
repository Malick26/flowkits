"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const STATUSES = [
  { value: "new", label: "Attente" },
  { value: "done", label: "Traité" },
  { value: "cancelled", label: "Annulé" },
];

export function OrderStatusEditor({
  orderId,
  initialStatus,
  compact = false,
}: {
  orderId: string;
  initialStatus: string;
  compact?: boolean;
}) {
  const [status, setStatus] = React.useState(initialStatus);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[180px]">
      {!compact && <p className="text-sm font-medium text-white/70">Changer statut</p>}
      <div className="flex gap-2">
        <Select
          value={status}
          onChange={(v) => {
            setStatus(v);
            setOk(false);
          }}
          options={STATUSES}
          className="flex-1"
        />
        <Button
          variant="secondary"
          disabled={loading}
          onClick={async () => {
            setError(null);
            setOk(false);
            setLoading(true);
            try {
              const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ status }),
              });
              const json = (await res.json()) as { error?: string };
              if (!res.ok) throw new Error(json.error || "Erreur");
              setOk(true);
            } catch (e: unknown) {
              setError(e instanceof Error ? e.message : "Erreur inconnue.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "..." : "OK"}
        </Button>
      </div>
      {ok ? <p className="text-xs text-emerald-200/80">Mis à jour.</p> : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

