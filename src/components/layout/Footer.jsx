import { Link } from 'react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-hornet-dark text-white border-t border-neutral-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-hornet-gold font-black text-lg">HORNET</span>
              <span className="text-white font-medium text-lg">IMPORTS</span>
            </div>
            <p className="text-hornet-muted text-sm leading-relaxed">
              Importamos desde cualquier parte del mundo. Sin sorpresas, sin letra chica.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-hornet-muted mb-3">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li><FooterLink to="/cotizar" label="Cotizador" /></li>
              <li><FooterLink to="/tienda" label="Tienda" /></li>
              <li><FooterLink to="/marketplace" label="Marketplace" /></li>
              <li><FooterLink to="/vender" label="Vender" /></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-hornet-muted mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li><FooterLink to="/nosotros" label="Nosotros" /></li>
              <li><FooterLink to="/como-funciona" label="Cómo funciona" /></li>
              <li><FooterLink to="/mayorista" label="Mayoristas" /></li>
              <li><FooterLink to="/faq" label="Preguntas frecuentes" /></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-hornet-muted mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><FooterLink to="/terminos" label="Términos y condiciones" /></li>
              <li><FooterLink to="/privacidad" label="Política de privacidad" /></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-6 text-center text-hornet-muted text-xs">
          © {year} Hornet Imports. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, label }) {
  return (
    <Link to={to} className="text-hornet-muted hover:text-white transition-colors">
      {label}
    </Link>
  )
}
