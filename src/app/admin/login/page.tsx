"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AdminIcon } from "@/components/admin/AdminIcon";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "Email atau password tidak valid.");
        return;
      }
      router.push(nextPath.startsWith("/admin") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("Gagal menghubungi server. Periksa koneksi Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-paper-2 border border-rule rounded-card p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-rule">
          <div className="w-11 h-11 rounded-md bg-accent text-accent-ink flex items-center justify-center shrink-0">
            <AdminIcon name="admin_panel_settings" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-xl text-ink">Sumatera Explore</h1>
            <p className="text-xs text-muted">
              Back-Office & CMS Terintegrasi (SUJAI TOBA SUMATERA)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <div
              role="alert"
              className="p-3 rounded-md bg-error/15 border border-error/40 text-xs text-ink flex items-center gap-2"
            >
              <AdminIcon name="error" className="w-4 h-4 text-error" />
              <span>{error}</span>
            </div>
          ) : null}

          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-ink-2 mb-1.5">
              Email Admin
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@sumateraexplore.my.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-paper border border-muted/60 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-ink-2 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPass ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Masukkan password admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-md bg-paper border border-muted/60 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-focus focus-visible:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1"
              >
                <AdminIcon name={showPass ? "visibility_off" : "visibility"} className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[44px] rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            <AdminIcon name="login" className="w-[18px] h-[18px]" />
            {submitting ? "Memverifikasi sesi…" : "Masuk ke Admin Panel"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between text-xs text-muted">
          <Link href="/" className="hover:text-accent transition-colors inline-flex items-center gap-1">
            <AdminIcon name="arrow_back" className="w-3.5 h-3.5" />
            Kembali ke Website
          </Link>
          <span>Proteksi HMAC Cookie & DB</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <LoginForm />
    </Suspense>
  );
}

