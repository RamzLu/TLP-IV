const API_URL = 'http://localhost:3000/api/auth'

export async function login(email: string, password: string) {
	const response = await fetch(`${API_URL}/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'Correo o contraseña incorrectos')
	}

	return data
}

export async function register(email: string, password: string) {
	const response = await fetch(`${API_URL}/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(data.message || 'No se pudo crear la cuenta')
	}

	return data
}