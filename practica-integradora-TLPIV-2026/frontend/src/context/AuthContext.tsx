import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, Role } from '../types'

// definimos que datos y funciones va a exponer y compartir nuestro contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

// contexto con un valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// definicion de los permisos por rol (basado en la tabla de la actividad integradora)
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    'libro:read', 'libro:create', 'libro:update', 'libro:change-status', 'libro:delete',
    'subscription:create', 'subscription:delete', 'notification:read',
    'user:read', 'user:assign-role'
  ],
  operador: [
    'libro:read', 'libro:create', 'libro:update', 'libro:change-status',
    'subscription:create', 'subscription:delete', 'notification:read'
  ],
  usuario: [
    'libro:read', 'subscription:create', 'subscription:delete', 'notification:read'
  ]
};

// creamos el proveedor del contexto 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jwt_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      if (storedToken) {
        try {
          const storedUser = localStorage.getItem('user_data');
          if (storedUser) {
            setUser(JSON.parse(storedUser) as User);
          }
        } catch (error) {
          console.error('Sesión inválida o expirada', error)
          logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // iniciar sesión (guarda token y usuario en estado y localStorage)
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  //  cerrar sesión (limpia todo)
  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  };

  // auxiliar para validar si el usuario logueado tiene un permiso especifico
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// consuimimos el contexto facilmente en cualquier componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}