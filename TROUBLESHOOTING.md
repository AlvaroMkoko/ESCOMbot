# 🔧 Troubleshooting - ESCOMBOT

## Tabla de contenidos
1. [Errores de configuración](#errores-de-configuración)
2. [Errores de base de datos](#errores-de-base-de-datos)
3. [Errores de autenticación](#errores-de-autenticación)
4. [Errores de chat](#errores-de-chat)
5. [Errores de despliegue](#errores-de-despliegue)
6. [Performance](#performance)

---

## Errores de configuración

### Error: "Missing required environment variables"

**Causa:** Faltan variables en `.env.local`

**Solución:**
```bash
# Verifica que .env.local existe
ls -la .env.local

# Verifica que contiene:
cat .env.local
```

Debe tener:
```env
DATABASE_URL="postgresql://..."
API_URL="https://..."
API_KEY="sk-..."
MODEL="gpt-..."
SYSTEM_PROMPT="..."
```

**Reinicia:**
```bash
npm run dev
```

---

### Error: "Cannot find module @prisma/client"

**Causa:** Prisma no está instalado

**Solución:**
```bash
npm install @prisma/client prisma
npm run prisma:generate
```

---

### Error: "prisma.user.findUnique is not a function"

**Causa:** Cliente de Prisma no fue generado

**Solución:**
```bash
npm run prisma:generate
```

---

## Errores de base de datos

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Causa:** PostgreSQL no está corriendo

**Solución por SO:**

**Windows:**
```bash
# Abre Services.msc
# Busca "PostgreSQL"
# Clic derecho → Start

# O por PowerShell (como admin):
Start-Service -Name postgresql-x64-15

# Verificar estado:
Get-Service postgresql-x64-15
```

**macOS:**
```bash
# Si instalaste con Homebrew:
brew services start postgresql

# Verificar:
brew services list
```

**Linux:**
```bash
# Ubuntu/Debian:
sudo systemctl start postgresql

# Verificar:
sudo systemctl status postgresql
```

---

### Error: "FATAL: role 'usuario' does not exist"

**Causa:** El usuario PostgreSQL no existe

**Solución:**
```bash
# Lista usuarios:
psql -U postgres -l

# Crea usuario:
psql -U postgres -c "CREATE USER tu_usuario WITH PASSWORD 'tu_password';"

# Dale permisos:
psql -U postgres -c "ALTER USER tu_usuario CREATEDB;"

# Crea BD:
createdb -U postgres -O tu_usuario escombot
```

Luego actualiza `.env.local`:
```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/escombot"
```

---

### Error: "relation 'users' does not exist"

**Causa:** Las tablas no fueron creadas

**Solución:**

Opción A (Prisma):
```bash
npm run setup-db
```

Opción B (SQL manual):
```bash
# Copiar contenido de prisma/init.sql
psql -U tu_usuario -d escombot -f prisma/init.sql

# O ejecutar línea por línea:
psql -U tu_usuario -d escombot
# Luego pega el contenido de prisma/init.sql
```

---

### Error: "permission denied for schema public"

**Causa:** Usuario no tiene permisos

**Solución:**
```bash
psql -U postgres -d escombot
```

```sql
GRANT ALL PRIVILEGES ON SCHEMA public TO tu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
```

---

### Error: "disk quota exceeded" o "no space left on device"

**Causa:** Espacio en disco insuficiente

**Solución:**
```bash
# Verificar espacio:
df -h

# Limpiar caché:
npm cache clean --force

# Eliminar node_modules y reinstalar:
rm -rf node_modules package-lock.json
npm install
```

---

## Errores de autenticación

### Error: "Login no funciona" / Usuario no se autentica

**Debuggea:**

1. Verifica que el usuario existe:
```bash
npm run prisma:studio

# Abre http://localhost:5555
# Ve a tabla "users"
# ¿Hay algún registro?
```

2. Verifica la contraseña:
```bash
# Genera hash de la contraseña correcta:
npx ts-node scripts/hash-password.ts

# Actualiza en BD:
# En prisma studio, edita el usuario y copia el hash
```

3. Verifica logs:
```bash
# En terminal donde corre "npm run dev"
# ¿Hay errores al hacer login?
# ¿Se llama a la API?
```

4. Abre DevTools (F12):
```javascript
// Consola:
// ¿Hay errores?
// Copia el error completo
```

---

### Error: "Cookie no se guarda"

**Causa:** Navegador no acepta cookies

**Solución:**

**Chrome/Edge:**
1. DevTools → Application → Cookies
2. Debe aparecer `userId`
3. Si no aparece, verifica:
   - `document.cookie` en consola
   - Que no estés en `127.0.0.1` (usar `localhost`)
   - Que respuesta tenga header `Set-Cookie`

**Firefox:**
1. Settings → Privacy & Security
2. Cookies → Allow

---

### Error: "Unauthorized" al obtener chats

**Causa:** Sesión expirada o cookie perdida

**Solución:**
1. Haz login de nuevo
2. Verifica que cookie `userId` existe
3. Revisa que no caducó (7 días)

---

## Errores de chat

### Error: "Bot no responde" / No aparece respuesta

**Debuggea:**

1. Verifica conexión a API LLM:
```env
# .env.local
API_URL="https://api.openai.com/v1/chat/completions"
API_KEY="sk-..." # ¿Es válida?
MODEL="gpt-3.5-turbo"
```

2. Verifica logs del servidor:
```
npm run dev
# ¿Hay errores al enviar mensaje?
# ¿Qué responde la API?
```

3. Test manual de la API:
```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hola"}]
  }'
```

---

### Error: "message.botMessage is undefined"

**Causa:** Respuesta malformada del servidor

**Solución:**

Verifica que `POST /api/messages` retorna:
```json
{
  "userMessage": { ... },
  "botMessage": { ... }
}
```

No solo:
```json
{ "message": "..." }
```

Revisa [API_REFERENCE.md](./API_REFERENCE.md) para el formato correcto.

---

### Error: "Chat no se guarda"

**Causa:** Falla la inserción en BD

**Solución:**

1. Verifica error en consola (npm run dev)
2. Usa Prisma Studio para revisar BD:
```bash
npm run prisma:studio
```
3. Verifica que chatId es válido
4. Verifica que userId coincide

---

### Error: "Messages en el chat no cargan"

**Causa:** Error en `GET /api/chats/:id/messages`

**Solución:**

1. Verifica chatId es correcto (debe ser UUID)
2. Abre DevTools → Network
3. Click GET request a `/api/chats/...`
4. Ve "Response" para ver el error
5. Revisa BD si el chat existe

---

## Errores de despliegue

### Error: "Build fails with TypeScript errors"

**Solución:**
```bash
# Verifica tipos:
npx tsc --noEmit

# Corrige errores mostrados

# Reinicia build:
npm run build
```

---

### Error: "Cannot find module during build"

**Solución:**
```bash
# Regenera Prisma:
npm run prisma:generate

# Limpia caché:
rm -rf .next
npm run build
```

---

### Error: "DATABASE_URL not found in production"

**Solución:**

Para Vercel/Netlify/etc:
1. Crea variable de entorno en panel
2. Nombre: `DATABASE_URL`
3. Valor: Tu string de conexión
4. Redeploy

**No comitear `.env.local`**, solo `.env.example`

---

## Performance

### Problema: Consola lenta / Muchas queries a BD

**Optimización:**

1. Revisa query N+1:
```bash
npm run prisma:studio
# Revisa si hay muchas queries
```

2. Agrega índices:
```sql
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
```

3. Usa `select` en Prisma:
```typescript
const chats = await prisma.chat.findMany({
  where: { userId },
  select: { id: true, title: true }, // Solo campos necesarios
});
```

---

### Problema: Página se carga lentamente

**Optimización:**

1. Verifica BD connection:
```bash
# ¿Está en la misma máquina?
# ¿Latencia de red?
ping localhost
```

2. Revisa tamaño de respuestas:
```bash
# DevTools → Network
# ¿Cuánto pesa cada request?
# ¿Hay mucho contenido?
```

3. Aumenta timeout de Prisma:
```typescript
// services/db.ts
new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?schema=public&connection_limit=1",
    },
  },
});
```

---

### Problema: API lenta

**Debuggea:**

1. Mide tiempo de query:
```typescript
console.time("query");
const users = await prisma.user.findMany();
console.timeEnd("query");
```

2. Habilita query logging:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

3. Verifica índices en BD:
```sql
-- PostgreSQL
SELECT * FROM pg_indexes WHERE schemaname = 'public';
```

---

## Comandos útiles para debugging

```bash
# Ver logs de dev
npm run dev 2>&1 | tee logs.txt

# Generar cliente Prisma
npm run prisma:generate

# Abrir BD en GUI
npm run prisma:studio

# Ejecutar query en BD manualmente
psql -U usuario -d escombot

# Ver variables de entorno
env | grep DATABASE

# Probar conexión a BD
psql -U usuario -d escombot -c "SELECT 1;"

# Verificar qué está en npm
npm list | grep prisma

# Limpiar caché
npm cache clean --force

# Reinstalar todo
rm -rf node_modules package-lock.json && npm install
```

---

## Preguntas frecuentes

### ¿Por qué no puedo conectar a la BD?
Revisa que PostgreSQL esté corriendo y que `DATABASE_URL` sea correcta.

### ¿Cómo hago backup de la BD?
```bash
pg_dump -U usuario escombot > backup.sql
```

### ¿Cómo recupero un backup?
```bash
psql -U usuario escombot < backup.sql
```

### ¿Cómo cambio la contraseña de un usuario?
```bash
npm run prisma:studio
# Edita el usuario y copia el nuevo hash de `scripts/hash-password.ts`
```

### ¿Cómo veo todas las queries que se envían?
```typescript
// services/db.ts - descomenta:
log: ['query'],
```

---

## Contacto y Escalamiento

Si ninguna solución funciona:

1. **Revisa logs completos**
   ```bash
   # Copia toda la consola de error
   # Busca líneas que digan ERROR o FATAL
   ```

2. **Verifica archivos**
   ```bash
   # ¿Existen todos los archivos?
   ls -R app/api/
   ls -R components/
   ls -R services/
   ```

3. **Reinstala todo**
   ```bash
   rm -rf node_modules .next prisma/
   npm install
   npm run prisma:generate
   npm run dev
   ```

4. **Busca en la documentación**
   - [SETUP.md](./SETUP.md)
   - [IMPLEMENTATION.md](./IMPLEMENTATION.md)
   - [API_REFERENCE.md](./API_REFERENCE.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Última actualización:** Enero 2024
**Versión:** 1.0
