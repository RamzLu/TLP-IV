import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { login as loginRequest } from '../api/auth.api'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
	const [message, setMessage] = useState('')
	const navigate = useNavigate()
	const { login } = useAuth()

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const email = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')

		try {
			const response = await loginRequest(email, password)
			login(response.token, response.user)
			navigate('/libros', { replace: true })
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión.')
		}
	}

	return (
		<main className="auth-layout">
			<section className="auth-panel">
				<Link className="brand auth-brand" to="/login">
					<span className="brand-mark" aria-hidden="true">B</span>
					<span>Biblioteca</span>
				</Link>
				<div className="auth-heading">
					<p className="eyebrow">Tu espacio de lectura</p>
					<h1>Iniciar sesión</h1>
					<p>Ingresá con tu cuenta para continuar.</p>
				</div>
				<form className="auth-form" onSubmit={handleSubmit}>
					<label htmlFor="email">Correo electrónico</label>
					<input id="email" name="email" type="email" autoComplete="email" required />
					<label htmlFor="password">Contraseña</label>
					<input id="password" name="password" type="password" autoComplete="current-password" required />
					<button className="button button-primary" type="submit">Ingresar</button>
					{message && <p className="form-message" role="status">{message}</p>}
				</form>
				<p className="auth-switch">¿Todavía no tenés cuenta? <Link to="/registro">Crear cuenta</Link></p>
			</section>
			<aside className="auth-aside" aria-label="Biblioteca">
				<div className="aside-content">
					<p className="eyebrow">Biblioteca digital</p>
					<h2>Una buena historia siempre encuentra su lugar.</h2>
					<p>Explorá el catálogo y seguí los libros que te interesan.</p>
				</div>
				<div className="book-stack" aria-hidden="true">
					<span className="book book-one" />
					<span className="book book-two" />
					<span className="book book-three" />
				</div>
			</aside>
		</main>
	)
}
