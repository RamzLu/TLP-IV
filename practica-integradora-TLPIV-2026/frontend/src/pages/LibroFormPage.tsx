import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { Can } from '../components/Can'
import type { LibroStatus } from '../types'
import { createLibro, updateLibro, getLibro } from '../api/libro.api'
import type { Libro } from '../api/libro.api'

export function LibroFormPage() {
	const [message, setMessage] = useState('')
	const [book, setBook] = useState<Libro | null>(null)
	const [loading, setLoading] = useState(false)
	const [loadError, setLoadError] = useState('')
	const { id } = useParams()
	const navigate = useNavigate()
	const isEditing = Boolean(id)
	const permission = isEditing ? 'libro:update' : 'libro:create'

	useEffect(() => {
		if (!id) return
		let cancelled = false
		setLoading(true)
		setLoadError('')
		getLibro(id)
			.then((data) => {
				if (!cancelled) setBook(data)
			})
			.catch((err) => {
				if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Error al cargar el libro')
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [id])

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = new FormData(event.currentTarget)
		const data = {
			titulo: String(formData.get('titulo')),
			descripcion: String(formData.get('descripcion')),
			estado: String(formData.get('estado')) as LibroStatus,
		}

		try {
			if (isEditing && id) {
				await updateLibro(id, data)
			} else {
				await createLibro(data)
			}
			navigate('/libros')
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Error al comunicarse con la API.')
		}
	}

	if (isEditing && loading) {
		return (
			<section className="catalog-page">
				<p role="status">Cargando libro...</p>
			</section>
		)
	}

	if (isEditing && (loadError || !book)) {
		return (
			<section className="catalog-page">
				<Link className="auth-switch" to="/libros">Volver al catálogo</Link>
				<div className="catalog-empty">
					<h1>Libro no encontrado</h1>
					<p>{loadError || 'No hay un libro con ese identificador.'}</p>
				</div>
			</section>
		)
	}

	return (
		<section className="catalog-page">
			<Link className="auth-switch" to="/libros">Volver al catálogo</Link>
			<Can
				permission={permission}
				fallback={<p className="form-message" role="status">No tienes permiso para {isEditing ? 'editar' : 'crear'} libros.</p>}
			>
				<div className="auth-panel">
					<div className="auth-heading">
						<p className="eyebrow">Administración del catálogo</p>
						<h1>{isEditing ? 'Editar libro' : 'Nuevo libro'}</h1>
						<p>{isEditing ? 'Actualizá los datos del título.' : 'Completá los datos para agregar un título.'}</p>
					</div>
					<form className="auth-form" onSubmit={handleSubmit}>
						<label htmlFor="title">Título</label>
						<input id="title" name="titulo" type="text" maxLength={120} defaultValue={book?.titulo} required />
						<label htmlFor="description">Descripción</label>
						<textarea id="description" name="descripcion" rows={4} maxLength={1000} defaultValue={book?.descripcion} required />
						<label htmlFor="status">{isEditing ? 'Estado' : 'Estado inicial'}</label>
						<select id="status" name="estado" defaultValue={book?.estado ?? ('DISPONIBLE' satisfies LibroStatus)}>
							<option value="DISPONIBLE">Disponible</option>
							<option value="PRESTADO">Prestado</option>
							<option value="EN_REPARACION">En reparación</option>
						</select>
						<button className="button button-primary" type="submit">{isEditing ? 'Validar cambios' : 'Validar libro'}</button>
						{message && <p className="form-message" role="status">{message}</p>}
					</form>
				</div>
			</Can>
		</section>
	)
}