// usuarios y Roles
export type Role = 'admin' | 'operador' | 'usuario';

export interface User {
  id: string;
  email: string;
  role: Role;
}

// recurso principal: libro (Dominio Biblioteca)
export type LibroStatus = 'DISPONIBLE' | 'PRESTADO' | 'EN_REPARACION';

export interface Libro {
  id: string;
  titulo: string;
  descripcion: string;
  estado: LibroStatus;
  createdAt: string;
  updatedAt: string;
}

// suscripciones
export interface Subscription {
  id: string;
  userId: string;
  libroId: string; // referencia al libro al que el usuario se suscribio
}

// notificaciones
export interface Notification {
  id: string;
  userId: string;
  bookId?: string;
  bookTitle?: string; // viene del libro asociado (populate en el backend)
  message: string;
  isRead: boolean;
  createdAt: string;
}

// autenticacion 
export interface AuthResponse {
  token: string;
  user: User;
}