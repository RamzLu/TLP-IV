# Biblioteca API - Práctica Integradora TLP IV

Este proyecto es el backend para un sistema de gestión de una Biblioteca, desarrollado siguiendo una arquitectura en capas estricta, principios SOLID y diversos patrones de diseño.

##  Tecnologías Utilizadas

- **Entorno:** Node.js
- **Framework:** Express.js
- **Lenguaje:** TypeScript (Strict Mode)
- **Base de Datos:** MongoDB
- **ODM:** Mongoose
- **Infraestructura:** Docker y Docker Compose

##  Cómo levantar el proyecto

El proyecto está dockerizado para facilitar su ejecución sin necesidad de instalar dependencias locales complejas.

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Clona este repositorio.
3. Copia el archivo de variables de entorno de ejemplo:

   ```bash
   cp .env.example .env
   ```
4. Levanta la base de datos y la infraestructura usando Docker:

   ```bash
   docker-compose up -d
   ```

## Carga Inicial de Datos (Seed)

Para probar la aplicación, es necesario contar con usuarios que posean roles administrativos (`admin`, `operador`), ya que el registro público solo crea cuentas con el rol de `usuario`.

Para cargar los usuarios de prueba obligatorios, abre tu terminal, ingresa a la carpeta `backend` y ejecuta:

```bash
npx tsx src/database/seed.ts
```

Esto limpiará la colección de usuarios e insertará las siguientes cuentas (todas con la contraseña `tlp42026`):

- `admin@tp.com` (Rol: admin)
- `operador@tp.com` (Rol: operador)
- `usuario@tp.com` (Rol: usuario)

##  Endpoints Principales

### Autenticación (`/api/auth`)

- `POST /register` - Registra un nuevo usuario normal.
- `POST /login` - Inicia sesión y devuelve un token JWT.

### Libros (`/api/books`)

- `GET /` - Lista todos los libros.
- `GET /:id` - Obtiene el detalle de un libro específico.
- `POST /` - Crea un nuevo libro (Requiere permisos).
- `PATCH /:id/status` - Cambia el estado del libro (Dispara notificaciones).

### Suscripciones (`/api/subscriptions`)

- `POST /` - Suscribe al usuario autenticado a un libro.
- `DELETE /:bookId` - Cancela la suscripción a un libro.

### Notificaciones (`/api/notifications`)

- `GET /` - Obtiene la bandeja de notificaciones del usuario.
- `GET /unread-count` - Obtiene la cantidad de notificaciones no leídas.
- `PATCH /:id/read` - Marca una notificación específica como leída.