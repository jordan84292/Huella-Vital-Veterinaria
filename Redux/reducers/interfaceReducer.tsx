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
  users: [
    {
      id: string;
      nombre: string;
      email: string;
      rolName: "Veterinario" | "Asistente" | "Recepcionista" | "Administrador";
      status: "Activo" | "Inactivo";
      telefono: string;
    }
  ];
  clients: [
    {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      registrationDate: string;
      status: "Activo" | "Inactivo";
    }
  ];
}

const initialState: interfaceReducer = {
  isLoading: false,
  message: {
    view: false,
    type: "",
    text: "",
    desc: "",
  },
  users: [
    {
      id: "",
      nombre: "",
      email: "",
      rolName: "Asistente",
      status: "Activo",
      telefono: "",
    },
  ],
  clients: [
    {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      registrationDate: "",
      status: "Activo",
    },
  ],
};

export const interfaceReducer = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsLoading, setMessage, setUsers, setClients } =
  interfaceReducer.actions;

export default interfaceReducer.reducer;
