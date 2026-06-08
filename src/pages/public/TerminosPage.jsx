export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-hornet-dark mb-8">Términos y condiciones</h1>

      <div className="prose prose-sm text-hornet-muted space-y-6">
        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">1. Objeto del servicio</h2>
          <p>
            Hornet Imports (en adelante "Hornet") provee servicios de importación personal y mayorista,
            tienda de productos importados y marketplace entre particulares dentro de la República Argentina.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">2. Condiciones de uso</h2>
          <p>
            El usuario declara ser mayor de 18 años y utilizar el servicio para fines legítimos y conformes a la
            legislación argentina. Queda prohibido el uso para importar productos ilegales, peligrosos o prohibidos
            por la Aduana argentina.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">3. Proceso de importación</h2>
          <p>
            Al confirmar un pedido, el usuario autoriza a Hornet a actuar como su representante para la compra y
            gestión de importación del producto. El precio cotizado es estimado y puede variar por fluctuaciones
            cambiarias o cambios en la normativa aduanera.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">4. Pagos y cancelaciones</h2>
          <p>
            El pago es previo a la compra del producto. Una vez realizada la compra, no se admiten cancelaciones.
            En caso de que el producto no esté disponible, Hornet reembolsará el monto total dentro de los 5 días hábiles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">5. Tiempos de entrega</h2>
          <p>
            Los tiempos indicados son estimados y pueden variar según el origen, la situación aduanera y factores
            externos. Hornet no se responsabiliza por demoras atribuibles a organismos gubernamentales o couriers externos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">6. Marketplace</h2>
          <p>
            Hornet actúa como intermediario en el marketplace. Las transacciones entre compradores y vendedores son
            responsabilidad de las partes. Hornet se reserva el derecho de suspender cuentas por uso indebido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-hornet-dark mb-2">7. Modificaciones</h2>
          <p>
            Hornet puede modificar estos términos en cualquier momento. Los cambios se notificarán por email y/o
            publicación en el sitio. El uso continuo del servicio implica aceptación de los nuevos términos.
          </p>
        </section>

        <p className="text-xs text-hornet-muted">Última actualización: junio 2025.</p>
      </div>
    </div>
  )
}
