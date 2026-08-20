import type { ElementType } from 'react'
import type { RespuestaAnalisis } from '../types/analisis'
import { ShieldCheck, TriangleAlert, ShieldAlert } from 'lucide-react'

export interface ConfiguracionSemaforo {
  color: 'green' | 'yellow' | 'red'
  Icono: ElementType
  titulo: string
  mensaje: string
}

// funcion para calcular el color, icono y texto del semaforo
export function determinarConfiguracionSemaforo(resultado: RespuestaAnalisis): ConfiguracionSemaforo {
  const nivel = resultado.risk_level?.toLowerCase()
  const esSeguroRaiz = Boolean(resultado.is_safe)
  const puntajeRaiz = typeof resultado.score === 'number' ? resultado.score : 50

  const vt = resultado.details?.virustotal
  const gsb = resultado.details?.google_safe_browsing

  const motoresMaliciosos = typeof vt?.malicious_engines === 'number' ? vt.malicious_engines : 0
  const motoresSospechosos = typeof vt?.suspicious_engines === 'number' ? vt.suspicious_engines : 0
  const totalMotores = typeof vt?.total_engines === 'number' ? vt.total_engines : 0
  const vtTipoAmenaza = (vt?.threat_type || resultado.threat_type || '').toLowerCase()

  const gsbDetectoAmenaza = gsb?.is_safe === false || (Array.isArray(gsb?.threats) && gsb.threats.length > 0)
  
  // si google safe browsing o virustotal marcan peligro va a rojo
  const esPeligroso =
    gsbDetectoAmenaza ||
    motoresMaliciosos >= 2 ||
    nivel === 'malware' ||
    nivel === 'phishing' ||
    nivel === 'malicious' ||
    vtTipoAmenaza === 'malware' ||
    vtTipoAmenaza === 'phishing' ||
    (!esSeguroRaiz && puntajeRaiz < 33)

  if (esPeligroso) {
    const esPhishing = nivel === 'phishing' || vtTipoAmenaza === 'phishing'
    const esMalware = nivel === 'malware' || vtTipoAmenaza === 'malware' || gsbDetectoAmenaza

    const titulo = esPhishing
      ? 'Peligro: Intento de Estafa (Phishing)'
      : esMalware
        ? 'Peligro: Software Malicioso Detectado'
        : 'Peligro: Enlace Malicioso'

    const detalleMotores = motoresMaliciosos > 0
      ? `Detectado como peligroso por ${motoresMaliciosos} motores de seguridad.`
      : 'Detectado como peligroso por los servicios de seguridad.'

    return {
      color: 'red',
      Icono: ShieldAlert,
      titulo,
      mensaje: `Cierra este enlace inmediatamente. ${detalleMotores} No ingreses credenciales ni descargues archivos.`,
    }
  }

  // si es un dominio no indexado (total_engines = 0) o tiene motores sospechosos va a amarillo
  const noIndexado = totalMotores === 0 && (vt?.is_safe === null || vt?.is_safe === undefined)
  const esSospechoso =
    noIndexado ||
    motoresSospechosos > 0 ||
    motoresMaliciosos === 1 ||
    nivel === 'suspicious' ||
    nivel === 'unknown' ||
    gsb?.is_safe === null ||
    vt?.is_safe === null ||
    (!esSeguroRaiz && puntajeRaiz >= 33 && puntajeRaiz < 67)

  if (esSospechoso) {
    const mensajeSospecha = noIndexado
      ? 'Este dominio no figura en las bases de datos de seguridad (es nuevo o no existe). Navega con extrema precaución.'
      : motoresSospechosos > 0 || motoresMaliciosos === 1
        ? 'Uno o más motores de seguridad reportaron señales sospechosas. No introduzcas contraseñas ni datos de pago.'
        : 'No se pudo verificar con certeza total la reputación del enlace. Navega con precaución.'

    return {
      color: 'yellow',
      Icono: TriangleAlert,
      titulo: 'Precaución',
      mensaje: mensajeSospecha,
    }
  }

  // si todos los motores dieron limpio va a verde
  return {
    color: 'green',
    Icono: ShieldCheck,
    titulo: 'Enlace Seguro',
    mensaje: 'Ningún motor de seguridad detectó amenazas. Puedes abrir este enlace con tranquilidad.',
  }
}
