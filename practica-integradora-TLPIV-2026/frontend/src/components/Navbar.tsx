import { Link, useNavigate } from 'react-router'
import { Can } from './Can'
import { NotificationBell } from './NotificationBell'
import { useAuth } from '../context/AuthContext'

export function Navbar() {
	const { user, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<header className="site-header">
			<Link className="brand" to="/libros" aria-label="Biblioteca, inicio">
				<span className="brand-mark" aria-hidden="true">B</span>
				<span>Biblioteca</span>
			</Link>
			<nav className="primary-nav" aria-label="Navegación principal">
				<Link to="/libros">Catálogo</Link>
				<Can permission="user:read">
					<Link to="/admin/usuarios">Usuarios</Link>
				</Can>
			</nav>
			<div className="account-area">
				<span className="account-email">{user?.email}</span>
				<Can permission="notification:read">
					<NotificationBell />
				</Can>
				<button className="button button-quiet" type="button" onClick={handleLogout}>
					Cerrar sesión
				</button>
			</div>
		</header>
	)
}
