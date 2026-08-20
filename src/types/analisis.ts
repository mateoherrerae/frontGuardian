// tipos de datos para las respuestas y peticiones de la api

// niveles de riesgo posibles
export type NivelRiesgo =
  | 'safe'        // seguro
  | 'suspicious'  // sospechoso
  | 'malware'     // malware
  | 'phishing'    // phishing o estafa
  | 'malicious'   // malicioso
  | 'unknown'     // desconocido o no evaluado

// tipos de amenazas detectadas
export type TipoAmenaza =
  | 'malware'
  | 'phishing'
  | 'unwanted_software'
  | 'suspicious'
  | 'malicious'
  | 'unknown'
  | null

// detalles de google safe browsing
export interface DetalleGoogleSafeBrowsing {
  is_safe: boolean | null
  threats?: string[]
  error?: string
}

// detalles de virustotal
export interface DetalleVirusTotal {
  is_safe: boolean | null
  malicious_engines: number
  suspicious_engines: number
  total_engines: number
  threat_type?: string | null
  categories?: Record<string, string>
  error?: string
}

// detalle general que viene en la respuesta
export interface DetallesAnalisis {
  original_url?: string | null
  was_expanded?: boolean
  google_safe_browsing?: DetalleGoogleSafeBrowsing
  virustotal?: DetalleVirusTotal
  [key: string]: unknown
}

// formato del request
export interface PeticionAnalisis {
  url: string
}

// respuesta completa del backend
export interface RespuestaAnalisis {
  url: string
  score: number // puntaje de 0 a 100
  is_safe: boolean
  risk_level: NivelRiesgo | string
  threat_type: TipoAmenaza | string | null
  details?: DetallesAnalisis
}

// estructura para guardar en localstorage
export interface ElementoHistorial {
  url: string
  is_safe: boolean
  risk_level: string
  revisadoEn: number
}

// aliases de compatibilidad
export type AnalyzeRequest = PeticionAnalisis
export type AnalyzeResponse = RespuestaAnalisis
export type HistoryItem = ElementoHistorial
