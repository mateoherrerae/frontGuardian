import type { PeticionAnalisis, RespuestaAnalisis } from '../types/analisis'

// url del endpoint del backend en render
const ENDPOINT_ANALISIS = 'https://guardian-kpfs.onrender.com/api/v1/analyze'

// funcion para validar si el formato de la url es valido
export function esUrlValida(cadena: string): boolean {
  if (!cadena || typeof cadena !== 'string') return false

  try {
    const textoLimpio = cadena.trim()
    const urlFinal = textoLimpio.startsWith('http://') || textoLimpio.startsWith('https://')
      ? textoLimpio
      : `https://${textoLimpio}`

    new URL(urlFinal)
    return true
  } catch {
    return false
  }
}

// funcion que manda el post al backend para analizar el link
export async function analizarUrl(peticion: PeticionAnalisis): Promise<RespuestaAnalisis> {
  const urlLimpia = peticion.url.trim()

  if (!urlLimpia) {
    throw new Error('la url no puede estar vacia')
  }

  const respuesta = await fetch(ENDPOINT_ANALISIS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: urlLimpia }),
  })

  // si el server devuelve error tiramos excepcion
  if (!respuesta.ok) {
    throw new Error(`error en el servidor con status ${respuesta.status}`)
  }

  const datos = (await respuesta.json()) as RespuestaAnalisis
  return datos
}

export const analyzeText = analizarUrl
export type { PeticionAnalisis, RespuestaAnalisis }
export type { PeticionAnalisis as AnalyzeRequest, RespuestaAnalisis as AnalyzeResponse }
