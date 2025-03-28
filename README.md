# 📌 API Backend - Proyecto Final

Este proyecto tiene un frontend! 
Tuve que desactivar redirecciones que tenia, porque me estaba arruinando los tests. Pero con agregar /login a la url, deberia poderse ver

# 📌 Descripción

Este es el backend del proyecto de e-commerce, diseñado para gestionar autenticación, productos, carritos de compras y generación de datos de prueba. Implementa JWT para autenticación, Winston para logging, y sigue el modelo de capas con DAO y DTO.

# 📌 Instalación y Configuración

Clonar el repositorio:

# Instalar dependencias:

npm install

# correr

npm start

correr frontend http://localhost:8080

# variables de entorno:
Normalmente no se incluiria un .env, pero para poder hacer esta entrega, no se lo incluyo en el git ignore

Ejecutar en modo desarrollo:

npm start

# 📌 Endpoints Principales

## 🔹 1. Sesiones (`/api/sessions/`)

| Método  | Ruta                                    | Descripción                                  |
|---------|-----------------------------------------|----------------------------------------------|
| **POST** | `/api/sessions/`                      | Iniciar sesión con email y contraseña.      |
| **POST** | `/api/sessions/register`              | Registrar un nuevo usuario.                 |
| **GET**  | `/api/sessions/current`               | Obtener usuario autenticado mediante JWT.   |
| **POST** | `/api/sessions/reset-password/:token` | Restablecer contraseña.                     |
| **POST** | `/api/sessions/forgot-password`       | Solicitar recuperación de contraseña.       |

## 🔹 2. Productos (`/api/products/`)

| Método  | Ruta                   | Descripción                           |
|---------|------------------------|---------------------------------------|
| **GET**  | `/api/products/`      | Listar productos. |
| **GET**  | `/api/products/:pid`  | Obtener detalles de un producto. |
| **POST** | `/api/products/`      | Agregar un producto (**Solo Admin**). |
| **PUT**  | `/api/products/:pid`  | Actualizar un producto (**Solo Admin**). |
| **DELETE** | `/api/products/:pid` | Eliminar un producto (**Solo Admin**). |

## 🔹 3. Carritos de Compras (`/api/carts/`)

| Método  | Ruta                               | Descripción                           |
|---------|------------------------------------|---------------------------------------|
| **POST** | `/api/carts/`                    | Crear un nuevo carrito.               |
| **GET**  | `/api/carts/my-cart`             | Obtener el carrito del usuario autenticado. |
| **GET**  | `/api/carts/:cid`                | Obtener un carrito por su ID. |
| **POST** | `/api/carts/:cid/product/:pid`   | Agregar un producto al carrito.       |
| **DELETE** | `/api/carts/:cid/product/:pid` | Eliminar un producto del carrito.     |
| **POST** | `/api/carts/:cid/checkout`       | Finalizar compra del carrito.         |

## 🔹 4. Tickets (`/api/tickets/`)

| Método  | Ruta                     | Descripción                        |
|---------|--------------------------|------------------------------------|
| **POST** | `/api/tickets/`         | Generar un ticket de compra.      |
| **GET**  | `/api/tickets/{ticketId}` | Obtener un ticket por su ID.      |

## 🔹 5. Vistas (`/`)

| Método  | Ruta                | Descripción                           |
|---------|---------------------|---------------------------------------|
| **GET**  | `/`               | Redirige según el rol del usuario.    |
| **GET**  | `/catalog`        | Renderiza el catálogo de productos.   |
| **GET**  | `/login`          | Renderiza la vista de login.          |
| **GET**  | `/register`       | Renderiza la vista de registro.       |
| **GET**  | `/forgot-password` | Renderiza la vista para recuperar contraseña. |
| **GET**  | `/reset-password/:token` | Renderiza la vista para restablecer la contraseña. |
| **GET**  | `/admin-catalog`  | Renderiza la vista de administración de productos (**Solo Admin**). |



# 📌 Funcionalidades Adicionales

✅ Autenticación con JWT
✅ Middleware de autorización
✅ Persistencia con MongoDB y DAO
✅ Logging con Winston
✅ Sistema de Mocking para pruebas


# 📌 Contacto

Para consultas, contacta a: gonza248@gmail.com

