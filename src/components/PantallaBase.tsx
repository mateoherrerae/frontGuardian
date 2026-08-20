import './PantallaBase.css'
import type { ReactNode } from 'react'

interface PropsPantallaBase {
  children: ReactNode
}

// contenedor principal y layout de la pagina
export function PantallaBase({ children }: PropsPantallaBase) {
  return (
    <main className="base-screen" role="main">
      <header className="base-screen__header">
        <p className="base-screen__eyebrow">Guardian</p>
        <h1 className="base-screen__title">Guardian — Verificador de Enlaces</h1>
        <p className="base-screen__subtitle">Revisa si un enlace es seguro antes de abrirlo.</p>
      </header>

      <section className="base-screen__content">
        {children}
      </section>

      {/* aviso legal al pie */}
      <footer className="base-screen__disclaimer">
        Esta herramienta es orientativa. El uso es bajo tu propia responsabilidad — no nos hacemos responsables por decisiones tomadas en base a estos resultados.
      </footer>
    </main>
  )
}

export const BaseScreen = PantallaBase
export default PantallaBase
