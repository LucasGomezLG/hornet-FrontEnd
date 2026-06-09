import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-black text-hornet-dark mb-2">Algo salió mal</h1>
          <p className="text-sm text-hornet-muted mb-6">
            Ocurrió un error inesperado. Recargá la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-hornet-gold text-hornet-dark text-sm font-black px-5 py-2"
          >
            Recargar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
