import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './styles/base.css'
import App from './App.tsx'

// registro del service worker para la pwa
registerSW({
  immediate: true,
  onRegisterError(error: unknown) {
    console.error('error al registrar el service worker:', error)
  },
})

// montamos la app en el root
const contenedorRaiz = document.getElementById('root')

if (!contenedorRaiz) {
  throw new Error('no se encontro el elemento #root en el html')
}

createRoot(contenedorRaiz).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
