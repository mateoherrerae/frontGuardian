import './ListaHistorial.css'
import { useEffect, useMemo, useState } from 'react'
import { TriangleAlert, CheckCircle2, ShieldAlert, History } from 'lucide-react'
import type { ElementoHistorial } from '../types/analisis'
import {
  leerHistorial,
  EVENTO_HISTORIAL_ACTUALIZADO,
  LIMITE_ITEMS_HISTORIAL,
} from '../utils/historial'

// define icono y texto segun el nivel de riesgo
function clasificarElementoHistorial(item: ElementoHistorial) {
  const nivel = item.risk_level?.toLowerCase()
  
  if (item.is_safe && (nivel === 'safe' || !nivel)) {
    return {
      tipo: 'safe' as const,
      Icono: CheckCircle2,
      etiqueta: 'Seguro',
    }
  }

  if (nivel === 'suspicious' || nivel === 'unknown') {
    return {
      tipo: 'caution' as const,
      Icono: TriangleAlert,
      etiqueta: 'Precaución',
    }
  }

  return {
    tipo: 'danger' as const,
    Icono: ShieldAlert,
    etiqueta: 'Peligro',
  }
}

// lista con las ultimas 5 urls consultadas
export function ListaHistorial() {
  const [items, setItems] = useState<ElementoHistorial[]>(() => leerHistorial())

  // escuchamos cambios en localstorage y eventos custom para actualizar la lista
  useEffect(() => {
    const sincronizar = () => setItems(leerHistorial())

    window.addEventListener('storage', sincronizar)
    window.addEventListener(EVENTO_HISTORIAL_ACTUALIZADO, sincronizar)

    return () => {
      window.removeEventListener('storage', sincronizar)
      window.removeEventListener(EVENTO_HISTORIAL_ACTUALIZADO, sincronizar)
    }
  }, [])

  const itemsVisibles = useMemo(() => items.slice(0, LIMITE_ITEMS_HISTORIAL), [items])

  return (
    <section className="history-list" aria-labelledby="history-list-title">
      <div className="history-list__header">
        <History size={24} aria-hidden="true" />
        <h2 id="history-list-title" className="history-list__title">Últimas URL revisadas</h2>
      </div>

      {itemsVisibles.length === 0 ? (
        <p className="history-list__empty">Aquí aparecerán los últimos enlaces que verifiques.</p>
      ) : (
        <ul className="history-list__items">
          {itemsVisibles.map((item) => {
            const { tipo, Icono, etiqueta } = clasificarElementoHistorial(item)

            return (
              <li key={`${item.url}-${item.revisadoEn}`} className={`history-list__item history-list__item--${tipo}`}>
                <span
                  className={`history-list__dot history-list__dot--${tipo}`}
                  aria-hidden="true"
                />
                <Icono size={18} className={`history-list__state-icon history-list__state-icon--${tipo}`} aria-hidden="true" />
                <div className="history-list__body">
                  <p className="history-list__url">{item.url}</p>
                  <p className={`history-list__status history-list__status--${tipo}`}>{etiqueta}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export const HistoryList = ListaHistorial
export default ListaHistorial
