# ⚡ PROCESO RÁPIDO DE RECUPERACIÓN

Sigue estos pasos EN ORDEN. No saltes ninguno.

## Paso 1: Terminal

Abre una terminal PowerShell/CMD en la carpeta `escombot`:

```powershell
cd c:\Users\jebed\Documents\Escom\FEPI\ESCOMbot\escombot
```

## Paso 2: Generar Prisma

```powershell
npx prisma generate
```

Espera a que termine. Debería decir: `✔ Generated Prisma Client to ./node_modules/@prisma/client`

Si da error aquí, el problema es `.env.local`. Ve a Paso 3.

## Paso 3: Verificar `.env.local`

Abre el archivo `.env.local` (está en la carpeta `escombot`).

Debe verse así:

```
DATABASE_URL="postgresql://usuario:password@localhost:5432/escombot"
API_URL="https://api.openai.com/v1/chat/completions"
API_KEY="sk-..."
MODEL="gpt-3.5-turbo"
SYSTEM_PROMPT="Eres ESCOMBOT..."
```

Si está vacío o mal configurado, cópialo de `.env.example` y configura con TUS valores reales.

**Importante:**
- `usuario` = Tu usuario PostgreSQL (probablemente "postgres" o "usuario")
- `password` = Tu contraseña de PostgreSQL
- `API_KEY` = Tu key de OpenAI

## Paso 4: Resetear Base de Datos

En la misma terminal:

```powershell
npm run setup-db
```

Esto:
- Elimina datos viejos
- Crea tablas nuevas
- Inserta usuario de prueba

Debería terminar sin errores.

## Paso 5: Iniciar App

```powershell
npm run dev
```

Deberías ver:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

## Paso 6: Abrir el Navegador

Abre: http://localhost:3000

Debería cargar sin errores.

## Paso 7: Debugging en DevTools

Presiona **F12** para abrir DevTools.

**Pestaña "Console":** Debe estar limpia (sin errores rojos)

**Pestaña "Network":**
1. Recarga la página (F5)
2. Debería ver peticiones a:
   - `page.tsx` (status 200)
   - `globals.css` (status 200)

Si ves muchos errores en red, hay un problema de conexión a la BD.

## Paso 8: Probar Login

1. Haz click en el botón gris "Iniciar sesión" arriba a la derecha
2. En DevTools, ve a pestaña "Network"
3. Completa el login (puede ser cualquier email/contraseña para primer test)
4. Mira la petición POST a `login`:
   - ¿Status 200? ✅ Login funcionó
   - ¿Status 500? ❌ Error en servidor
   - ¿Status 400? ❌ Datos incorrectos

Si ves Status 500, el error está en los logs de `npm run dev`. Ve a la terminal y mira qué dice.

## Paso 9: Crear Chat

1. Si el login funcionó, escribe un mensaje
2. Presiona Enter o haz click en "Enviar"
3. En DevTools Network, mira la petición POST a `chats`:
   - ¿Status 200? ✅ Chat creado
   - ¿Status 401? ❌ No autenticado (cookies no se guardaron)
   - ¿Status 500? ❌ Error en BD

## Si Algo Falla

**Error: "cannot read property 'value' of undefined"**
- Significa: Las cookies no se están guardando
- Solución: En el navegador, DevTools → Application → Cookies → Verifica que existe "userId"

**Error: "Unexpected token '<'"**
- Significa: El servidor retorna HTML en lugar de JSON
- Solución: Hay un error 500 en el servidor. Mira los logs de `npm run dev`

**Error: "ECONNREFUSED at port 5432"**
- Significa: PostgreSQL no está corriendo
- Solución: 
  - Windows: Abre "Services" (services.msc) y busca PostgreSQL
  - O abre pgAdmin y verifica que el servidor está corriendo

**Error: "relation \"users\" does not exist"**
- Significa: Las tablas no se crearon
- Solución: Ejecuta de nuevo: `npm run setup-db`

---

## Comandos Útiles para Debugging

```powershell
# Ver logs de la BD en tiempo real
$env:DEBUG = "prisma:*"; npm run dev

# Abrir Prisma Studio (UI para ver BD)
npx prisma studio

# Verificar que PostgreSQL está corriendo
Test-NetConnection localhost -Port 5432

# Ver todos los usuarios
psql -U usuario -d escombot -c "SELECT * FROM users;"

# Limpiar caché de Next.js
Remove-Item -Recurse -Force .next
```

---

## Resumen Rápido

Si está todo roto:

```powershell
# 1. Generar Prisma
npx prisma generate

# 2. Resetear BD
npm run setup-db

# 3. Iniciar app
npm run dev

# 4. Abrir navegador
Start http://localhost:3000

# 5. Abrir DevTools (F12)
# 6. Probar login
# 7. Mira errores en Console y Network
```

---

## ❓ Preguntas Comunes

**P: ¿Por qué dice "The "middleware" file convention is deprecated"?**
A: Es solo un warning de Next.js. La app sigue funcionando. No es problema crítico.

**P: ¿Puedo usar otro nombre de usuario para PostgreSQL?**
A: Sí, pero debe estar en DATABASE_URL. El por defecto es "postgres".

**P: ¿Qué hago si PostgreSQL no está instalado?**
A: Descarga PostgreSQL desde https://www.postgresql.org/download/windows/

**P: ¿Los datos se pierden si ejecuto setup-db?**
A: Sí, la BD se limpia. Por eso solo úsalo para resetear durante desarrollo.

**P: ¿Cómo agrego mi API key de OpenAI?**
A: En `.env.local`, reemplaza "tu_api_key_aqui" con tu key real de OpenAI.

---

Si después de esto sigue sin funcionar, abre DevTools (F12) y copia:
1. Todos los errores que ves en Console
2. Los status codes de Network
3. Los logs de la terminal (npm run dev)

Con eso podré ayudarte más específicamente. 🚀

