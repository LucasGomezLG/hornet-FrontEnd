export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-hornet-dark mb-8">Política de privacidad</h1>

      <div className="prose prose-sm text-hornet-muted space-y-6">
        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">1. Responsable del tratamiento</h2>
          <p>
            Hornet Imports es responsable del tratamiento de los datos personales de los usuarios del sitio
            hornetimports.com, conforme a la Ley 25.326 de Protección de Datos Personales (Argentina).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">2. Datos que recopilamos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Datos de cuenta: nombre, email (obtenidos mediante Google OAuth).</li>
            <li>Datos de pedidos: dirección de entrega, CUIL/CUIT para trámites aduaneros.</li>
            <li>Datos de uso: páginas visitadas, cotizaciones realizadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">3. Finalidad del tratamiento</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Gestión de pedidos e importaciones.</li>
            <li>Comunicaciones sobre el estado de los pedidos.</li>
            <li>Cumplimiento de obligaciones aduaneras y fiscales.</li>
            <li>Mejora del servicio y análisis de uso.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">4. Compartición de datos</h2>
          <p>
            No vendemos ni compartimos datos personales con terceros, salvo cuando sea necesario para cumplir
            con las obligaciones del servicio (courier, aduana, procesadores de pago) o por requerimiento legal.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">5. Cookies</h2>
          <p>
            Usamos cookies de sesión (httpOnly, seguras) para mantener la autenticación. No utilizamos cookies
            de seguimiento de terceros ni publicidad.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">6. Derechos del usuario</h2>
          <p>
            Podés solicitar acceso, rectificación, eliminación u oposición al tratamiento de tus datos escribiendo a{' '}
            <a href="mailto:privacidad@hornetimports.com" className="underline">privacidad@hornetimports.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">7. Seguridad</h2>
          <p>
            Los datos se almacenan en servidores seguros. Las contraseñas nunca son almacenadas: la autenticación
            se realiza exclusivamente mediante Google OAuth. Los tokens de sesión son cookies httpOnly no accesibles
            desde JavaScript.
          </p>
        </section>

        <p className="text-xs text-hornet-muted">Última actualización: junio 2025.</p>
      </div>
    </div>
  )
}
