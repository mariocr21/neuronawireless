# Neurona Wireless - Frontend Moderno

Este repositorio contiene la versión moderna (Vite + Vue 3) de la Interfaz de Usuario para el sistema de monitoreo agrícola **Neurona Wireless**. 

El objetivo de este proyecto es centralizar la visualización de datos emitidos por los nodos y estaciones climáticas (temperatura, humedad, estrés hídrico y demás parámetros críticos en campo) mediante un diseño vanguardista de estética Neumórfica Oscura y *Glassmorphism*.

---

## 🛠️ Stack Tecnológico

*   **Core**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Construcción y Servidor**: [Vite](https://vitejs.dev/)
*   **Estilos y UI**: [Tailwind CSS](https://tailwindcss.com/)
*   **Enrutador**: [Vue Router 4](https://router.vuejs.org/)
*   **Control de Estado Global**: [Pinia](https://pinia.vuejs.org/)
*   **Cliente HTTP**: [Axios](https://axios-http.com/)
*   **Visualización de Datos**: [Vue3-ApexCharts](https://apexcharts.com/docs/vue-charts/) (v5.10+)

---

## 🏗️ Arquitectura y Estructura

Esta aplicación fue construida como una **Single Page Application (SPA)** 100% desacoplada. Todo el flujo de datos dinámico se obtiene a través de interceptores con JSON Web Tokens (JWT) conectados a la API principal construida tradicionalmente en Laravel (`backend-api`).

### Principales Directorios

*   `/src/main.js` - Punto de entrada de la aplicación Vue.
*   `/src/App.vue` - Cascarón principal de la app que contiene el Navbar superior y el conector global de la sesión.
*   `/src/views/` - Contiene las páginas principales:
    *   `Login.vue` - Autenticación inmersiva.
    *   `Index.vue` - KPIs y Dashboard global.
    *   `Stations.vue` - Rejilla visual del estado de todos los Nodos.
    *   `Graphics.vue` - Motor de visualización y análisis de datos de sensores (`vue3-apexcharts`).
    *   `Alerts.vue` - Registro de eventos en tiempo real y reglas climáticas estipuladas.
*   `/src/services/api.js` - Central de Axios. Aquí se define el Interceptor global que adjunta el JWT del usuario de forma oculta en todas las cabeceras HTTP que viajan al backend.
*   `/src/stores/auth.js` - Almacén global (Pinia Store) encargado de manejar, mantener o destruir la sesión lógica del usuario.

---

## 🚀 Entorno de Desarrollo (Local)

Para correr este proyecto en tu entorno local:

1.  Asegúrate de clonar/posicionarte en esta carpeta (`/frontend-modern`).
2.  Instala las dependencias del motor:
    ```bash
    npm install
    ```
3.  (Opcional) Crea un archivo `.env` en la raíz de esta carpeta para definir hacia qué entorno del *Backend* deseas apuntar. Por defecto, en desarrollo el proxy (configurado en `vite.config.js`) apunta a `https://neuronawireless.com/platform/api`.
    ```bash
    VITE_NEURONA_API_ENDPOINT="/api" 
    ```
4.  Levanta el servidor con recarga en caliente (Hot Module Replacement):
    ```bash
    npm run dev
    ```

---

## ⚙️ Despliegue en Producción (Cloudflare Pages)

Este frontend está explícitamente optimizado para ser compilado y repartido estáticamente en la red Edge inteligente de **Cloudflare**.

Para lanzar una nueva actualización a producción:

1.  Estando en esta carpeta, sube los cambios vía Git a la rama `main`:
    ```bash
    git add .
    git commit -m "feat(modulo): descripción de los cambios"
    git push origin main
    ```
2.  Cloudflare interceptará automáticamente el Webhook del repositorio de GitHub y comenzará su Build Step.
3.  **Configuración requerida en panel de Cloudflare:**
    *   **Framework Preset**: `Vue` o `Vite`.
    *   **Build command**: `npm run build`
    *   **Build directory**: `dist`
4.  **Proxy same-origin con Pages Functions**:
    *   Este proyecto ya incluye funciones en `/functions/api`, `/functions/app` y `/functions/broadcasting` para reenviar tráfico al backend productivo bajo `https://neuronawireless.com/platform`.
    *   En Pages, mantén el frontend apuntando a rutas relativas (`/api`, `/app`, `/broadcasting`) para evitar CORS.
    *   No sobrescribas `VITE_NEURONA_API_ENDPOINT` con una URL absoluta si quieres que el proxy de Cloudflare absorba las peticiones.

---

## 📜 Reglas de Diseño UI/UX
Para los futuros desarrolladores o inteligencias artificiales que intervengan este proyecto, es mandatorio respetar la **Guía de Estilos Corporativa**:
- **Aesthetic Core**: *Dark Neumorphism*.
- Mantener siempre colores neutrales sombríos para fondos (ej. `#252625`).
- Usar exclusivamente `brand-green` (`#0ba703`) o `brand-green-light` (`#0fff00`) como acentos de botones, acciones, toggles, animaciones ("Glows") e indicadores activos de la app.
- Todas las tarjetas (Cards) o contenedores semitransparentes deben obligatoriamente heredar de la clase genérica `.glass-panel` definida centralizadamente en `src/index.css`.
