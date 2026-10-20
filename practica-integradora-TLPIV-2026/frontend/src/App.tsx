import { Navigate, Outlet, Route, Routes } from 'react-router'
import { Can } from './components/Can'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { AdminUserPage } from './pages/AdminUserPage'
import { LibroDetailPage } from './pages/LibroDetailPage'
import { LibroFormPage } from './pages/LibroFormPage'
import { LibroListPage } from './pages/LibroListPage'
import { RegisterPage } from './pages/RegisterPage'
import './App.css'

function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/libros" replace />} />
          <Route path="/libros" element={<LibroListPage />} />
          <Route path="/libros/nuevo" element={<LibroFormPage />} />
          <Route path="/libros/:id/editar" element={<LibroFormPage />} />
          <Route path="/libros/:id" element={<LibroDetailPage />} />
          <Route
            path="/admin/usuarios"
            element={(
              <Can permission="user:read" fallback={<Navigate to="/libros" replace />}>
                <AdminUserPage />
              </Can>
            )}
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
