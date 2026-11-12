"use client";

import React from "react";
import { AdminIcon } from "@/components/admin/AdminIcon";

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 pb-5 border-b border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-ink-2 mt-1">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </header>
  );
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  active: { label: "Aktif", cls: "bg-success/15 text-success border-success/30" },
  published: { label: "Terbit", cls: "bg-success/15 text-success border-success/30" },
  draft: { label: "Draf", cls: "bg-accent/15 text-accent border-accent/30" },
  archived: { label: "Arsip", cls: "bg-paper-3 text-muted border-rule" },
  pending_inquiry: {
    label: "Tanya / Lead Baru",
    cls: "bg-accent/15 text-accent border-accent/35",
  },
  waiting_dp: {
    label: "Menunggu DP",
    cls: "bg-accent/20 text-accent border-accent/50",
  },
  dp_paid: {
    label: "DP Lunas",
    cls: "bg-wa/20 text-success border-wa/50",
  },
  completed: {
    label: "Trip Selesai",
    cls: "bg-success/15 text-success border-success/35",
  },
  cancelled: {
    label: "Batal",
    cls: "bg-error/15 text-error border-error/35",
  },
  super_admin: {
    label: "Super Admin",
    cls: "bg-accent/20 text-accent border-accent/40",
  },
  editor: {
    label: "Editor Konten",
    cls: "bg-paper-3 text-ink-2 border-rule",
  },
  cs_operator: {
    label: "CS WhatsApp",
    cls: "bg-wa/15 text-success border-wa/35",
  },
};

export function StatusPill({ status }: { status: string }) {
  const meta = STATUS_STYLES[status] || {
    label: status,
    cls: "bg-paper-3 text-ink-2 border-rule",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${meta.cls}`}
    >
      {meta.label}
    </span>
  );
}

export function ToastBanner({
  toast,
  onClose,
}: {
  toast: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-5 px-4 py-3 rounded-card border flex items-center justify-between gap-3 text-sm ${
        isError
          ? "bg-error/15 border-error/40 text-ink"
          : "bg-wa/15 border-wa/40 text-ink"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <AdminIcon name={isError ? "error" : "check_circle"} className="w-[18px] h-[18px]" />
        <span>{toast.message}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="text-muted hover:text-ink p-1"
      >
        <AdminIcon name="close" className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ModalDialog({
  open,
  title,
  subtitle,
  onClose,
  maxWidth = "max-w-3xl",
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-forest-deep/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-full ${maxWidth} bg-paper border border-rule rounded-card shadow-card my-4 overflow-hidden`}
      >
        <div className="px-5 py-4 bg-paper-2 border-b border-rule flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl text-ink">{title}</h2>
            {subtitle ? <p className="text-xs text-muted mt-0.5">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="min-w-9 min-h-9 rounded-md border border-rule text-muted hover:text-ink hover:border-accent flex items-center justify-center transition-colors"
          >
            <AdminIcon name="close" className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div className="p-5 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

