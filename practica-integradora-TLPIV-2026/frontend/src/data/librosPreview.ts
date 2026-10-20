import type { Libro } from '../types'

export const librosDeVistaPrevia: readonly Libro[] = [
	{
		id: 'libro-1',
		titulo: 'El mapa de las mareas',
		descripcion: 'Una cartógrafa busca una isla que aparece solo al amanecer.',
		estado: 'DISPONIBLE',
		createdAt: '2026-09-10T12:00:00.000Z',
		updatedAt: '2026-09-20T12:00:00.000Z',
	},
	{
		id: 'libro-2',
		titulo: 'La casa de los relojes',
		descripcion: 'En una casa antigua, cada reloj marca una hora distinta.',
		estado: 'PRESTADO',
		createdAt: '2026-09-12T12:00:00.000Z',
		updatedAt: '2026-09-22T12:00:00.000Z',
	},
	{
		id: 'libro-3',
		titulo: 'Jardín de invierno',
		descripcion: 'Notas sobre las plantas que sobreviven al frío.',
		estado: 'EN_REPARACION',
		createdAt: '2026-09-15T12:00:00.000Z',
		updatedAt: '2026-09-25T12:00:00.000Z',
	},
]