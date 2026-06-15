"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUsers, ADMIN_PASSWORD } from "@/lib/auth";
import type { HoppersUser } from "@/lib/auth";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<HoppersUser[]>([]);
  const [search, setSearch] = useState("");

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      setUsers(getUsers());
    } else {
      setError("Contraseña incorrecta.");
    }
  }

  function exportCSV() {
    const header = "ID,Nombre,Email,Pais,Experiencia,Rol,Diagnostico,Score\n";
    const rows = users
      .map((u) =>
        [u.id, u.name, u.email, u.country, u.yearsExperience, u.currentRole, u.diagnosticDone ? "Si" : "No", u.empScore ?? ""].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Hoppers_Usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.country || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!authed) {
    return (
      <main className="min-h-screen bg-hopper-black flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-8 text-center">
          <div className="w-10 h-10 bg-hopper-red rounded flex items-center justify-center text-white font-black text-lg mx-auto mb-4">
            H
          </div>
          <h1 className="text-xl font-black text-hopper-black mb-1">Panel de Administracion</h1>
          <p className="text-sm text-gray-500 mb-6">Hoppers Academy</p>
          <div className="space-y-3 text-left">
            <Label htmlFor="admin-pw">Contraseña de administrador</Label>
            <Input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Introduce la contraseña"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full bg-hopper-red hover:bg-hopper-red/90 text-white" onClick={handleLogin}>
              Acceder
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const totalDiag = users.filter((u) => u.diagnosticDone).length;
  const avgScore =
    users.filter((u) => u.empScore != null).length > 0
      ? Math.round(users.filter((u) => u.empScore != null).reduce((a, u) => a + (u.empScore ?? 0), 0) / users.filter((u) => u.empScore != null).length)
      : 0;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-hopper-black">Panel de Administracion</h1>
            <p className="text-sm text-gray-500">Hoppers Academy</p>
          </div>
          <Button variant="outline" onClick={() => setAuthed(false)}>Cerrar sesion</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Usuarios registrados", value: users.length },
            { label: "Diagnosticos realizados", value: totalDiag },
            { label: "Score medio", value: avgScore ? `${avgScore}%` : "—" },
            { label: "Tasa conversion", value: users.length > 0 ? `${Math.round((totalDiag / users.length) * 100)}%` : "—" },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <p className="text-3xl font-black text-hopper-red">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-hopper-black">Usuarios registrados</h2>
            <Button size="sm" variant="outline" onClick={exportCSV}>
              Exportar CSV
            </Button>
          </div>
          <Input
            placeholder="Buscar por nombre, email o pais..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="pb-2 pr-4">Nombre</th>
                  <th className="pb-2 pr-4">Email</th>
                  <th className="pb-2 pr-4">Pais</th>
                  <th className="pb-2 pr-4">Experiencia</th>
                  <th className="pb-2 pr-4">Diagnostico</th>
                  <th className="pb-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      {users.length === 0 ? "No hay usuarios registrados aun." : "No se encontraron resultados."}
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{u.name}</td>
                    <td className="py-2 pr-4 text-gray-500">{u.email}</td>
                    <td className="py-2 pr-4">{u.country || "—"}</td>
                    <td className="py-2 pr-4">{u.yearsExperience || "—"}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${u.diagnosticDone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.diagnosticDone ? "Realizado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="py-2 font-bold text-hopper-red">{u.empScore != null ? `${u.empScore}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
