# 🚀 Instrucciones de Ejecución - ESCOMBOT

Guía rápida y precisa para ejecutar el proyecto localmente.

---

## Requisitos Previos

- **Node.js 18+** instalado
- **npm** (viene con Node.js)
- **Base de datos PostgreSQL** (local o remoto)
- Variable de entorno `.env.local` configurada

---

## Paso 1: Descargar Dependencias

```bash
npm install
```

Esto instala todas las dependencias del proyecto incluyendo Next.js, Prisma, React, etc.

---

## Paso 2: Configurar Base de Datos

### 2.1 Crear archivo `.env.local` en la carpeta `escombot/`

```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/escombot
NODE_ENV=development
```

Reemplaza:
- `usuario` con tu usuario de PostgreSQL
- `contraseña` con tu contraseña
- Asegúrate de que la base de datos `escombot` exista

### 2.2 Ejecutar script de inicialización de base de datos

```bash
npm run setup-db
```

Este comando:
- Genera el cliente Prisma
- Ejecuta las migraciones
- Planta datos de prueba (seed.js)

---

## Paso 3: Ejecutar el Proyecto

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## ✅ ¡Listo!

El proyecto está corriendo. Puedes:
- Acceder a http://localhost:3000 en tu navegador
- Ver logs de desarrollo en la terminal
- Los cambios en archivos se recargan automáticamente

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Ejecutar proyecto en modo desarrollo |
| `npm run build` | Compilar para producción |
| `npm run prisma:studio` | Abrir Prisma Studio (interfaz gráfica de BD) |
| `npm run prisma:migrate -- --name migracion` | Crear nueva migración |
| `npm run db:seed` | Ejecutar seed de datos |

---

## Solución de Problemas

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo
- Revisa que `DATABASE_URL` en `.env.local` sea correcto
- Asegúrate de que la base de datos exista

### Error "Prisma client not found"
```bash
npm run prisma:generate
```

### Puerto 3000 en uso
```bash
npm run dev -- -p 3001
```

---

**¡Hecho! Tu ESCOMBOT está listo para usar.**
