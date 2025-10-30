"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Vaccination = {
  id: string
  date: string
  vaccine: string
  nextDue: string
  veterinarian: string
  batchNumber: string
}

type VaccinationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (vaccination: Omit<Vaccination, "id">) => void
}

export function VaccinationDialog({ open, onOpenChange, onSave }: VaccinationDialogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    vaccine: "",
    nextDue: "",
    veterinarian: "",
    batchNumber: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      vaccine: "",
      nextDue: "",
      veterinarian: "",
      batchNumber: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nueva Vacunación</DialogTitle>
          <DialogDescription>Registra una nueva vacuna aplicada</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vaccine">Vacuna</Label>
              <Input
                id="vaccine"
                value={formData.vaccine}
                onChange={(e) => setFormData({ ...formData, vaccine: e.target.value })}
                placeholder="Polivalente (DHPP)"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha de Aplicación</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextDue">Próxima Dosis</Label>
                <Input
                  id="nextDue"
                  type="date"
                  value={formData.nextDue}
                  onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="veterinarian">Veterinario</Label>
              <Input
                id="veterinarian"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                placeholder="Dr. Carlos Rodriguez"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="batchNumber">Número de Lote</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="VAC2024-09-001"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Vacuna</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
