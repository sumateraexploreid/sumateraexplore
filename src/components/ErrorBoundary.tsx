"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="se-page min-h-dvh flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-paper-2 border border-rule rounded-card p-8 text-center">
            <AdminIcon name="error" className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="font-display text-xl text-ink mb-2">Terjadi Kesalahan</h1>
            <p className="text-sm text-ink-2 mb-6">
              Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba muat ulang atau kembali ke beranda.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="se-btn se-btn--primary"
              >
                Muat Ulang Halaman
              </button>
              <Link href="/" className="se-btn se-btn--quiet">
                Kembali ke Beranda
              </Link>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left text-xs text-muted">
                <summary>Detail Error (Development)</summary>
                <pre className="mt-2 p-3 bg-paper rounded overflow-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}