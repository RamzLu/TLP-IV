import { useState } from 'react'
import { Can } from '../components/Can'
import type { Role, User } from '../types'

const usuariosDeVistaPrevia: User[] = [
	{ id: 'usuario-1', email: 'luana@biblioteca.test', role: 'admin' },
	{ id: 'usuario-2', email: 'vivi@biblioteca.test', role: 'operador' },
	{ id: 'usuario-3', email: 'kia@biblioteca.test', role: 'usuario' },
]

const etiquetasRol: Record<Role, string> = {
	admin: 'Administrador',
	operador: 'Operador',
	usuario: 'Usuario',
}

export function AdminUserPage() {
	const [users, setUsers] = useState(usuariosDeVistaPrevia)

	const assignRole = (userId: string, role: Role) => {
		setUsers((currentUsers) => currentUsers.map((user) => (
			user.id === userId ? { ...user, role } : user
		)))
	}

	return (
		<section className="catalog-page">
			<header className="catalog-heading">
				<div>
					<p className="eyebrow">Administración</p>
					<h1>Usuarios</h1>
					<p className="catalog-description">Consulta y asignación de roles.</p>
				</div>
				<p className="catalog-count">{users.length} usuarios</p>
			</header>

			<div className="catalog-table-wrap">
				<table className="catalog-table">
					<thead>
						<tr>
							<th scope="col">Correo</th>
							<th scope="col">Rol actual</th>
							<th scope="col">Asignar rol</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td><strong>{user.email}</strong></td>
								<td>{etiquetasRol[user.role]}</td>
								<td>
									<Can permission="user:assign-role" fallback={<span>Sin permiso</span>}>
										<select
											className="admin-role-select"
											aria-label={`Asignar rol a ${user.email}`}
											value={user.role}
											onChange={(event) => assignRole(user.id, event.currentTarget.value as Role)}
										>
											<option value="admin">Administrador</option>
											<option value="operador">Operador</option>
											<option value="usuario">Usuario</option>
										</select>
									</Can>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}
