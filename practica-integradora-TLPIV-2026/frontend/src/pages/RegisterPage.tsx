import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { register as registerRequest } from '../api/auth.api'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
	const [message, setMessage] = useState('')
	const navigate = useNavigate()
	const { login } = useAuth()

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const email = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')
		const confirmPassword = String(formData.get('confirm-password') ?? '')

		if (password !== confirmPassword) {
			setMessage('Las contraseñas no coinciden.')
			return
		}

		try {
			const response = await registerRequest(email, password)
			login(response.token, response.user)
			navigate('/libros', { replace: true })
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'No se pudo crear la cuenta.')
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
					<p className="eyebrow">Un nuevo capítulo</p>
					<h1>Crear cuenta</h1>
					<p>Registrate para explorar y seguir el catálogo.</p>
				</div>
				<form className="auth-form" onSubmit={handleSubmit}>
					<label htmlFor="email">Correo electrónico</label>
					<input id="email" name="email" type="email" autoComplete="email" required />
					<label htmlFor="password">Contraseña</label>
					<input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
					<label htmlFor="confirm-password">Confirmar contraseña</label>
					<input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" minLength={8} required />
					<button className="button button-primary" type="submit">Crear cuenta</button>
					{message && <p className="form-message" role="status">{message}</p>}
				</form>
				<p className="auth-switch">¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link></p>
			</section>
			<aside className="auth-aside" aria-label="Biblioteca">
				<div className="aside-content">
					<p className="eyebrow">Descubrí tu próxima lectura</p>
					<h2>El catálogo crece con cada lector.</h2>
					<p>Creá tu cuenta para guardar libros y recibir novedades sobre su estado.</p>
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
