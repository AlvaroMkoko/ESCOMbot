# ESCOMBOT - Asistente Virtual Escolar

## Instalación y Configuración

### 1. **Requisitos previos**

- Node.js 18+ (recomendado: 20+)
- PostgreSQL 12+
- npm o yarn

### 2. **Configurar variables de entorno**

Copia `.env.example` a `.env.local` y configura:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/escombot"

# API del LLM (ej: OpenAI)
API_URL="https://api.openai.com/v1/chat/completions"
API_KEY="tu_api_key"
MODEL="gpt-3.5-turbo"

SYSTEM_PROMPT="Eres ESCOMBOT, asistente virtual escolar..."
```

### 3. **Instalar dependencias**

```bash
npm install
```

### 4. **Configurar la base de datos**

#### Opción A: Usando Prisma migrations (recomendado)

```bash
npm run setup-db
```

Esto ejecutará:
- `prisma generate` - Genera el cliente de Prisma
- `prisma migrate dev --name init` - Crea las tablas en la BD

#### Opción B: Ejecutar SQL manualmente

Si prefieres crear las tablas manualmente:

1. Conéctate a PostgreSQL:
```bash
psql -U usuario -d escombot -f prisma/init.sql
```

O copia el contenido de `prisma/init.sql` en tu cliente SQL favorito.

### 5. **Ejecutar en desarrollo**

```bash
npm run dev
```

Accede a: [http://localhost:3000](http://localhost:3000)

### 6. **Usuario de prueba**

Usuario: `test@example.com`
Contraseña: `password123`

---

## Estructura del Proyecto

```
escombot/
├── app/
│   ├── api/
│   │   ├── login/          # POST /api/login
│   │   ├── chats/          # GET/POST /api/chats
│   │   ├── chats/[id]/messages/  # GET /api/chats/:id/messages
│   │   └── messages/       # POST /api/messages
│   ├── layout.tsx
│   ├── page.tsx            # Página principal
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx   # Interfaz de chat
│   ├── Header.tsx          # Header con login
│   ├── LoginModal.tsx      # Modal de autenticación
│   └── Sidebar.tsx         # Historial de chats
├── services/
│   ├── db.ts              # Cliente de Prisma singleton
│   └── chatService.ts     # Servicio de LLM
├── types/
│   └── chat.ts            # Tipos TypeScript
├── prisma/
│   ├── schema.prisma      # Esquema de Prisma
│   ├── init.sql          # SQL manual
│   └── migrations/        # Migraciones automáticas
└── package.json
```

---

## Características implementadas

✅ **Autenticación simple** - Login con email/contraseña  
✅ **Historial de chats** - Sidebar con conversaciones del usuario  
✅ **Persistencia de datos** - BD PostgreSQL con Prisma  
✅ **API REST** - Endpoints para login, chats y mensajes  
✅ **Mapeo de roles** - Frontend usa 'bot', BD usa 'assistant'  
✅ **Sesiones con cookies** - Autenticación basada en userId  
✅ **Diseño responsivo** - Interfaz mobile-friendly  

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Prisma
npm run prisma:generate   # Generar cliente
npm run prisma:migrate    # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio (GUI)

# Linting
npm run lint
```

---

## Notas importantes

- **No usar NextAuth**: Se implementó autenticación simple con cookies
- **Mapeo de roles**: 
  - Frontend: `'bot'`
  - Base de datos: `'assistant'`
  - Las APIs hacen la conversión automáticamente
- **Seguridad**: En producción, configura `secure: true` en cookies HTTPS
- **Variables de entorno**: Nunca commits `.env.local`, solo `.env.example`

---

## Troubleshooting

### Error: "Missing required environment variables"
Verifica que `.env.local` contiene `DATABASE_URL`, `API_URL`, `API_KEY`, `MODEL`

### Error: "Connect ECONNREFUSED 127.0.0.1:5432"
PostgreSQL no está corriendo. Inicia el servicio:
```bash
# macOS
brew services start postgresql

# Windows (si instalaste como servicio)
net start PostgreSQL
```

### Error: "relation 'users' does not exist"
Ejecuta las migraciones:
```bash
npm run setup-db
```

### Cookies no se guardan
Asegúrate de que estés usando `http://localhost` en desarrollo (no `127.0.0.1`)

---

¡Listo! El proyecto está configurado y listo para usar. 🚀
