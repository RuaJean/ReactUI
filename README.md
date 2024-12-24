Este proyecto corresponde al **frontend** de la aplicación de gestión de usuarios, empleados y solicitudes. Está desarrollado con **React** y consume la API REST del **backend** en Node.js.

## Tabla de Contenido

1. [Características Principales](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
2. [Requisitos](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
3. [Instalación y Ejecución (Local)](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
4. [Docker y Despliegue Completo](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
    - [Estructura de Carpetas](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
    - [Dockerfiles](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
    - [docker-compose.yml](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
    - [Pasos de Despliegue](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
5. [Mejores Prácticas](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
6. [Seguridad](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)
7. [Licencia](https://www.notion.so/ReactUI-Prueba-T-cnica-160352ef148e804699b1f0756ef21210?pvs=21)

---

## Características Principales

- **Autenticación** con JWT (vía backend).
- **Roles** diferenciados (`administrador` y `empleado`).
- **Operaciones CRUD** (enlazadas al backend) para Empleados y Solicitudes.
- **Context API** para manejo global del estado de autenticación.
- **Testing** básico con Jest/React Testing Library (opcional).
- **Docker**: Despliegue de frontend y backend en contenedores separados.

---

## Requisitos

- **Node.js** v14+
- **npm**
- **Backend** en Node.js [Repositorio](https://github.com/RuaJean/node_jwt_api)
- **Docker** y **docker-compose** para levantar contenedores

---

## Instalación y Ejecución (Local)

1. **Clona este repositorio**:
    
    ```bash
    git clone https://github.com/RuaJean/ReactUI.git
    cd ReactUI
    
    ```
    
2. **Instala dependencias**:
    
    ```bash
    npm install
    
    ```
    
3. **Configura la variable de entorno** (si tu backend corre en [http://localhost:3001](http://localhost:3001/)):
    - Crea un archivo `.env` en la raíz de `ReactUI/`:
        
        ```bash
        REACT_APP_BACKEND_URL=http://localhost:3001
        
        ```
        
4. **Inicia la aplicación en modo desarrollo**:
    
    ```bash
    npm start
    
    ```
    
    - La app estará disponible en [http://localhost:3000](http://localhost:3000/)
5. (Opcional) **Ejecuta pruebas**:
    
    ```bash
    npm test
    
    ```
    

---

## Docker y Despliegue Completo

En caso de querer **dockerizar** tanto el **frontend** como el **backend** (y la base de datos PostgreSQL), sigue estos pasos. Asumimos que:

- Tienes dos repos locales, por ejemplo:
    
    ```scss
    mi_proyecto/
      ├── node_jwt_api/   (backend)
      └── ReactUI/        (frontend)
    
    ```
    
- Has creado un archivo `docker-compose.yml` en `mi_proyecto/`.

### Estructura de Carpetas

Ejemplo de la estructura tras clonar ambos repos:

```bash

mi_proyecto/
├── node_jwt_api
│   ├── Dockerfile        # Dockerfile del backend
│   ├── .env             # DB_URL, JWT_SECRET, PORT
│   ├── db.sql
│   ├── data.sql
│   └── ...
├── ReactUI
│   ├── Dockerfile        # Dockerfile del frontend
│   ├── .env             # REACT_APP_BACKEND_URL
│   ├── src
│   └── ...
└── docker-compose.yml

```

### Dockerfiles

### 1. Dockerfile del Backend (node_jwt_api/Dockerfile)

```
dockerfile
Copiar código
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD ["npm", "start"]

```

### 2. Dockerfile del Frontend (ReactUI/Dockerfile)

```
dockerfile
Copiar código
# Etapa de build
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

```

### docker-compose.yml

Ejemplo de `docker-compose.yml` para levantar la **DB**, **backend** y **frontend**:

```yaml
yaml
Copiar código
version: "3.9"
services:
  db:
    image: postgres:14
    container_name: empresa_db
    environment:
      - POSTGRES_DB=empresa
      - POSTGRES_USER=jeanrua
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jeanrua -d empresa || exit 1"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./node_jwt_api
      dockerfile: Dockerfile
    container_name: empresa_backend
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3001:3001"
    environment:
      - DB_URL=postgres://jeanrua:postgres@db:5432/empresa
      - JWT_SECRET=nor0TuF0BmjUoaiqkD3h
      - PORT=3001

  frontend:
    build:
      context: ./ReactUI
      dockerfile: Dockerfile
    container_name: empresa_frontend
    depends_on:
      - backend
    ports:
      - "3000:80"

volumes:
  db_data:

```

### Pasos de Despliegue

1. **Clona ambos repos** y ubícalos en la misma carpeta (`mi_proyecto/`).
2. **Crea** el archivo `docker-compose.yml` en esa carpeta raíz (junto a `node_jwt_api` y `ReactUI`).
3. (Opcional) Ajusta las variables de entorno en `.env` y en `docker-compose.yml` para que el frontend apunte a `http://localhost:3001`.
4. **Construye** los contenedores:
    
    ```bash
    
    docker-compose build
    
    ```
    
5. **Levanta** todo en background:
    
    ```bash
    
    docker-compose up -d
    
    ```
    
6. Verifica la salida de logs:
    
    ```bash
    
    docker-compose logs -f
    
    ```
    
7. Abre en tu navegador:
    - **Frontend**: [http://localhost:3000](http://localhost:3000/)
    - **Backend**: [http://localhost:3001](http://localhost:3001/)
    - **Base de datos**: Puerto 5432

---

## Mejores Prácticas

1. **Separación de Responsabilidades**
    - El **backend** se encarga de la lógica de negocios y la persistencia de datos.
    - El **frontend** maneja la interfaz de usuario y la lógica de presentación (SPA con React).
2. **Estructura Limpia**
    - Archivos de configuración (Docker, `.env`) separados y bien documentados.
    - Componentes React y vistas (páginas) organizados en directorios.
3. **Context API y Hooks**
    - Se aprovecha Context API para manejar la sesión (usuario, rol, token) de manera global.
    - Hooks (useEffect, useState, etc.) para un código más legible y conciso.
4. **Lazy Loading**
    - Se utiliza `React.lazy()` y `Suspense` para cargar bajo demanda las páginas más pesadas.
5. **Buenas Prácticas con Docker**
    - Imágenes ligeras (basadas en `node:alpine`).
    - Multi-stage build para el frontend (build y luego Nginx).

---

## Seguridad

1. **JWT**
    - El backend genera y valida el token en cada petición.
    - El frontend almacena el token en `localStorage` (opción rápida, aunque en entornos de alta seguridad se prefieren cookies HttpOnly).
2. **Roles**
    - La aplicación distingue entre `administrador` y `empleado`.
    - Las vistas restringidas (ej. registrar administrador, eliminar solicitudes) están protegidas en el frontend.
    - Además, el backend realiza una verificación extra para evitar accesos indebidos.
3. **Evitar Vulnerabilidades**
    - Se usa Axios interceptors para inyectar el token en cada petición.
    - El backend maneja las validaciones y sanitiza inputs para evitar inyecciones (SQL, XSS).
4. **Manejo de Credenciales**
    - Variables sensibles en `.env` (tanto en el backend como en docker-compose).
    - No se suben tokens o secrets al repositorio público.

###
