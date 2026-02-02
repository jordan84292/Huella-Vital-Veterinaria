import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface interfaceReducer {
  isLoading: boolean;
  message: {
    view: boolean;
    type: string;
    text: string;
    desc: string;
  };
  // Nueva sección para auth
  auth: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    rol: string; // Rol numérico: 1=Admin, 2=Veterinario, 3=Recepcionista, 4=Asistente, 5=Cliente
    password?: string;
    status: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
  };
  users: Array<{
    id: string;
    nombre: string;
    email: string;
    rol: string;
    status: "Activo" | "Inactivo";
    telefono: string;
  }>;
  clients: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    cedula?: string;
    registrationdate: string;
    status: "Activo" | "Inactivo";
  }>;
  patients: Array<{
    id: string;
    name: string;
    species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro";
    breed: string;
    age: number;
    weight: number;
    gender: "Macho" | "Hembra";
    birthdate?: string;

    ownerName: string;
    ownerId: string;
    nextVisit?: string;
    lastVisit?: string;
    microchip?: string;
    color?: string;
    allergies?: string;
    status: "Activo" | "Inactivo";
    cedula?: string;
    created_date?: string;
    updated_date?: string;
  }>;
  visits: Array<{
    id: string;
    patientId: string;
    date: string;
    type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
    veterinarian: string;
    diagnosis: string;
    treatment: string;
    notes?: string;
    cost: number;
    created_date?: string;
    updated_date?: string;
  }>;
  vaccinations: Array<{
    id: string;
    patientId: string;
    date: string;
    vaccine: string;
    nextDue: string;
    veterinarian: string;
    batchNumber: string;
    notes?: string;
    created_date?: string;
    updated_date?: string;
  }>;
  appointments: Array<{
    id: string;
    patientId: string;
    date: string;
    time: string;
    patientName: string;
    ownerName: string;
    type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
    veterinarian: string;
    status: "Programada" | "Completada" | "Cancelada";
    notes?: string;
    created_date?: string;
    updated_date?: string;
  }>;
}

const initialState: interfaceReducer = {
  isLoading: false,
  message: {
    view: false,
    type: "",
    text: "",
    desc: "",
  },
  auth: {
    id: "",
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    rol: "",
    status: "",
    fecha_creacion: "2025-11-01",
    fecha_actualizacion: "2025-11-01",
  },
  users: [],
  clients: [],
  patients: [],
  visits: [],
  vaccinations: [],
  appointments: [],
};

export const interfaceReducer = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMessage: (
      state,
      action: PayloadAction<{
        view: boolean;
        type: string;
        text: string;
        desc: string;
      }>,
    ) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = {
        view: false,
        type: "",
        text: "",
        desc: "",
      };
    },
    // Nuevos reducers para autenticación
    setAuth: (state, action) => {
      state.auth = action.payload;
    },

    setUsers: (state, action: PayloadAction<interfaceReducer["users"]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<interfaceReducer["users"][0]>) => {
      state.users.push(action.payload);
    },
    updateUser: (
      state,
      action: PayloadAction<interfaceReducer["users"][0]>,
    ) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    setClients: (state, action: PayloadAction<interfaceReducer["clients"]>) => {
      state.clients = action.payload;
    },
    addClient: (
      state,
      action: PayloadAction<interfaceReducer["clients"][0]>,
    ) => {
      state.clients.push(action.payload);
    },
    updateClient: (
      state,
      action: PayloadAction<interfaceReducer["clients"][0]>,
    ) => {
      const index = state.clients.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter((c) => c.id !== action.payload);
    },
    setPatients: (
      state,
      action: PayloadAction<interfaceReducer["patients"]>,
    ) => {
      state.patients = action.payload;
    },
    addPatient: (
      state,
      action: PayloadAction<interfaceReducer["patients"][0]>,
    ) => {
      state.patients.push(action.payload);
    },
    updatePatient: (
      state,
      action: PayloadAction<interfaceReducer["patients"][0]>,
    ) => {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((p) => p.id !== action.payload);
    },
    setVisits: (state, action: PayloadAction<interfaceReducer["visits"]>) => {
      state.visits = action.payload;
    },
    addVisit: (state, action: PayloadAction<interfaceReducer["visits"][0]>) => {
      state.visits.push(action.payload);
    },
    updateVisit: (
      state,
      action: PayloadAction<interfaceReducer["visits"][0]>,
    ) => {
      const index = state.visits.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.visits[index] = action.payload;
      }
    },
    deleteVisit: (state, action: PayloadAction<string>) => {
      state.visits = state.visits.filter((v) => v.id !== action.payload);
    },
    setVaccinations: (
      state,
      action: PayloadAction<interfaceReducer["vaccinations"]>,
    ) => {
      state.vaccinations = action.payload;
    },
    addVaccination: (
      state,
      action: PayloadAction<interfaceReducer["vaccinations"][0]>,
    ) => {
      state.vaccinations.push(action.payload);
    },
    updateVaccination: (
      state,
      action: PayloadAction<interfaceReducer["vaccinations"][0]>,
    ) => {
      const index = state.vaccinations.findIndex(
        (v) => v.id === action.payload.id,
      );
      if (index !== -1) {
        state.vaccinations[index] = action.payload;
      }
    },
    deleteVaccination: (state, action: PayloadAction<string>) => {
      state.vaccinations = state.vaccinations.filter(
        (v) => v.id !== action.payload,
      );
    },
    setAppointments: (
      state,
      action: PayloadAction<interfaceReducer["appointments"]>,
    ) => {
      state.appointments = action.payload;
    },
    addAppointment: (
      state,
      action: PayloadAction<interfaceReducer["appointments"][0]>,
    ) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (
      state,
      action: PayloadAction<interfaceReducer["appointments"][0]>,
    ) => {
      const index = state.appointments.findIndex(
        (a) => a.id === action.payload.id,
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (a) => a.id !== action.payload,
      );
    },
  },
});

export const {
  setIsLoading,
  setMessage,
  clearMessage,
  setAuth,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setClients,
  addClient,
  updateClient,
  deleteClient,
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setVisits,
  addVisit,
  updateVisit,
  deleteVisit,
  setVaccinations,
  addVaccination,
  updateVaccination,
  deleteVaccination,
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = interfaceReducer.actions;

export default interfaceReducer.reducer;
