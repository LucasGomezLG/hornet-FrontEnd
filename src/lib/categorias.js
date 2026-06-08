// Lista canónica de categorías — usada en CotizadorForm y filtros de tienda/marketplace
export const CATEGORIAS = [
  { id: 'autopartes',   label: 'Autopartes',   blacklist: false },
  { id: 'herramientas', label: 'Herramientas', blacklist: false },
  { id: 'hogar',        label: 'Hogar',        blacklist: false },
  { id: 'deportes',     label: 'Deportes',     blacklist: false },
  { id: 'indumentaria', label: 'Indumentaria', blacklist: false },
  { id: 'libros',       label: 'Libros',       blacklist: false },
  { id: 'juguetes',     label: 'Juguetes',     blacklist: false },
  { id: 'mascotas',     label: 'Mascotas',     blacklist: false },
  { id: 'belleza',      label: 'Belleza',      blacklist: false },
  { id: 'muebles',      label: 'Muebles',      blacklist: false },
  { id: 'electronica',  label: 'Electrónica',  blacklist: true  },
  { id: 'cosmeticos',   label: 'Cosméticos',   blacklist: true  },
  { id: 'alimentos',    label: 'Alimentos',    blacklist: true  },
  { id: 'otro',         label: 'Otro',         blacklist: true  },
]

export const CATEGORIAS_ACTIVAS = CATEGORIAS.filter(c => !c.blacklist)

export function getCategoriaLabel(id) {
  return CATEGORIAS.find(c => c.id === id)?.label ?? id
}
