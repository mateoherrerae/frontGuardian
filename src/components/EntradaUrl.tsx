import './EntradaUrl.css'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link2, LoaderCircle, Clipboard } from 'lucide-react'

interface PropsEntradaUrl {
  valor?: string
  alCambiar?: (valor: string) => void
  alEnviar?: (url: string) => void
  estaCargando?: boolean

  // props por compatibilidad
  value?: string
  onChange?: (v: string) => void
  onSubmit?: (url: string) => void
  isLoading?: boolean
}

// campo de texto con boton de pegar y submit
export function EntradaUrl({
  valor,
  alCambiar,
  alEnviar,
  estaCargando,
  value,
  onChange,
  onSubmit,
  isLoading,
}: PropsEntradaUrl) {
  const valorInicial = valor ?? value ?? ''
  const callbackCambio = alCambiar ?? onChange
  const callbackEnvio = alEnviar ?? onSubmit
  const cargando = Boolean(estaCargando ?? isLoading)

  const [urlLocal, setUrlLocal] = useState<string>(valorInicial)
  const [prevValorInicial, setPrevValorInicial] = useState<string>(valorInicial)

  // si cambia la prop desde afuera actualizamos el estado
  if (valorInicial !== prevValorInicial) {
    setPrevValorInicial(valorInicial)
    setUrlLocal(valorInicial)
  }

  // actualiza el texto al escribir
  function manejarCambio(evento: ChangeEvent<HTMLInputElement>) {
    const nuevoTexto = evento.target.value
    setUrlLocal(nuevoTexto)
    callbackCambio?.(nuevoTexto)
  }

  // envia el formulario
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const urlLimpia = urlLocal.trim()

    if (!urlLimpia || cargando) return

    callbackEnvio?.(urlLimpia)
  }

  // lee el portapapeles del navegador para pegar directo
  async function manejarPegadoPortapapeles() {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) {
      return
    }

    try {
      const textoPortapapeles = await navigator.clipboard.readText()
      const textoLimpio = textoPortapapeles.trim()
      if (textoLimpio) {
        setUrlLocal(textoLimpio)
        callbackCambio?.(textoLimpio)
      }
    } catch {
      // si no da permisos no hacemos nada
    }
  }

  return (
    <form className="url-input" onSubmit={manejarEnvio} aria-label="Formulario de verificación de URL">
      <div className="url-input__field">
        <span className="url-input__icon" aria-hidden="true">
          <Link2 size={28} strokeWidth={2.4} />
        </span>

        <input
          className="url-input__text"
          type="url"
          inputMode="url"
          placeholder="Pega la URL aquí (ej: https://...)"
          value={urlLocal}
          onChange={manejarCambio}
          disabled={cargando}
          aria-label="URL que deseas verificar"
          required
        />

        <button
          type="button"
          className="url-input__paste"
          onClick={manejarPegadoPortapapeles}
          title="Pegar desde el portapapeles"
          aria-label="Pegar enlace desde el portapapeles"
        >
          <Clipboard size={20} />
        </button>
      </div>

      <button
        type="submit"
        className="url-input__btn"
        disabled={cargando || !urlLocal.trim()}
        aria-live="polite"
      >
        {cargando ? (
          <LoaderCircle className="url-input__spinner" size={22} aria-hidden="true" />
        ) : (
          'Verificar URL'
        )}
      </button>
    </form>
  )
}

export const URLInput = EntradaUrl
export default EntradaUrl
