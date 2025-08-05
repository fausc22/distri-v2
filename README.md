# Distri-v2 - Sistema de gestión para distribuidora

Distri-v2 es una aplicación web integral para la gestión de una distribuidora, desarrollada con tecnologías modernas para facilitar el control de productos, clientes, ventas y stock.

---

## 🚀 Tecnologías utilizadas

- **Frontend:** Next.js, React, Ant Design  
- **Backend:** Node.js, Express  
- **Base de datos:** PostgreSQL  
- **ORM:** Prisma  
- **Autenticación:** JWT  
- **Despliegue:** Railway (opcional)

---

## 📋 Características principales

- Gestión de productos y categorías  
- Control de stock e inventario  
- Registro y gestión de clientes  
- Gestión de ventas y facturación  
- Sistema de autenticación y roles de usuario  
- Reportes básicos de ventas e inventario

---

## 📥 Instalación y ejecución local

1. Clonar el repositorio  
```bash
git clone https://github.com/fausc22/distri-v2.git
cd distri-v2
Instalar dependencias para frontend y backend

bash
Copiar
Editar
npm install
cd client
npm install
Configurar variables de entorno
Crea un archivo .env en la raíz con las variables necesarias (ejemplo):

ini
Copiar
Editar
DATABASE_URL=postgresql://usuario:password@localhost:5432/dbname
JWT_SECRET=tu_secreto
Ejecutar migraciones de Prisma

bash
Copiar
Editar
npx prisma migrate dev --name init
Ejecutar backend y frontend en desarrollo

bash
Copiar
Editar
npm run dev     # para backend
cd client
npm run dev     # para frontend
La app debería estar disponible en http://localhost:3000

📚 Uso
Acceder a la aplicación con usuario y contraseña (crear usuario admin manualmente en BD la primera vez)

Navegar entre los módulos de productos, clientes y ventas

Crear, editar y eliminar registros según permisos

Visualizar reportes básicos desde el dashboard

🛠 Estructura del proyecto
/client: frontend en Next.js y React

/server: backend en Node.js y Express

/prisma: esquema de la base de datos y migraciones

🤝 Contribuciones
Este proyecto está en desarrollo activo.
Para contribuir:

Abrí un issue para sugerir mejoras o reportar bugs

Enviar pull requests con cambios claros y documentados

📄 Licencia
Este proyecto está bajo licencia MIT.

¡Gracias por interesarte en Distri-v2! Cualquier duda, contactame.
