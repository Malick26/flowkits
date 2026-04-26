"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string; description?: string };

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  name,
  required,
}: {
  value?: string;
  onChange?: (next: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        name={name}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "focus-ring h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 pr-9 text-sm text-white shadow-inner shadow-black/20 transition hover:border-white/15",
        )}
      >
        <option value="" disabled className="bg-zinc-900 text-white">
          {placeholder ?? "Choisir..."}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900 text-white">
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
        ▾
      </div>
    </div>
  );
}

