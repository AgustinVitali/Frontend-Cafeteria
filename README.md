# Frontend Cafetería Online

Frontend de una aplicación de cafetería online construida con React, TypeScript y Tailwind CSS.

## Funcionalidades

### Autenticación

- ✅ Login/Logout con Auth0
- ✅ Gestión de roles (cliente, barista, admin)
- ✅ Protección de rutas según roles

### Funcionalidades por Rol

#### Vista Pública (sin autenticación)

- ✅ Ver menú público
- ✅ Botón para iniciar sesión

#### Cliente (autenticado)

- ✅ Ver menú completo
- ✅ Agregar productos al carrito
- ✅ Realizar pedidos
- ✅ Ver historial de pedidos propios

#### Barista (autenticado)

- ✅ Ver todos los pedidos
- ✅ Actualizar estado de pedidos (pendiente → en preparación → completado)
- ✅ Cancelar pedidos

#### Admin (autenticado)

- ✅ Todas las funcionalidades de barista
- ✅ Agregar nuevos productos al menú
- ✅ Editar productos existentes
- ✅ Eliminar productos del menú

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Auth0** - Autenticación y autorización
- **React Router** - Enrutamiento
- **Vite/Create React App** - Herramientas de desarrollo

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

4. Configura las variables de entorno en `.env`:

   ```
   REACT_APP_AUTH0_DOMAIN=tu-dominio.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=tu-client-id
   REACT_APP_AUTH0_AUDIENCE=http://localhost:8080
   REACT_APP_API_URL=http://localhost:8080
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## Configuración de Auth0

1. Crea una aplicación en Auth0
2. Configura las siguientes URLs:

   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

3. Crea un API en Auth0 con identificador `http://localhost:8080`

4. Configura los roles en Auth0:

   - `admin` - Acceso completo
   - `barista` - Gestión de pedidos
   - `cliente` - Realizar pedidos

5. Agrega los roles al token JWT usando Actions o Rules:
   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = "https://cafeteria.com/roles";
     const assignedRoles = event.authorization.roles;
     api.idToken.setCustomClaim(namespace, assignedRoles);
     api.accessToken.setCustomClaim(namespace, assignedRoles);
   };
   ```

## Estructura del Proyecto

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminView.tsx
│   │   └── MenuItemForm.tsx
│   ├── Auth/
│   │   ├── LoginButton.tsx
│   │   └── LogoutButton.tsx
│   ├── Layout/
│   │   └── Header.tsx
│   ├── Menu/
│   │   ├── MenuView.tsx
│   │   └── MenuCard.tsx
│   └── Orders/
│       ├── OrdersView.tsx
│       └── OrderCard.tsx
├── config/
│   └── auth0.ts
├── hooks/
│   └── useAuth.ts
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.tsx
└── index.css
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run eject` - Expulsa la configuración de Create React App

## Conexión con el Backend

El frontend está configurado para conectarse con un backend Java que debe estar ejecutándose en `http://localhost:8080`.

Los endpoints esperados son:

- `GET /public/menu` - Menú público
- `POST /private/orders` - Crear pedido
- `GET /private/orders` - Obtener todos los pedidos (barista/admin)
- `GET /private/orders/my` - Obtener pedidos del usuario (cliente)
- `PUT /private/orders/:id/status` - Actualizar estado del pedido
- `GET /private/menu` - Menú completo (admin)
- `POST /private/menu` - Agregar producto (admin)
- `PUT /private/menu/:id` - Actualizar producto (admin)
- `DELETE /private/menu/:id` - Eliminar producto (admin)

## Configuración de variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Asegúrate de que el backend esté corriendo en ese puerto. Si usas otro, actualiza la URL.

## Licencia

Este proyecto es privado y no tiene licencia pública.
