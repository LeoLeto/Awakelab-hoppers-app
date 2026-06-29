"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, RefreshCw, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ADMIN_PASSWORD, ADMIN_EMAIL, getSession } from "@/lib/auth";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  country: string;
  currentRole: string;
  diagnosticDone: boolean;
  empScore?: number;
  createdAt: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s?.email === ADMIN_EMAIL) {
      setAuthed(true);
      fetchUsers(ADMIN_PASSWORD);
    }
  }, []);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password !== ADMIN_PASSWORD) {
      setAuthError("Contraseña incorrecta.");
      return;
    }
    setAuthed(true);
    setAuthError("");
    await fetchUsers(password);
  }

  async function fetchUsers(pw = password) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users ?? []);
      else showToast(data.error ?? "Error al cargar usuarios.", false);
    } catch {
      showToast("Error de conexión.", false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(email: string) {
    setDeleting(email);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.email !== email));
        showToast(`Usuario ${email} eliminado.`, true);
      } else {
        showToast(data.error ?? "Error al eliminar.", false);
      }
    } catch {
      showToast("Error de conexión.", false);
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-8 space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black text-hopper-black">Panel de administración</h1>
            <p className="text-sm text-gray-400">Acceso restringido</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña de administrador"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <Button type="submit" className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white">
              <LogIn className="w-4 h-4 mr-2" /> Entrar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-5">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-hopper-black">Usuarios registrados</h1>
          <p className="text-sm text-gray-400">{users.length} usuario{users.length !== 1 ? "s" : ""} en total</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchUsers()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-hopper-red/20 border-t-hopper-red rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {search ? "No hay resultados para esa búsqueda." : "No hay usuarios registrados."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Nombre</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">País</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Diagnóstico</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500">Registro</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-hopper-black">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{user.country || "—"}</td>
                    <td className="px-4 py-3">
                      {user.diagnosticDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">
                          {user.empScore != null ? `${user.empScore}%` : "Hecho"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Pendiente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {confirmDelete === user.email ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-red-600 font-medium">¿Confirmar?</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 h-7"
                            onClick={() => setConfirmDelete(null)}
                          >
                            No
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 h-7"
                            onClick={() => handleDelete(user.email)}
                            disabled={deleting === user.email}
                          >
                            {deleting === user.email ? "..." : "Sí, eliminar"}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-2 h-7"
                          onClick={() => setConfirmDelete(user.email)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
