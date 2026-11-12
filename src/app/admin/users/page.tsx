"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import {
  AdminPageHeader,
  ModalDialog,
  StatusPill,
  ToastBanner,
} from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface AdminUserRow {
  id: number;
  email: string;
  name: string;
  role: "super_admin" | "editor" | "cs_operator";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "cs_operator" as AdminUserRow["role"],
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await adminFetch<ListResult<AdminUserRow>>(
        "/api/admin/users?pageSize=50",
      );
      setUsers(res.items);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat daftar operator.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<ListResult<AdminUserRow>>("/api/admin/users?pageSize=50")
      .then((res) => {
        if (active) setUsers(res.items);
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat daftar operator.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setToast({ type: "success", message: `Operator ${form.email} ditambahkan.` });
      setModalOpen(false);
      setForm({ name: "", email: "", role: "cs_operator", password: "" });
      await loadUsers();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menambah operator.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u: AdminUserRow) {
    try {
      await adminFetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: u.id, is_active: !u.is_active }),
      });
      setToast({
        type: "success",
        message: `Status ${u.email} diubah menjadi ${!u.is_active ? "Aktif" : "Nonaktif"}.`,
      });
      await loadUsers();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal mengubah status.",
      });
    }
  }

  async function changeRole(u: AdminUserRow, nextRole: AdminUserRow["role"]) {
    try {
      await adminFetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: u.id, role: nextRole }),
      });
      setToast({
        type: "success",
        message: `Role ${u.email} diperbarui ke ${nextRole}.`,
      });
      await loadUsers();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memperbarui role.",
      });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Akun Operator & Hak Akses"
        subtitle="Kelola tim admin Sumatera Explore (Super Admin, Editor Konten, dan CS WhatsApp) beserta status akses & keamanan sesi."
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover"
          >
            <AdminIcon name="person_add" className="w-[18px] h-[18px]" />
            Tambah Operator
          </button>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {loading ? (
        <p className="text-sm text-muted py-8 text-center">Memuat akun...</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 rounded-card bg-paper-2 border border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusPill status={u.role} />
                  <StatusPill status={u.is_active ? "active" : "archived"} />
                </div>
                <p className="font-display text-base text-ink">{u.name}</p>
                <p className="text-xs text-muted">
                  {u.email} • Login terakhir:{" "}
                  {u.last_login_at
                    ? new Date(u.last_login_at).toLocaleString("id-ID")
                    : "Belum pernah"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  aria-label={`Role ${u.email}`}
                  value={u.role}
                  onChange={(e) =>
                    void changeRole(u, e.target.value as AdminUserRow["role"])
                  }
                  className="px-2.5 py-1.5 rounded-card bg-paper border border-rule text-xs text-ink"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="editor">Editor Konten</option>
                  <option value="cs_operator">CS WhatsApp</option>
                </select>

                <button
                  type="button"
                  onClick={() => void toggleActive(u)}
                  className="px-3 py-1.5 rounded-card border border-rule text-xs font-semibold text-ink hover:border-accent"
                >
                  {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalDialog
        open={modalOpen}
        title="Tambah Akun Operator Admin"
        subtitle="Buat akun login baru untuk admin konten atau tim CS WhatsApp."
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Admin CS Berastagi"
              className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Email Login
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Role Akses
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as AdminUserRow["role"] })
                }
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="cs_operator">CS WhatsApp (Order & Lead)</option>
                <option value="editor">Editor Konten (Paket, Blog, Galeri)</option>
                <option value="super_admin">Super Admin (Akses Penuh)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Password Minimal 8 Karakter
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-rule flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-card border border-rule text-sm text-ink-2"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-card bg-accent text-accent-ink text-sm font-bold hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Buat Akun Operator"}
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
