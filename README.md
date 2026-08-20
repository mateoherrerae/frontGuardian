# Guardian - Frontend

Frontend de Guardian, una aplicacion web progresiva (PWA) hecha en React y TypeScript que sirve para chequear si un enlace es seguro antes de abrirlo, ayudando a prevenir estafas, phishing y virus.

---

## Que hace el proyecto

La app te deja escribir o pegar un link sospechoso. Esa URL se envia a un backend que consulta servicios de seguridad (como Google Safe Browsing y VirusTotal) y te devuelve una respuesta visual con un semaforo:

- Verde (Seguro): no se detectaron amenazas en los motores de seguridad.
- Amarillo (Precaucion): el dominio no esta indexado en bases de datos (es nuevo o no existe) o algun motor marco actividad sospechosa.
- Rojo (Peligro): se detecto malware, phishing o software malicioso.

Si el link era acortado (tipo bit.ly), la app lo expande y te muestra a que direccion web apunta realmente.

---

## Explicacion de los archivos del proyecto

Aca dejo un resumen de lo que hace cada archivo importante en la carpeta `src`:

### Componentes (`src/components/`)

- `PantallaBase.tsx` y `PantallaBase.css`: es el layout principal de la app. Centra el contenido en pantalla, pone el encabezado y deja el mensaje legal al pie.
- `EntradaUrl.tsx` y `EntradaUrl.css`: es el formulario donde el usuario pone la URL. Tiene el campo de texto, el boton para pegar directo desde el portapapeles y el boton de verificar.
- `SemaforoRiesgo.tsx` y `SemaforoRiesgo.css`: es la tarjeta que muestra el resultado del analisis con su color (verde, amarillo o rojo), icono, mensaje explicativo y la URL original si fue expandida.
- `ListaHistorial.tsx` y `ListaHistorial.css`: muestra la lista con los ultimos 5 links que se analizaron, con su punto de color y estado correspondiente.

### Logica y estado (`src/hooks/`)

- `useAnalisis.ts`: custom hook que maneja el ciclo de vida de la consulta (estados de cargando, datos recibidos y mensaje de error) para que la vista quede limpia sin logica mezclada.

### Servicios de red (`src/services/`)

- `servicioAnalisis.ts`: contiene la funcion que hace la peticion POST con fetch nativo al backend en Render (`https://guardian-kpfs.onrender.com/api/v1/analyze`) y una funcion para chequear si el formato de la URL es valido.

### Utilidades y funciones puras (`src/utils/`)

- `semaforo.ts`: funcion que procesa la respuesta del backend y revisa los datos de VirusTotal y Google Safe Browsing para definir si el semaforo tiene que ser verde, amarillo o rojo.
- `historial.ts`: funciones para guardar y leer los ultimos 5 links en el localStorage del navegador y disparar un evento para que la lista se actualice sola.

### Tipos (`src/types/`)

- `analisis.ts`: define las interfaces de TypeScript con la estructura exacta que manda y devuelve la API (`PeticionAnalisis`, `RespuestaAnalisis`, niveles de riesgo, etc.).

### Entrada y estilos globales

- `App.tsx`: componente principal que junta el hook de analisis con los componentes de input, semaforo e historial.
- `main.tsx`: archivo de arranque de React 19 donde se monta la app en el div `#root` y se registra el service worker de la PWA.
- `styles/base.css`: define las variables de color (verde, amarillo, rojo, fondo oscuro) y estilos base para toda la app.

---

## Como correr el proyecto

### Requisitos
- Node.js (version 18 o superior)
- npm

### Comandos

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Correr en modo desarrollo:
   ```bash
   npm run dev
   ```
   Se abre en `http://localhost:5173`.

3. Compilar para produccion:
   ```bash
   npm run build
   ```

4. Probar la version de produccion localmente:
   ```bash
   npm run preview
   ```

---

## Links de prueba para la demo

- Inexistente / No indexado (Amarillo): `http://dominio-sospechoso-ficticio-123456789.xy/`
- Malware de prueba (Rojo): `http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/`
- Sitio seguro real (Verde): `https://wikipedia.org`
