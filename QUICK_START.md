# 🚀 GUÍA RÁPIDA - Instalación de ESCOMBOT

## Paso 1: Instalar dependencias

```bash
cd c:\Users\jebed\Documents\Escom\FEPI\ESCOMbot\escombot
npm install
```

Esto instala:
- `@prisma/client` - ORM para BD
- `prisma` - CLI de Prisma
- `bcryptjs` - Hash de contraseñas
- Otras dependencias del proyecto

---

## Paso 2: Configurar base de datos

### Opción A: Automático con Prisma (Recomendado)

```bash
npm run setup-db
```

Este comando:
1. Genera el cliente de Prisma
2. Crea las tablas en PostgreSQL
3. Inserta usuario de prueba

### Opción B: Manual con SQL

Abre `psql` o tu cliente SQL favorito y ejecuta:

```sql
-- Copiar y ejecutar el contenido de: prisma/init.sql
```

O por línea de comandos:
```bash
psql -U tu_usuario -d escombot -f prisma/init.sql
```

---

## Paso 3: Variables de entorno

Crea el archivo `.env.local` en la carpeta `escombot/`:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://tu_usuario:tu_contraseña@localhost:5432/escombot"

# API de OpenAI (o tu LLM preferido)
API_URL="https://api.openai.com/v1/chat/completions"
API_KEY="sk-tu-api-key-aqui"
MODEL="gpt-3.5-turbo"

# Prompt del sistema
SYSTEM_PROMPT="Eres ESCOMBOT, un asistente virtual escolar especializado en ayudar a estudiantes con información sobre inscripciones, constancias, reglamentos escolares y más. Responde de manera amable y clara."
```

---

## Paso 4: Ejecutar en desarrollo

```bash
npm run dev
```

Accede a: **http://localhost:3000**

---

## Credenciales de prueba

```
Email: test@example.com
Contraseña: password123
```

---

## ✅ Verificación

Después de ejecutar los pasos anteriores, deberías ver:

1. ✅ Next.js dev server corriendo en puerto 3000
2. ✅ Página de ESCOMBOT con botón "Iniciar sesión"
3. ✅ Login modal funcional
4. ✅ Sidebar con lista de chats (vacío inicialmente)
5. ✅ Interface de chat funcional

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar servidor (después de build)
npm start

# Prisma Studio (GUI para la BD)
npm run prisma:studio

# Linting
npm run lint

# Generar cliente de Prisma (si falta)
npm run prisma:generate

# Ejecutar migraciones nuevas
npm run prisma:migrate
```

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL environment variable not found"
- Crea el archivo `.env.local` en la carpeta `escombot/`
- Verifica que tenga la variable `DATABASE_URL`

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL no está corriendo
- **Windows**: Abre Services y busca "PostgreSQL", inicia el servicio
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

### Error: "relation 'users' does not exist"
- Ejecuta: `npm run setup-db`
- O copia el SQL de `prisma/init.sql` a tu cliente

### Login no funciona
- Verifica que el usuario de prueba existe en BD
- Abre Prisma Studio: `npm run prisma:studio`
- Verifica la tabla `users` y el email

### El chat no guarda mensajes
- Verifica la conexión a BD (error arriba)
- Asegúrate de que `API_URL`, `API_KEY`, `MODEL` están en `.env.local`
- Revisa la consola del servidor (npm run dev) para errores

---

## Estructura de carpetas importante

```
escombot/
├── .env.local          ← Crear este archivo
├── app/
│   ├── api/           ← API routes
│   ├── page.tsx       ← Página principal
│   └── layout.tsx
├── components/        ← Componentes React
├── services/          ← db.ts, chatService.ts
├── types/             ← chat.ts
├── prisma/
│   ├── schema.prisma  ← Esquema de BD
│   └── init.sql       ← SQL manual
└── package.json
```

---

## 📱 Características funcionales

✨ **Login/Logout** - Con email y contraseña  
✨ **Historial de chats** - Sidebar con conversaciones  
✨ **Crear nuevo chat** - Botón en sidebar  
✨ **Persistencia** - Todos los datos se guardan en BD  
✨ **Roles de mensaje** - Usuario/Bot identificados  
✨ **Responsive** - Funciona en móvil y desktop  

---

## 🎯 Siguiente paso

Una vez que todo funcione:

1. Personaliza el `SYSTEM_PROMPT` para tu caso específico
2. Agrega más usuarios
3. Personaliza colores y estilos
4. Implementa más funcionalidades

---

**¡Listo! El proyecto está completamente configurado.** 🎉

Si tienes dudas, revisa:
- [SETUP.md](./SETUP.md) - Guía detallada
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Detalles técnicos
