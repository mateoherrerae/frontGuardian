import { useCallback, useState } from 'react'
import { analizarUrl } from '../services/servicioAnalisis'
import type { PeticionAnalisis, RespuestaAnalisis } from '../types/analisis'

// estado para manejar la respuesta, loading y errores
interface EstadoAnalisis {
  cargando: boolean
  datos: RespuestaAnalisis | null
  error: boolean
  mensajeError: string | null
}

// hook para consultar el analisis de una url
export function useAnalisis() {
  const [estado, setEstado] = useState<EstadoAnalisis>({
    cargando: false,
    datos: null,
    error: false,
    mensajeError: null,
  })

  // funcion que dispara la peticion
  const ejecutarAnalisis = useCallback(async (peticion: PeticionAnalisis): Promise<RespuestaAnalisis | null> => {
    // reseteamos el estado antes de empezar
    setEstado({
      cargando: true,
      datos: null,
      error: false,
      mensajeError: null,
    })

    try {
      const resultado = await analizarUrl(peticion)
      setEstado({
        cargando: false,
        datos: resultado,
        error: false,
        mensajeError: null,
      })
      return resultado
    } catch (err) {
      // si falla mostramos el mensaje de error
      const mensaje = err instanceof Error ? err.message : 'error al conectar con el servidor'
      setEstado({
        cargando: false,
        datos: null,
        error: true,
        mensajeError: mensaje,
      })
      return null
    }
  }, [])

  // funcion para limpiar los datos en pantalla
  const limpiarResultado = useCallback(() => {
    setEstado({
      cargando: false,
      datos: null,
      error: false,
      mensajeError: null,
    })
  }, [])

  return {
    cargando: estado.cargando,
    datos: estado.datos,
    error: estado.error,
    mensajeError: estado.mensajeError,
    ejecutarAnalisis,
    limpiarResultado,

    // aliases por compatibilidad
    loading: estado.cargando,
    data: estado.datos,
    runAnalyze: ejecutarAnalisis,
  }
}

export const useAnalyze = useAnalisis
