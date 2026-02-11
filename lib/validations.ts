/**
 * Utilidades de Validación para Frontend
 * @description Validaciones consistentes con el backend para todos los formularios
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================
// VALIDACIONES DE USUARIOS
// ============================================

export const validateUser = (data: {
  nombre: string;
  email: string;
  telefono: string;
  password?: string;
  rolName?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validar nombre
  if (!data.nombre?.trim()) {
    errors.nombre = "El nombre es requerido";
  } else if (data.nombre.trim().length < 2 || data.nombre.trim().length > 100) {
    errors.nombre = "El nombre debe tener entre 2 y 100 caracteres";
  } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(data.nombre.trim())) {
    errors.nombre = "El nombre solo puede contener letras y espacios";
  }

  // Validar email
  if (!data.email?.trim()) {
    errors.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Debe ser un email válido";
  } else if (data.email.length > 255) {
    errors.email = "El email no puede exceder 255 caracteres";
  }

  // Validar teléfono
  if (!data.telefono?.trim()) {
    errors.telefono = "El teléfono es requerido";
  } else if (!/^[\+]?[0-9\-\(\)\s]{7,20}$/.test(data.telefono.trim())) {
    errors.telefono = "Formato de teléfono inválido";
  } else if (
    data.telefono.trim().length < 7 ||
    data.telefono.trim().length > 20
  ) {
    errors.telefono = "El teléfono debe tener entre 7 y 20 caracteres";
  }

  // Validar contraseña si se proporciona
  if (data.password !== undefined && data.password !== "") {
    if (data.password.length < 8 || data.password.length > 128) {
      errors.password = "La contraseña debe tener entre 8 y 128 caracteres";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        data.password,
      )
    ) {
      errors.password =
        "La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial";
    }
  }

  // Validar rol
  if (
    data.rolName &&
    !["Administrador", "Veterinario", "Recepcionista", "Asistente"].includes(
      data.rolName,
    )
  ) {
    errors.rolName = "Rol no válido";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// VALIDACIONES DE CLIENTES
// ============================================

export const validateClient = (data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cedula?: string;
  status?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validar nombre
  if (!data.name?.trim()) {
    errors.name = "El nombre es requerido";
  } else if (data.name.trim().length < 2 || data.name.trim().length > 150) {
    errors.name = "El nombre debe tener entre 2 y 150 caracteres";
  } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(data.name.trim())) {
    errors.name = "El nombre solo puede contener letras y espacios";
  }

  // Validar email
  if (!data.email?.trim()) {
    errors.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Debe ser un email válido";
  } else if (data.email.length > 255) {
    errors.email = "El email no puede exceder 255 caracteres";
  }

  // Validar teléfono
  if (!data.phone?.trim()) {
    errors.phone = "El teléfono es requerido";
  } else if (!/^\+506\s?\d{8}$/.test(data.phone.trim())) {
    errors.phone = "El teléfono debe comenzar con +506 seguido de 8 dígitos";
  }

  // Validar cédula
  if (!data.cedula?.trim()) {
    errors.cedula = "La cédula es requerida";
  } else if (/^\d{9}$/.test(data.cedula.trim())) {
    errors.cedula = "La cédula debe contener  9 dígitos numéricos";
  }

  // Validar dirección
  if (!data.address?.trim()) {
    errors.address = "La dirección es requerida";
  } else if (
    data.address.trim().length < 5 ||
    data.address.trim().length > 255
  ) {
    errors.address = "La dirección debe tener entre 5 y 255 caracteres";
  }

  // Validar ciudad
  if (!data.city?.trim()) {
    errors.city = "La ciudad es requerida";
  } else if (data.city.trim().length < 2 || data.city.trim().length > 100) {
    errors.city = "La ciudad debe tener entre 2 y 100 caracteres";
  } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(data.city.trim())) {
    errors.city = "La ciudad solo puede contener letras y espacios";
  }

  // Validar estado
  if (data.status && !["Activo", "Inactivo"].includes(data.status)) {
    errors.status = "El estado debe ser 'Activo' o 'Inactivo'";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// VALIDACIONES DE PACIENTES
// ============================================

export const validatePatient = (data: {
  name: string;
  species: string;
  breed: string;
  age: number | string;
  weight: number | string;
  gender: string;
  cedula: string;
  color?: string;
  allergies?: string;
  birthdate?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validar nombre
  if (!data.name?.trim()) {
    errors.name = "El nombre es requerido";
  } else if (data.name.trim().length < 2 || data.name.trim().length > 100) {
    errors.name = "El nombre debe tener entre 2 y 100 caracteres";
  }

  // Validar especie
  if (!data.species?.trim()) {
    errors.species = "La especie es requerida";
  } else if (
    data.species.trim().length < 2 ||
    data.species.trim().length > 50
  ) {
    errors.species = "La especie debe tener entre 2 y 50 caracteres";
  } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(data.species.trim())) {
    errors.species = "La especie solo puede contener letras y espacios";
  }

  // Validar raza
  if (!data.breed?.trim()) {
    errors.breed = "La raza es requerida";
  } else if (data.breed.trim().length < 2 || data.breed.trim().length > 100) {
    errors.breed = "La raza debe tener entre 2 y 100 caracteres";
  }

  // Validar edad
  const age = typeof data.age === "string" ? parseFloat(data.age) : data.age;
  if (!data.age && data.age !== 0) {
    errors.age = "La edad es requerida";
  } else if (isNaN(age) || age < 0 || age > 50) {
    errors.age = "La edad debe ser un número entre 0 y 50";
  }

  // Validar peso
  const weight =
    typeof data.weight === "string" ? parseFloat(data.weight) : data.weight;
  if (!data.weight && data.weight !== 0) {
    errors.weight = "El peso es requerido";
  } else if (isNaN(weight) || weight < 0 || weight > 1000) {
    errors.weight = "El peso debe ser un número entre 0 y 1000";
  }

  // Validar género
  if (!data.gender) {
    errors.gender = "El género es requerido";
  } else if (!["Macho", "Hembra", "Desconocido"].includes(data.gender)) {
    errors.gender = "El género debe ser 'Macho', 'Hembra' o 'Desconocido'";
  }

  // Validar cédula del cliente
  if (!data.cedula?.trim()) {
    errors.cedula = "La cédula del cliente es requerida";
  } else if (!/^\d+$/.test(data.cedula.trim()) || data.cedula.length < 6) {
    errors.cedula = "La cédula debe ser un número válido de al menos 6 dígitos";
  }

  // Validar fecha de nacimiento si se proporciona
  if (data.birthdate) {
    const birthDate = new Date(data.birthdate);
    if (isNaN(birthDate.getTime())) {
      errors.birthdate = "La fecha de nacimiento debe ser una fecha válida";
    } else if (birthDate > new Date()) {
      errors.birthdate = "La fecha de nacimiento no puede ser futura";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// VALIDACIONES DE CITAS
// ============================================

export const validateAppointment = (data: {
  patientId: string;
  date: string;
  time: string;
  type: string;
  veterinarian: string;
  notes?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validar ID del paciente
  if (!data.patientId) {
    errors.patientId = "El paciente es requerido";
  }

  // Validar fecha
  if (!data.date) {
    errors.date = "La fecha es requerida";
  } else {
    const appointmentDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(appointmentDate.getTime())) {
      errors.date = "La fecha debe ser válida";
    } else if (appointmentDate < today) {
      errors.date = "La fecha no puede ser anterior a hoy";
    }
  }

  // Validar hora
  if (!data.time) {
    errors.time = "La hora es requerida";
  } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
    errors.time = "La hora debe tener un formato válido (HH:MM)";
  }

  // Validar tipo
  if (!data.type) {
    errors.type = "El tipo de cita es requerido";
  } else if (
    !["Consulta", "Vacunación", "Cirugía", "Control", "Emergencia"].includes(
      data.type,
    )
  ) {
    errors.type = "Tipo de cita no válido";
  }

  // Validar veterinario
  if (!data.veterinarian?.trim()) {
    errors.veterinarian = "El veterinario es requerido";
  } else if (
    data.veterinarian.trim().length < 2 ||
    data.veterinarian.trim().length > 100
  ) {
    errors.veterinarian =
      "El nombre del veterinario debe tener entre 2 y 100 caracteres";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// VALIDACIONES DE VACUNAS
// ============================================

export const validateVaccination = (data: {
  patientId: string;
  vaccine: string;
  date: string;
  nextDue: string;
  batchNumber: string;
  veterinarian: string;
  notes?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validar ID del paciente
  if (!data.patientId) {
    errors.patientId = "El paciente es requerido";
  }

  // Validar vacuna
  if (!data.vaccine?.trim()) {
    errors.vaccine = "El nombre de la vacuna es requerido";
  } else if (
    data.vaccine.trim().length < 2 ||
    data.vaccine.trim().length > 100
  ) {
    errors.vaccine =
      "El nombre de la vacuna debe tener entre 2 y 100 caracteres";
  }

  // Validar fecha de aplicación
  if (!data.date) {
    errors.date = "La fecha de aplicación es requerida";
  } else {
    const vaccinationDate = new Date(data.date);
    const today = new Date();

    if (isNaN(vaccinationDate.getTime())) {
      errors.date = "La fecha de aplicación debe ser válida";
    } else if (vaccinationDate > today) {
      errors.date = "La fecha de aplicación no puede ser futura";
    }
  }

  // Validar fecha próxima dosis
  if (!data.nextDue) {
    errors.nextDue = "La fecha de la próxima dosis es requerida";
  } else {
    const nextDueDate = new Date(data.nextDue);

    if (isNaN(nextDueDate.getTime())) {
      errors.nextDue = "La fecha de la próxima dosis debe ser válida";
    } else if (data.date && nextDueDate <= new Date(data.date)) {
      errors.nextDue =
        "La fecha de la próxima dosis debe ser posterior a la fecha de aplicación";
    }
  }

  // Validar número de lote
  if (!data.batchNumber?.trim()) {
    errors.batchNumber = "El número de lote es requerido";
  } else if (
    data.batchNumber.trim().length < 2 ||
    data.batchNumber.trim().length > 50
  ) {
    errors.batchNumber = "El número de lote debe tener entre 2 y 50 caracteres";
  }

  // Validar veterinario
  if (!data.veterinarian?.trim()) {
    errors.veterinarian = "El veterinario es requerido";
  } else if (
    data.veterinarian.trim().length < 2 ||
    data.veterinarian.trim().length > 100
  ) {
    errors.veterinarian =
      "El nombre del veterinario debe tener entre 2 y 100 caracteres";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================
// UTILIDADES GENERALES
// ============================================

export const formatValidationErrors = (
  errors: Record<string, string>,
): string => {
  return Object.values(errors).join(", ");
};

export const hasValidationErrors = (
  errors: Record<string, string>,
): boolean => {
  return Object.keys(errors).length > 0;
};
