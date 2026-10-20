import type { LibroStatus } from '../types'

const API_URL = 'http://localhost:3000/api'

export interface Libro {
    id: string
    titulo: string
    descripcion: string
    estado: LibroStatus
    createdAt: string
    updatedAt: string
}

type LibroInput = { titulo: string; descripcion: string; estado: LibroStatus }

function getHeaders() {
    const token = localStorage.getItem('jwt_token')
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
}

// el backend usa title/description/status
function toBackend(data: Partial<LibroInput>) {
    return {
        ...(data.titulo !== undefined ? { title: data.titulo } : {}),
        ...(data.descripcion !== undefined ? { description: data.descripcion } : {}),
        ...(data.estado !== undefined ? { status: data.estado } : {})
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLibro(raw: any): Libro {
    const now = new Date().toISOString()
    return {
        id: String(raw._id ?? raw.id),
        titulo: raw.title ?? raw.titulo ?? '',
        descripcion: raw.description ?? raw.descripcion ?? '',
        estado: (raw.status ?? raw.estado ?? 'DISPONIBLE') as LibroStatus,
        createdAt: raw.createdAt ?? now,
        updatedAt: raw.updatedAt ?? now
    }
}

async function errorMessage(response: Response, fallback: string) {
    try {
        const body = await response.json()
        return body.message || fallback
    } catch {
        return fallback
    }
}

export async function getLibros(): Promise<Libro[]> {
    const response = await fetch(`${API_URL}/books`, { headers: getHeaders() })
    if (!response.ok) throw new Error(await errorMessage(response, 'Error al cargar los libros'))
    const data = await response.json()
    return (Array.isArray(data) ? data : []).map(normalizeLibro)
}

export async function getLibro(id: string): Promise<Libro> {
    const response = await fetch(`${API_URL}/books/${id}`, { headers: getHeaders() })
    if (!response.ok) throw new Error(await errorMessage(response, 'Libro no encontrado'))
    return normalizeLibro(await response.json())
}

export async function createLibro(data: LibroInput) {
    const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(toBackend(data))
    })
    if (!response.ok) throw new Error(await errorMessage(response, 'Error al crear el libro'))
    return response.json()
}

export async function updateLibro(id: string, data: Partial<LibroInput>) {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(toBackend(data))
    })
    if (!response.ok) throw new Error(await errorMessage(response, 'Error al actualizar el libro'))
    return response.json()
}

export async function subscribeLibro(bookId: string) {
    const response = await fetch(`${API_URL}/subscriptions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ bookId })
    })
    if (!response.ok) throw new Error(await errorMessage(response, 'Error al suscribirse'))
    return response.json()
}

export async function unsubscribeLibro(bookId: string) {
    const response = await fetch(`${API_URL}/subscriptions/${bookId}`, {
        method: 'DELETE',
        headers: getHeaders()
    })
    if (!response.ok) throw new Error(await errorMessage(response, 'Error al cancelar suscripción'))
    return response.status === 204 ? null : response.json()
}