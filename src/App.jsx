import { Routes, Route } from 'react-router'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { CategoriaProvider } from './context/CategoriaContext.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import ProtectedRoute from './router/ProtectedRoute.jsx'
import AdminRoute from './router/AdminRoute.jsx'

// Páginas públicas
import HomePage from './pages/public/HomePage.jsx'
import CotizarPage from './pages/public/CotizarPage.jsx'
import TiendaPage from './pages/public/TiendaPage.jsx'
import TiendaProductoPage from './pages/public/TiendaProductoPage.jsx'
import MarketplacePage from './pages/public/MarketplacePage.jsx'
import MarketplaceListingPage from './pages/public/MarketplaceListingPage.jsx'
import SeguimientoPage from './pages/public/SeguimientoPage.jsx'
import ComoFuncionaPage from './pages/public/ComoFuncionaPage.jsx'
import FaqPage from './pages/public/FaqPage.jsx'
import VenderPage from './pages/public/VenderPage.jsx'
import MayoristaPage from './pages/public/MayoristaPage.jsx'
import NosotrosPage from './pages/public/NosotrosPage.jsx'
import TerminosPage from './pages/public/TerminosPage.jsx'
import PrivacidadPage from './pages/public/PrivacidadPage.jsx'

// Auth
import LoginPage from './pages/auth/LoginPage.jsx'

// Dashboard (requieren auth)
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import PedidosPage from './pages/dashboard/PedidosPage.jsx'
import PerfilPage from './pages/dashboard/PerfilPage.jsx'
import CotizacionesPage from './pages/dashboard/CotizacionesPage.jsx'

// Pago (requieren auth)
import PagoExitosoPage from './pages/pago/PagoExitosoPage.jsx'
import PagoPendientePage from './pages/pago/PagoPendientePage.jsx'
import PagoFallidoPage from './pages/pago/PagoFallidoPage.jsx'

// Vendedor
import ProductosPage from './pages/vendedor/ProductosPage.jsx'

// Admin
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx'
import CotizacionesAdminPage from './pages/admin/CotizacionesAdminPage.jsx'
import PedidosAdminPage from './pages/admin/PedidosAdminPage.jsx'
import VendedoresAdminPage from './pages/admin/VendedoresAdminPage.jsx'
import TiendaAdminPage from './pages/admin/TiendaAdminPage.jsx'
import SolicitudesAdminPage from './pages/admin/SolicitudesAdminPage.jsx'
import CategoriasAdminPage from './pages/admin/CategoriasAdminPage.jsx'

import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    <ErrorBoundary>
    <ToastProvider>
    <AuthProvider>
    <CategoriaProvider>
      <Routes>
        {/* Todas las rutas con Header + Footer */}
        <Route element={<MainLayout />}>

          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cotizar" element={<CotizarPage />} />
          <Route path="/tienda" element={<TiendaPage />} />
          <Route path="/tienda/:id" element={<TiendaProductoPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<MarketplaceListingPage />} />
          <Route path="/seguimiento" element={<SeguimientoPage />} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/vender" element={<VenderPage />} />
          <Route path="/mayorista" element={<MayoristaPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><PedidosPage /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
          <Route path="/cotizaciones" element={<ProtectedRoute><CotizacionesPage /></ProtectedRoute>} />

          {/* Pago */}
          <Route path="/pago/exitoso" element={<ProtectedRoute><PagoExitosoPage /></ProtectedRoute>} />
          <Route path="/pago/pendiente" element={<ProtectedRoute><PagoPendientePage /></ProtectedRoute>} />
          <Route path="/pago/fallido" element={<ProtectedRoute><PagoFallidoPage /></ProtectedRoute>} />

          {/* Vendedor */}
          <Route path="/vendedor/productos" element={<ProtectedRoute requireRole="vendedor"><ProductosPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminOverviewPage /></AdminRoute>} />
          <Route path="/admin/cotizaciones" element={<AdminRoute><CotizacionesAdminPage /></AdminRoute>} />
          <Route path="/admin/pedidos" element={<AdminRoute><PedidosAdminPage /></AdminRoute>} />
          <Route path="/admin/vendedores" element={<AdminRoute><VendedoresAdminPage /></AdminRoute>} />
          <Route path="/admin/tienda" element={<AdminRoute><TiendaAdminPage /></AdminRoute>} />
          <Route path="/admin/solicitudes" element={<AdminRoute><SolicitudesAdminPage /></AdminRoute>} />
          <Route path="/admin/categorias" element={<AdminRoute><CategoriasAdminPage /></AdminRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CategoriaProvider>
    </AuthProvider>
    </ToastProvider>
    </ErrorBoundary>
  )
}
