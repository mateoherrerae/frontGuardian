import type { ElementoHistorial, RespuestaAnalisis } from '../types/analisis'
import { determinarConfiguracionSemaforo } from './semaforo'

// clave para guardar en localstorage
export const CLAVE_STORAGE = 'guardian-history'
export const STORAGE_KEY = CLAVE_STORAGE

// evento para sincronizar componentes
export const EVENTO_HISTORIAL_ACTUALIZADO = 'guardian-history-updated'
export const HISTORY_UPDATED_EVENT = EVENTO_HISTORIAL_ACTUALIZADO

export const LIMITE_ITEMS_HISTORIAL = 5

// funcion para leer el historial desde localstorage
export function leerHistorial(): ElementoHistorial[] {
  if (typeof window === 'undefined') return []

  try {
    const dataCruda = localStorage.getItem(CLAVE_STORAGE)
    if (!dataCruda) return []

    const parseado = JSON.parse(dataCruda) as unknown
    if (!Array.isArray(parseado)) return []

    const itemsNormalizados: ElementoHistorial[] = parseado
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        url: typeof item.url === 'string' ? item.url : '',
        is_safe: Boolean(item.is_safe),
        risk_level: typeof item.risk_level === 'string' ? item.risk_level : 'unknown',
        revisadoEn: typeof item.revisadoEn === 'number'
          ? item.revisadoEn
          : typeof item.checkedAt === 'number'
            ? item.checkedAt
            : Date.now(),
      }))

    return itemsNormalizados.slice(0, LIMITE_ITEMS_HISTORIAL)
  } catch {
    return []
  }
}

// funcion para guardar un resultado nuevo en el historial
export function guardarEnHistorial(resultado: RespuestaAnalisis): void {
  if (typeof window === 'undefined' || !resultado?.url) return

  try {
    const config = determinarConfiguracionSemaforo(resultado)
    const esSeguro = config.color === 'green'
    const nivelRiesgo = config.color === 'green' ? 'safe' : config.color === 'yellow' ? 'suspicious' : 'malware'

    const itemNuevo: ElementoHistorial = {
      url: resultado.url,
      is_safe: esSeguro,
      risk_level: nivelRiesgo,
      revisadoEn: Date.now(),
    }

    // filtramos duplicados de la misma url
    const historialPrevio = leerHistorial().filter((item) => item.url !== itemNuevo.url)
    const nuevoHistorial = [itemNuevo, ...historialPrevio].slice(0, LIMITE_ITEMS_HISTORIAL)

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevoHistorial))
    window.dispatchEvent(new Event(EVENTO_HISTORIAL_ACTUALIZADO))
  } catch {
    // ignoramos si falla localstorage
  }
}

export const saveHistoryItem = guardarEnHistorial

// funcion para obtener la etiqueta de texto segun el nivel
export function obtenerEtiquetaEstado(item: ElementoHistorial): string {
  const nivel = item.risk_level?.toLowerCase()
  if (item.is_safe && nivel === 'safe') return 'Seguro'
  if (nivel === 'suspicious' || nivel === 'unknown') return 'Precaución'
  return 'Peligro'
}
