"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Patient = {
  id: string
  name: string
  species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro"
  breed: string
  age: number
  weight: number
  gender: "Macho" | "Hembra"
  ownerName: string
  ownerId: string
  microchip: string
  status: "Activo" | "Inactivo"
  lastVisit: string
}

type PatientDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  onSave: (patient: Omit<Patient, "id">) => void
}

export function PatientDialog({ open, onOpenChange, patient, onSave }: PatientDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "Perro" as Patient["species"],
    breed: "",
    age: 0,
    weight: 0,
    gender: "Macho" as Patient["gender"],
    ownerName: "",
    ownerId: "",
    microchip: "",
    status: "Activo" as Patient["status"],
    lastVisit: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        age: patient.age,
        weight: patient.weight,
        gender: patient.gender,
        ownerName: patient.ownerName,
        ownerId: patient.ownerId,
        microchip: patient.microchip,
        status: patient.status,
        lastVisit: patient.lastVisit,
      })
    } else {
      setFormData({
        name: "",
        species: "Perro",
        breed: "",
        age: 0,
        weight: 0,
        gender: "Macho",
        ownerName: "",
        ownerId: "",
        microchip: "",
        status: "Activo",
        lastVisit: new Date().toISOString().split("T")[0],
      })
    }
  }, [patient, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{patient ? "Editar Paciente" : "Nuevo Paciente"}</DialogTitle>
          <DialogDescription>
            {patient ? "Actualiza la información del paciente" : "Completa los datos para registrar un nuevo paciente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Max"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="species">Especie</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => setFormData({ ...formData, species: value as Patient["species"] })}
                >
                  <SelectTrigger id="species">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Perro">Perro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Conejo">Conejo</SelectItem>
                    <SelectItem value="Ave">Ave</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Golden Retriever"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Sexo</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as Patient["gender"] })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Macho">Macho</SelectItem>
                    <SelectItem value="Hembra">Hembra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Edad (años)</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="microchip">Microchip</Label>
              <Input
                id="microchip"
                value={formData.microchip}
                onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                placeholder="982000123456789"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Propietario</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="María González"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerId">ID Propietario</Label>
                <Input
                  id="ownerId"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  placeholder="1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lastVisit">Última Visita</Label>
                <Input
                  id="lastVisit"
                  type="date"
                  value={formData.lastVisit}
                  onChange={(e) => setFormData({ ...formData, lastVisit: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Patient["status"] })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{patient ? "Guardar Cambios" : "Registrar Paciente"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
