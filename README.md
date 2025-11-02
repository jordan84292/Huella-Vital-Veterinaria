# 🐾 Huella Vital - Sistema de Gestión Veterinaria

Sistema integral de gestión veterinaria desarrollado con Next.js, diseñado para facilitar la administración de clínicas veterinarias, control de pacientes, citas, historiales médicos y más.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Principales](#-módulos-principales)
- [API](#-api)
- [Contribuir](#-contribuir)

## ✨ Características

### Gestión de Usuarios

- Sistema de autenticación con login/registro
- Roles de usuario: Administrador, Veterinario, Asistente, Recepcionista
- Perfiles personalizables con información profesional
- Gestión de estados (Activo/Inactivo)

### Gestión de Clientes

- Registro completo de propietarios de mascotas
- Búsqueda avanzada y filtros
- Historial de contacto y ubicación
- Estados de clientes activos/inactivos

### Gestión de Pacientes

- Registro detallado de mascotas (perros, gatos, conejos, aves, otros)
- Información médica: edad, peso, alergias, microchip
- Historial médico completo con línea de tiempo
- Seguimiento de visitas y vacunaciones
- Estadísticas por especie

### Sistema de Citas

- Programación de citas con tipos: Consulta, Vacunación, Cirugía, Control, Emergencia
- Vista de calendario con citas del día
- Gestión de estados: Programada, Completada, Cancelada
- Filtros avanzados por tipo, estado y búsqueda
- Estadísticas en tiempo real

### Historial Médico

- Registro de visitas con diagnóstico y tratamiento
- Control de vacunaciones con fechas de próximas dosis
- Línea de tiempo integrada de eventos médicos
- Costos de servicios
- Notas y observaciones del veterinario

### Dashboard

- Vista general del sistema con estadísticas
- Resumen de usuarios, clientes, pacientes y citas
- Próximas citas del día
- Indicadores clave de rendimiento

## 🛠 Tecnologías

### Frontend

- **Next.js 14+** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño responsivo
- **Shadcn/ui** - Componentes de UI
- **Redux Toolkit** - Gestión de estado global
- **Lucide React** - Iconos

### Backend

- **Node.js** - Entorno de ejecución
- **Express** - Framework de servidor (inferido)
- **Axios** - Cliente HTTP para comunicación con API

## 📦 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Base de datos configurada (según tu backend)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jordan84292/Huella-Vital-Veterinaria.git
cd Huella-Vital-Veterinaria
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## ⚙️ Configuración

### Configuración de Axios

El archivo `axiosApi.ts` maneja las peticiones HTTP. Asegúrate de configurar la URL base correctamente:

```typescript
// app/axiosApi/axiosApi.ts
export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Configuración de Redux

El store de Redux se encuentra en `Redux/store.ts` y maneja:

- Estado de autenticación
- Datos de usuarios, clientes y pacientes
- Citas, visitas y vacunaciones
- Estados de UI (loading, mensajes)

## 📖 Uso del Sistema

### 1. Acceso al Sistema

**Página de Login/Registro** (`/`)

- Accede con tus credenciales
- Regístrate si eres nuevo usuario
- Interfaz con animaciones y diseño responsivo

### 2. Dashboard (`/dashboard`)

Al iniciar sesión, verás:

- Estadísticas generales del sistema
- Total de usuarios, clientes y pacientes
- Citas programadas para hoy
- Acceso rápido a próximas citas

### 3. Gestión de Usuarios (`/usuarios`)

**Funcionalidades:**

- Crear nuevos usuarios del sistema
- Editar información y roles
- Filtrar por rol y estado
- Buscar por nombre, email o teléfono
- Protección: no puedes eliminar tu propia cuenta

**Roles disponibles:**

- Administrador
- Veterinario
- Asistente
- Recepcionista

### 4. Gestión de Clientes (`/clientes`)

**Funcionalidades:**

- Registrar nuevos propietarios
- Editar información de contacto
- Buscar por múltiples criterios
- Ver listado completo con estados

**Información registrada:**

- Datos personales (nombre, email, teléfono)
- Dirección y ciudad
- Fecha de registro
- Estado (Activo/Inactivo)

### 5. Gestión de Pacientes (`/pacientes`)

**Funcionalidades:**

- Registrar nuevas mascotas
- Editar información médica
- Filtros por especie y estado
- Acceso al historial médico completo

**Información de pacientes:**

- Datos básicos: nombre, especie, raza, edad, peso
- Información adicional: microchip, color, género
- Alergias y condiciones especiales
- Última visita y próxima cita
- Relación con propietario

**Estadísticas:**

- Total de pacientes
- Desglose por especie (perros, gatos, otros)

### 6. Historial del Paciente (`/pacientes/[id]`)

**Vista detallada con tres pestañas:**

**a) Línea de Tiempo**

- Vista cronológica de todos los eventos médicos
- Visitas y vacunaciones integradas
- Información completa de cada evento

**b) Historial de Visitas**

- Registro completo de consultas
- Detalles: diagnóstico, tratamiento, notas
- Costo de cada servicio
- Expandir para ver información detallada

**c) Vacunaciones**

- Registro de vacunas aplicadas
- Próxima fecha de aplicación
- Veterinario responsable
- Número de lote

**Agregar nuevos registros:**

- Botón "Nueva Visita" en pestaña de visitas
- Botón "Nueva Vacuna" en pestaña de vacunaciones

### 7. Sistema de Citas (`/citas`)

**Funcionalidades:**

- Crear nuevas citas
- Editar citas existentes
- Cancelar o completar citas
- Filtros avanzados

**Tipos de citas:**

- Consulta
- Vacunación
- Cirugía
- Control
- Emergencia

**Estados:**

- Programada
- Completada
- Cancelada

**Estadísticas:**

- Total de citas registradas
- Citas programadas pendientes
- Citas completadas
- Citas para hoy

### 8. Perfil de Usuario (`/perfil`)

**Visualización de:**

- Foto de perfil (avatar)
- Información personal
- Datos de contacto
- Información profesional
- Rol y especialización
- Fecha de ingreso

### 9. Configuración (`/configuracion`)

**Editar tu perfil:**

- Información personal (nombre, email, teléfono)
- Cambiar contraseña
- Rol y estado
- Ver fechas de creación y actualización

**Importante:** Para cambiar la contraseña, debes ingresar tu contraseña actual.

## 📁 Estructura del Proyecto

```
Huella-Vital-Veterinaria/
├── app/
│   ├── (routes)/
│   │   ├── citas/
│   │   │   └── page.tsx           # Gestión de citas
│   │   ├── clientes/
│   │   │   └── page.tsx           # Gestión de clientes
│   │   ├── configuracion/
│   │   │   └── page.tsx           # Configuración de usuario
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard principal
│   │   ├── pacientes/
│   │   │   ├── page.tsx           # Lista de pacientes
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Detalle del paciente
│   │   ├── perfil/
│   │   │   └── page.tsx           # Perfil de usuario
│   │   └── usuarios/
│   │       └── page.tsx           # Gestión de usuarios
│   ├── axiosApi/
│   │   └── axiosApi.ts            # Configuración de Axios
│   ├── page.tsx                   # Página de login/registro
│   └── layout.tsx                 # Layout principal
├── components/
│   ├── ui/                        # Componentes de Shadcn/ui
│   ├── dashboard-header.tsx       # Header del dashboard
│   ├── dashboard-sidebar.tsx      # Sidebar de navegación
│   ├── LoginForm.tsx              # Formulario de login
│   ├── RegisterForm.tsx           # Formulario de registro
│   ├── appointment-dialog.tsx     # Diálogo de citas
│   ├── client-dialog.tsx          # Diálogo de clientes
│   ├── patient-dialog.tsx         # Diálogo de pacientes
│   ├── user-dialog.tsx            # Diálogo de usuarios
│   ├── visit-dialog.tsx           # Diálogo de visitas
│   └── vaccination-dialog.tsx     # Diálogo de vacunaciones
├── Redux/
│   ├── store.ts                   # Configuración del store
│   └── reducers/
│       └── interfaceReducer.ts    # Reducer principal
├── lib/
│   └── auth/
│       └── cookies.ts             # Manejo de cookies de auth
└── public/
    ├── dog.png                    # Imagen para login
    └── cat.png                    # Imagen para registro
```

## 🔧 Módulos Principales

### Autenticación

- Login con email y contraseña
- Registro de nuevos usuarios
- Manejo de tokens con cookies
- Renovación automática de tokens
- Protección de rutas

### Sistema de Filtros

- Búsqueda en tiempo real
- Filtros múltiples (tipo, estado, especie, etc.)
- Contador de resultados
- Botón para limpiar filtros
- Persistencia de filtros durante la sesión

### Gestión de Estado

- Redux Toolkit para estado global
- Estados locales para formularios
- Sincronización con API
- Manejo de loading y mensajes

### Diálogos y Formularios

- Componentes reutilizables
- Validación de datos
- Modo crear/editar
- Mensajes de confirmación

## 🔌 API

### Endpoints principales

**Autenticación**

```
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
GET    /auth/profile
PUT    /auth/profile
```

**Usuarios**

```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
GET    /users/stats
```

**Clientes**

```
GET    /clients
GET    /clients/:id
POST   /clients
PUT    /clients/:id
DELETE /clients/:id
GET    /clients/stats
```

**Pacientes**

```
GET    /patients
GET    /patients/:id
POST   /patients
PUT    /patients/:id
DELETE /patients/:id
GET    /patients/stats
```

**Citas**

```
GET    /appointments
GET    /appointments/:id
GET    /appointments/date/:date
POST   /appointments
PUT    /appointments/:id
DELETE /appointments/:id
```

**Visitas**

```
GET    /visits/patient/:patientId
POST   /visits
PUT    /visits/:id
DELETE /visits/:id
```

**Vacunaciones**

```
GET    /vaccinations/patient/:patientId
POST   /vaccinations
PUT    /vaccinations/:id
DELETE /vaccinations/:id
```

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas Importantes

- El sistema está optimizado para dispositivos móviles y desktop
- Se recomienda usar navegadores modernos (Chrome, Firefox, Edge, Safari)
- Los datos de ejemplo deben ser reemplazados con datos reales en producción
- Asegúrate de configurar correctamente las variables de entorno
- Mantén actualizado el backend para compatibilidad con el frontend

## 🔐 Seguridad

- Las contraseñas se manejan de forma segura en el backend
- Los tokens de autenticación tienen expiración
- Se implementa protección contra acciones no permitidas (ejemplo: no puedes eliminar tu propia cuenta)
- Las cookies se manejan de forma segura
