# My List To Do

🟦 Descripción breve del problema que resuelve
Este proyecto es una aplicación web de gestión de tareas personales ("To-Do List") que permite a cualquier usuario organizar y priorizar sus pendientes de forma segura y sencilla desde cualquier dispositivo.
Resuelve el problema de la gestión dispersa y poco segura de tareas, ofreciendo una experiencia centralizada, moderna y accesible, donde cada usuario puede controlar su lista privada de tareas y acceder a funcionalidades avanzadas de administración de su cuenta.

🟦 Funcionalidades implementadas
Registro de usuarios con confirmación por correo electrónico

Seguridad y control: solo usuarios con email verificado pueden acceder.

Autenticación segura (login) con protección de rutas

Acceso solo para usuarios autenticados.

CRUD completo de tareas (Create, Read, Update, Delete)

Cada usuario ve solo sus tareas.

Recuperación de contraseña

Solicitud y restablecimiento seguro mediante correo electrónico.

Reenvío de correo de confirmación

Si el usuario no confirma a tiempo, puede pedir un nuevo email fácilmente.

Eliminación de cuenta

El usuario puede borrar permanentemente su perfil y todos sus datos.

Limpieza automática de cuentas no confirmadas

La base de datos se mantiene libre de registros obsoletos.

Interfaz responsive y diseño neuromórfico

Experiencia moderna y agradable en desktop, tablet y móvil.

Mensajes de feedback en cada acción

El usuario recibe avisos claros en cada paso: errores, confirmaciones, etc.

🟦 Lenguajes y tecnologías utilizadas
Frontend:

React (con Vite) para la interfaz y la lógica del cliente.

CSS clásico para el diseño, con componentes personalizados neuromórficos.

Backend:

FastAPI para la API REST y la lógica de negocio.

SQLAlchemy para ORM y manejo de la base de datos.

Alembic para migraciones.

PostgreSQL como base de datos relacional (desplegada en Render).

Correo electrónico vía SMTP para confirmaciones y recuperación.

Otras tecnologías:

JWT para autenticación segura.

Render (backend) y Vercel (frontend) como plataformas de despliegue.

Git/GitHub para control de versiones.

## Enlaces

- Frontend: https://my-list-to-do-delta.vercel.app
- Backend: https://my-list-to-do.onrender.com/docs
