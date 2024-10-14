# Chatroom App

Esta es una aplicación de chatroom en tiempo real construida con Express y WebSockets en el backend, y Vite en el frontend.

## Características

- Comunicación en tiempo real entre usuarios.
- WebSockets para la transmisión instantánea de mensajes.
- Interfaz ligera y rápida con Vite.
- Backend basado en Express.

## Requisitos

- Node.js (v14 o superior)
- NPM o Yarn

## Instalación

1. Clona este repositorio:

    ```bash
    git clone https://github.com/Xonazo/ChatRoomApp.git
    cd ChatRoomApp
    ```

2. Instala las dependencias tanto en el backend como en el frontend.

    - Para el backend:
      ```bash
      cd backend
      npm install
      ```

    - Para el frontend:
      ```bash
      cd frontend
      npm install
      ```

## Configuración de Entorno

Antes de iniciar la aplicación, asegúrate de configurar los archivos `.env` tanto en el backend como en el frontend.

### Backend

En el directorio `backend`, crea un archivo `.env` y agrega lo siguiente:

    PORT=<puerto_backend> HOST=<url_frontend>

Por ejemplo:


    PORT=3001
    HOST=https://example-frontend-url.com


### Frontend

En el directorio `frontend`, crea un archivo `.env` y agrega lo siguiente:

    VITE_BACKEND_HOST=<url_backend>


Por ejemplo:

    VITE_BACKEND_HOST=https://example-backend-url.com


## Uso

1. Ejecuta el backend:

    ```bash
    cd backend
    npm run dev
    ```

   Esto iniciará el servidor de Express en el puerto definido en el archivo `.env` (por defecto 3001).

2. Ejecuta el frontend:

    ```bash
    cd frontend
    npm run dev
    ```

   Esto levantará la aplicación en modo desarrollo con Vite, usualmente en `http://localhost:5173`.

## Arquitectura

- **Backend (Express + WebSockets):** El servidor está construido usando Express, y la comunicación en tiempo real se gestiona con WebSockets.
  
- **Frontend (Vite):** El frontend está construido con Vite, que proporciona una interfaz de usuario que se comunica con el servidor usando WebSockets.
## Scripts

- `npm run dev` – Inicia el servidor de Express.
- `npm run dev` – Inicia el frontend en modo de desarrollo.

## Contribuciones

Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama con tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Envía tu rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.
