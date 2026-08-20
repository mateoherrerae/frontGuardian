import './SemaforoRiesgo.css'
import type { RespuestaAnalisis } from '../types/analisis'
import { determinarConfiguracionSemaforo } from '../utils/semaforo'

interface PropsSemaforoRiesgo {
  resultado?: RespuestaAnalisis | null
  result?: RespuestaAnalisis | null
}

// tarjeta que muestra el resultado del analisis (verde, amarillo o rojo)
export function SemaforoRiesgo({ resultado, result }: PropsSemaforoRiesgo) {
  const analisis = resultado ?? result

  if (!analisis) return null

  const { color, Icono, titulo, mensaje } = determinarConfiguracionSemaforo(analisis)
  const esUrlExpandida = Boolean(analisis.details?.was_expanded)
  const urlOriginal = analisis.details?.original_url
  const etiquetaBadge = color === 'green' ? 'Seguro' : color === 'yellow' ? 'Precaución' : 'Peligro'

  return (
    <article className={`risk-card risk-card--${color}`} role="status" aria-live="polite">
      <div className="risk-card__icon" aria-hidden="true">
        <Icono size={48} strokeWidth={2.3} />
      </div>

      <div className="risk-card__content">
        <div className="risk-card__header">
          <h2 className="risk-card__title">{titulo}</h2>
          <span className="risk-card__badge">{etiquetaBadge}</span>
        </div>

        <p className="risk-card__message">{mensaje}</p>

        {/* si el link era acortado mostramos la url de origen */}
        {esUrlExpandida && urlOriginal && (
          <p className="risk-card__expanded-url">
            Link acortado expandido desde: <strong>{urlOriginal}</strong>
          </p>
        )}
      </div>
    </article>
  )
}

export const RiskTrafficLight = SemaforoRiesgo
export default SemaforoRiesgo
