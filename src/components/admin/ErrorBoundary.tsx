"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AdminIcon } from "@/components/admin/AdminIcon";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("AdminErrorBoundary caught an error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 rounded-card bg-error/15 border border-error/40 text-ink text-center" role="alert">
          <AdminIcon name="error" className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm text-ink-2 mb-4">
            Sebagian dari halaman admin gagal dimuat. Tim teknis sudah ternotifikasi.
          </p>
          <details className="text-left text-[11px] text-muted max-h-40 overflow-auto p-3 bg-paper border border-rule rounded-md mb-4">
            <summary className="cursor-pointer font-semibold text-ink">Detail Error (klik untuk buka)</summary>
            <pre className="mt-2 whitespace-pre-wrap font-mono">{this.state.error?.message}</pre>
            <pre className="whitespace-pre-wrap font-mono">{this.state.error?.stack}</pre>
          </details>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover"
            >
              Coba Muat Ulang
            </button>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-md border border-rule text-sm font-semibold text-ink hover:border-accent text-center"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;