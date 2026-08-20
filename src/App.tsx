import './App.css'
import {
  PantallaBase,
  EntradaUrl,
  SemaforoRiesgo,
  ListaHistorial,
  guardarEnHistorial,
} from './components'
import { useAnalisis } from './hooks'

// componente principal de la aplicacion
function App() {
  const { cargando, error, mensajeError, datos, ejecutarAnalisis } = useAnalisis()

  // envia la url a analizar y la guarda en el historial si dio ok
  async function manejarEnvioAnalisis(url: string) {
    const resultado = await ejecutarAnalisis({ url })
    if (resultado) {
      guardarEnHistorial(resultado)
    }
  }

  return (
    <PantallaBase>
      {/* input para escribir o pegar la url */}
      <EntradaUrl alEnviar={manejarEnvioAnalisis} estaCargando={cargando} />

      {/* mensaje de carga mientras consulta el backend */}
      {cargando && (
        <p className="app-status" role="status" aria-live="polite">
          Analizando seguridad del enlace, por favor espera...
        </p>
      )}

      {/* mensaje de error si fallo la conexion */}
      {error && (
        <p className="app-status app-status--error" role="alert">
          {mensajeError || 'Ocurrió un error de conexión con el servicio. Intenta nuevamente.'}
        </p>
      )}

      {/* resultado con semaforo verde, amarillo o rojo */}
      {datos && !cargando && <SemaforoRiesgo resultado={datos} />}

      {/* ultimas urls analizadas */}
      <ListaHistorial />
    </PantallaBase>
  )
}

export default App
