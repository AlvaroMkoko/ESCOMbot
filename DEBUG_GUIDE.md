# 🐛 Guía de Depuración - ESCOMBOT

## Errores Reportados

1. **"Unexpected token '<', "<!DOCTYPE "... is not valid JSON"**
   - El servidor está retornando HTML en lugar de JSON
   - Causa: Prisma Client no está generado O hay un error en la BD

2. **"El botón de inicio de sesión no sirve"**
   - Aparece y desaparece rápidamente
   - Causa: Lógica de autenticación con error

3. **"Error al crear chat" al enviar mensajes**
   - El endpoint POST /api/chats está fallando
   - Causa: userId no está siendo extraído correctamente de las cookies

---

## Solución Paso a Paso

### PASO 1: Verificar la Instalación

```bash
# Asegúrate de que estás en el directorio del proyecto
cd escombot

# Verifica que node_modules existe
npm list prisma

# Si no sale nada, necesitas instalar:
npm install
```

### PASO 2: Generar el Cliente de Prisma (MUY IMPORTANTE ⚠️)

Este es probablemente el problema raíz:

```bash
npx prisma generate
```

Deberías ver:
```
✔ Generated Prisma Client to ./node_modules/@prisma/client in XXms
```

Si ves error, probablemente es porque `.env.local` no está configurado correctamente.

### PASO 3: Verificar `.env.local`

El archivo `.env.local` debe existir con:

```dotenv
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/escombot"
API_URL="https://api.openai.com/v1/chat/completions"
API_KEY="tu_api_key"
MODEL="gpt-3.5-turbo"
SYSTEM_PROMPT="Eres ESCOMBOT..."
```

Reemplaza:
- `usuario` → tu usuario PostgreSQL
- `contraseña` → tu contraseña PostgreSQL
- `API_KEY` → tu key de OpenAI/Anthropic

### PASO 4: Verificar la Base de Datos

Abre una terminal psql:

```bash
psql -U usuario -d escombot -c "SELECT * FROM users;"
```

Deberías ver al menos 1 usuario. Si da error, la BD no existe.

### PASO 5: Crear/Resetear la Base de Datos

Si la BD no existe o está dañada:

```bash
# Opción A: Usando el script (recomendado)
npm run setup-db

# Opción B: Manualmente
npx prisma db push --skip-generate
```

### PASO 6: Abrir DevTools y Debuggear

Ahora ejecuta la app:

```bash
npm run dev
```

Mientras la app está corriendo:

1. **Abre DevTools**: Presiona `F12` en el navegador
2. **Ve a la pestaña "Network"**
3. **Haz click en el botón "Iniciar sesión"**
4. **Busca la petición POST a `login`**
5. **Mira:**
   - ¿Qué status code tiene? (200, 401, 500, etc)
   - ¿Cuál es la Response exacta?
   - ¿Hay error en la Console tab?

---

## Solución Rápida para Cada Error

### Error: "Unexpected token '<', "<!DOCTYPE..."

**Significa**: El servidor está retornando una página de error HTML

**Soluciones:**
1. Ejecuta: `npx prisma generate`
2. Verifica que DATABASE_URL es válido
3. Verifica que PostgreSQL está corriendo
4. Mira la consola de `npm run dev` ¿Hay errores?

### Error: "Login button flashing"

**Significa**: El componente Header está teniendo problemas al hacer checkAuth()

**Solución:**
- Abre DevTools → Console
- Mira si hay errores cuando presionas "Iniciar sesión"
- Probablemente dice algo como "Failed to fetch" o "401 Unauthorized"

### Error: "error al crear chat"

**Significa**: El endpoint POST /api/chats está fallando

**Solución:**
1. Verifica que estás logueado (cookie 'userId' debe existir)
2. En DevTools → Network → busca petición a `/api/chats`
3. Mira qué dice en Response
4. Probablemente dice "No autenticado" (código 401)

---

## Verificación de Conectividad

### ¿PostgreSQL está corriendo?

```bash
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -like "*postgres*"}

# O intenta:
psql -U postgres
```

### ¿La BD "escombot" existe?

```bash
psql -U usuario -c "\l"
```

Busca la línea con "escombot"

### ¿Hay datos en la tabla users?

```bash
psql -U usuario -d escombot -c "SELECT email, id FROM users;"
```

---

## Script de Recuperación Automática

Si todo está roto, ejecuta:

```bash
bash scripts/recovery.sh
```

Este script:
1. Limpia caché
2. Regenera Prisma
3. Ejecuta migraciones
4. Verifica la BD

---

## Checklist Final

- [ ] `.env.local` existe y tiene `DATABASE_URL`
- [ ] `npm install` completó sin errores
- [ ] `npx prisma generate` completó sin errores
- [ ] PostgreSQL está corriendo
- [ ] BD "escombot" existe
- [ ] Tabla "users" tiene datos
- [ ] `npm run dev` inicia sin errores (solo warnings es OK)
- [ ] DevTools muestra peticiones HTTP siendo enviadas

---

## Si Aún Hay Problemas

Por favor, copia y pega:

1. **Output de** `npm run dev` (últimas 20 líneas)
2. **Output de** `npx prisma generate`
3. **Output de** `psql -U usuario -d escombot -c "SELECT * FROM users LIMIT 1;"`
4. **El contenido completo de** `.env.local` (sin contraseñas)
5. **El error exacto en DevTools Console**

---

## Estructura de Archivos Esperada

```
escombot/
├── app/
│   ├── api/
│   │   ├── login/route.ts ✅
│   │   ├── chats/route.ts ✅
│   │   └── chats/[id]/messages/route.ts ✅
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx ✅
│   ├── LoginModal.tsx ✅
│   ├── ChatInterface.tsx ✅
│   └── Sidebar.tsx ✅
├── services/
│   ├── db.ts ✅
│   └── chatService.ts ✅
├── prisma/
│   ├── schema.prisma ✅
│   └── init.sql ✅
├── .env.local ⚠️ (debe existir)
├── .env.example ✅
├── package.json ✅
└── node_modules/ ⚠️ (debe existir después de npm install)
```

Si falta algún archivo con ✅, necesitas recrearlo.

