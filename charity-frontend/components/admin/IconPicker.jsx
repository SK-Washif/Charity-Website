"use client";

import { useState } from "react";
import { ICON_NAMES, getIcon } from "@/lib/iconMap";


export default function IconPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);

  return (
    <div>
      <label className="label-caps mb-1 block">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-sm border border-line bg-paper px-3 py-2 text-left font-body text-sm text-ink outline-none transition-colors hover:border-stamp"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kraft text-stamp">
          <SelectedIcon size={14} />
        </span>
        <span className="flex-1 truncate">{value || "আইকন বেছে নিন"}</span>
        <span className="text-ink-muted text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-2 grid max-h-56 grid-cols-6 gap-2 overflow-y-auto rounded-sm border border-line bg-paper p-3 sm:grid-cols-8">
          {ICON_NAMES.map((name) => {
            const Icon = getIcon(name);
            const active = name === value;
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
                  active
                    ? "border-marigold bg-marigold/20 text-ink"
                    : "border-line text-ink-muted hover:border-stamp hover:text-ink"
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
