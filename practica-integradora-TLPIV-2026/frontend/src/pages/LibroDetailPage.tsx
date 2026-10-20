import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Can } from '../components/Can'
import type { LibroStatus } from '../types'
import { getLibro, updateLibro, subscribeLibro, unsubscribeLibro } from '../api/libro.api'
import type { Libro } from '../api/libro.api'

const etiquetasEstado: Record<LibroStatus, string> = {
	DISPONIBLE: 'Disponible',
	PRESTADO: 'Prestado',
	EN_REPARACION: 'En reparación',
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat('es-AR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	}).format(new Date(date))
}

export function LibroDetailPage() {
	const { id } = useParams()
	const [libro, setLibro] = useState<Libro | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [isSubscribed, setIsSubscribed] = useState(false)
	const [deleted, setDeleted] = useState(false)

	useEffect(() => {
		if (!id) return
		let cancelled = false
		setLoading(true)
		setError('')
		getLibro(id)
			.then((data) => {
				if (cancelled) return
				setLibro(data)
				setIsSubscribed(window.localStorage.getItem(`libro-follow-${data.id}`) === 'true')
			})
			.catch((err) => {
				if (!cancelled) setError(err instanceof Error ? err.message : 'Error al cargar el libro')
			})
			.finally(() => {
				if (!cancelled) setLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [id])

	if (loading) {
		return (
			<section className="catalog-page">
				<p role="status">Cargando libro...</p>
			</section>
		)
	}

	if (error || !libro) {
		return (
			<section className="catalog-page">
				<Link className="auth-switch" to="/libros">Volver al catálogo</Link>
				<div className="catalog-empty">
					<h1>Libro no encontrado</h1>
					<p>{error || 'No hay un libro con ese identificador.'}</p>
				</div>
			</section>
		)
	}

	if (deleted) {
		return (
			<section className="catalog-page">
				<div className="catalog-empty" role="status">
					<p className="eyebrow">Vista previa</p>
					<h1>Eliminación simulada</h1>
					<p>El libro no se quitó del backend.</p>
					<Link className="button button-quiet" to="/libros">Volver al catálogo</Link>
				</div>
			</section>
		)
	}

	const handleDeletePreview = () => {
		if (window.confirm(`¿Simular la eliminación de "${libro.titulo}"?`)) {
			setDeleted(true)
		}
	}

	const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const nuevoEstado = event.currentTarget.value as LibroStatus
		const anterior = libro.estado
		setLibro({ ...libro, estado: nuevoEstado })
		try {
			await updateLibro(libro.id, { estado: nuevoEstado })
		} catch (err) {
			console.error(err)
			setLibro((current) => (current ? { ...current, estado: anterior } : current))
		}
	}

	const handleSubscribe = async () => {
		try {
			await subscribeLibro(libro.id)
			window.localStorage.setItem(`libro-follow-${libro.id}`, 'true')
			setIsSubscribed(true)
		} catch (err) {
			console.error(err)
		}
	}

	const handleUnsubscribe = async () => {
		try {
			await unsubscribeLibro(libro.id)
			window.localStorage.setItem(`libro-follow-${libro.id}`, 'false')
			setIsSubscribed(false)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<section className="catalog-page book-detail-page">
			<Link className="auth-switch" to="/libros">Volver al catálogo</Link>
			<div className="book-detail-layout">
				<div className={`book-detail-cover cover-${libro.estado.toLowerCase()}`} aria-label={`Cubierta de ${libro.titulo}`}>
					<span className="book-cover-kicker">Colección biblioteca</span>
					<div className="book-cover-center">
						<span className="book-cover-rule" />
						<span className="book-cover-title">{libro.titulo}</span>
					</div>
					<span className="book-cover-caption">Lecturas para descubrir</span>
				</div>
				<div className="book-detail-content">
					<header className="book-detail-heading">
						<p className="eyebrow">Detalle del libro</p>
						<h1>{libro.titulo}</h1>
						<p className="book-detail-description">{libro.descripcion}</p>
						<span className={`status-badge status-${libro.estado.toLowerCase()}`}>
							{etiquetasEstado[libro.estado]}
						</span>
					</header>
					<div className="detail-actions">
						<Can permission="libro:update">
							<Link className="button button-quiet" to={`/libros/${libro.id}/editar`}>Editar libro</Link>
						</Can>
						<Can permission="libro:delete">
							<button className="button button-danger" type="button" onClick={handleDeletePreview}>
								Eliminar libro
							</button>
						</Can>
						<Can permission="libro:change-status">
							<label className="catalog-filter">
								<span>Cambiar estado</span>
								<select value={libro.estado} onChange={handleStatusChange}>
									<option value="DISPONIBLE">Disponible</option>
									<option value="PRESTADO">Prestado</option>
									<option value="EN_REPARACION">En reparación</option>
								</select>
							</label>
						</Can>
						<Can permission="subscription:create">
							{isSubscribed ? (
								<Can permission="subscription:delete">
									<button className="button button-quiet" type="button" onClick={handleUnsubscribe}>
										Dejar de seguir
									</button>
								</Can>
							) : (
								<button className="button button-primary" type="button" onClick={handleSubscribe}>
									Seguir libro
								</button>
							)}
						</Can>
					</div>
					{isSubscribed && <p className="subscription-status" role="status">Sigues este libro.</p>}
					<dl className="book-metadata">
						<div>
							<dt>Fecha de alta</dt>
							<dd>{formatDate(libro.createdAt)}</dd>
						</div>
						<div>
							<dt>Última actualización</dt>
							<dd>{formatDate(libro.updatedAt)}</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>
	)
}