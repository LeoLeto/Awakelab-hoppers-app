"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ConsentModalProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function ConsentModal({ open, onAccept, onCancel }: ConsentModalProps) {
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);

  const canAccept = c1 && c3;

  function handleAccept() {
    if (!canAccept) return;
    onAccept();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Consentimiento RGPD</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-5">
          Para generar tu informe de empleabilidad SAP personalizado, necesitamos tu consentimiento
          para procesar los datos que nos has proporcionado.
        </p>
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={c1}
              onCheckedChange={(v) => setC1(!!v)}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="font-semibold">* Tratamiento de datos (requerido)</span>
              <br />
              <span className="text-gray-500">
                Acepto que Hoppers Academy procese los datos proporcionados para generar mi informe
                personalizado de empleabilidad SAP, de acuerdo con su politica de privacidad.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={c2}
              onCheckedChange={(v) => setC2(!!v)}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="font-semibold">Comunicaciones (opcional)</span>
              <br />
              <span className="text-gray-500">
                Acepto recibir comunicaciones comerciales sobre formaciones, webinars y oportunidades
                laborales SAP de Hoppers Academy.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              checked={c3}
              onCheckedChange={(v) => setC3(!!v)}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="font-semibold">* Comparticion de datos (requerido)</span>
              <br />
              <span className="text-gray-500">
                Acepto que mis datos puedan ser compartidos con empresas partners de Hoppers Academy
                que puedan estar interesadas en mi perfil profesional SAP.
              </span>
            </span>
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * Los campos marcados con asterisco son obligatorios para generar el informe.
        </p>
        <div className="flex gap-3 mt-4 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button
            onClick={handleAccept}
            disabled={!canAccept}
            className="bg-hopper-red hover:bg-hopper-red/90 text-white disabled:opacity-40"
          >
            Aceptar y generar informe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
