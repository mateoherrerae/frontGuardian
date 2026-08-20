# Guardian - Frontend

Frontend de Guardian, una aplicacion web progresiva (PWA) orientada a la verificacion rapida de enlaces sospechosos para prevenir ataques de phishing, distribucion de malware y estafas digitales antes de que el usuario interactue con un sitio web.

---

## Que hace la aplicacion

Guardian permite ingresar o pegar una URL sospechosa desde cualquier dispositivo movil o de escritorio. La aplicacion se comunica con un backend que consulta multiples motores de ciberseguridad (Google Safe Browsing y VirusTotal) y devuelve un veredicto visual en tres niveles:

- Verde (Seguro): Score de 67 a 100. La URL no presenta amenazas reportadas en las bases de datos.
- Amarillo (Precaucion): Score de 33 a 66 o estado desconocido. Se detecto actividad sospechosa en algun motor o el servicio externo no pudo validar el dominio por completo.
- Rojo (Peligro): Score menor a 33 o clasificacion explicita de phishing, malware o contenido malicioso. La aplicacion advierte no ingresar datos ni continuar la navegacion.

Si la URL ingresada es un enlace acortado (por ejemplo bit.ly o t.co), el sistema la expande automaticamente y muestra la direccion de destino real para mayor transparencia.

---

## Decisiones tecnicas y arquitectura

El proyecto se estructuro siguiendo una arquitectura desacoplada en tres capas principales, evitando meter librerias pesadas o estado global innecesario para un flujo que es directo y concreto:

```
src/
├── components/    # Capa de presentacion (componentes funcionales en React)
├── hooks/         # Capa de logica y estado (useAnalisis)
├── services/      # Capa de red e integracion (analizarUrl con Fetch API)
├── utils/         # Funciones puras (calculo del semaforo y storage)
├── types/         # Interfaces y contratos de TypeScript
└── styles/        # Variables CSS globales y reset mobile-first
```

### Justificacion del stack

1. React 19 y TypeScript: Garantiza tipado estricto de punta a punta para todos los payloads de la API y evita errores de propiedades nulas en tiempo de ejecucion.
2. Vite: Herramienta de compilacion y entorno de desarrollo con tiempos de recarga casi instantaneos.
3. PWA (vite-plugin-pwa): Permite instalar la aplicacion en dispositivos moviles directamente desde el navegador, con auto-actualizacion del service worker.
4. CSS Nativo Modular: Se utilizaron variables CSS semanticas y estilos por componente con enfoque mobile-first, sin depender de frameworks externos pesados como Tailwind o Bootstrap.
5. Persistencia y sincronizacion ligera: El historial guarda los ultimos 5 analisis en localStorage mediante un helper seguro (con manejo de excepciones para navegacion privada) y sincroniza cambios entre componentes y pestañas mediante eventos personalizados de window (`guardian-history-updated`).

---

## Estructura de carpetas

```text
src/
├── components/
│   ├── EntradaUrl.css
│   ├── EntradaUrl.tsx        # Input de URL con acceso directo a portapapeles
│   ├── ListaHistorial.css
│   ├── ListaHistorial.tsx    # Listado de ultimas 5 URLs consultadas
│   ├── PantallaBase.css
│   ├── PantallaBase.tsx      # Layout base responsivo con disclaimer legal
│   ├── SemaforoRiesgo.css
│   ├── SemaforoRiesgo.tsx    # Tarjeta de resultado con iconografia y estado
│   └── index.ts
├── hooks/
│   ├── useAnalisis.ts        # Hook que centraliza loading, data y error
│   └── index.ts
├── services/
│   ├── servicioAnalisis.ts   # Cliente HTTP nativo y validacion de URLs
│   └── index.ts
├── styles/
│   └── base.css              # Tokens de diseno, paleta oscura y tipografia
├── types/
│   ├── analisis.ts           # Interfaces de respuesta, peticion y riesgo
│   └── index.ts
├── utils/
│   ├── historial.ts          # Lectura, guardado y deduplicacion en localStorage
│   ├── semaforo.ts           # Logica de clasificacion del semaforo
│   └── index.ts
├── App.css
├── App.tsx                   # Orquestacion de componentes y flujo principal
├── main.tsx                  # Entrada de la aplicacion y registro del SW
└── vite-env.d.ts
```

---

## Como levantar el proyecto en local

### Requisitos
- Node.js version 18 o superior
- npm

### Pasos

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicacion quedara disponible en `http://localhost:5173`.

3. Generar la compilacion para produccion:
   ```bash
   npm run build
   ```

4. Previsualizar el build de produccion:
   ```bash
   npm run preview
   ```

---

## Integracion con el Backend

El frontend se conecta al endpoint productivo desplegado en Render:

```http
POST https://guardian-kpfs.onrender.com/api/v1/analyze
Content-Type: application/json

{
  "url": "https://sitio-a-evaluar.com"
}
```

### Ejemplo de respuesta procesada

```json
{
  "url": "https://sitio-peligroso.com/login",
  "score": 0,
  "is_safe": false,
  "risk_level": "phishing",
  "threat_type": "phishing",
  "details": {
    "original_url": "https://bit.ly/3xyz",
    "was_expanded": true,
    "google_safe_browsing": {
      "is_safe": false,
      "threats": ["THREAT_MATCH"]
    },
    "virustotal": {
      "is_safe": false,
      "malicious_engines": 8,
      "total_engines": 90
    }
  }
}
```

---

## Proximas mejoras planificadas

- Extension para navegadores Chrome y Firefox que analice enlaces al pasar el cursor o previo a hacer click.
- Vista expandible con detalles tecnicos para usuarios avanzados (desglose motor por motor de VirusTotal).
- Sistema de cache local para dominios de alta reputacion ya verificados.

## Links de prueba
- Inexistente / No indexado: http://dominio-sospechoso-ficticio-123456789.xy/ ➔ 🟡 Precaución
- Malware de prueba: http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/ ➔ 🔴 Peligro
- Sitio seguro real: https://wikipedia.org ➔ 🟢 Seguro
