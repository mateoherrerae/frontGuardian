// exportamos los componentes y helpers
export { PantallaBase } from './PantallaBase'
export { EntradaUrl } from './EntradaUrl'
export { SemaforoRiesgo } from './SemaforoRiesgo'
export { ListaHistorial } from './ListaHistorial'

export {
  guardarEnHistorial,
  leerHistorial,
  obtenerEtiquetaEstado,
  EVENTO_HISTORIAL_ACTUALIZADO,
  determinarConfiguracionSemaforo,
} from '../utils'
