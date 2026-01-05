# ✅ Checklist de Instalación - ESCOMBOT

## Antes de empezar
- [ ] PostgreSQL instalado y corriendo
- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)

---

## Paso 1: Dependencias
- [ ] `npm install` ejecutado sin errores
- [ ] `node_modules/` creado
- [ ] `package-lock.json` actualizado

**Dependencias instaladas:**
- [ ] `@prisma/client`
- [ ] `prisma`
- [ ] `bcryptjs`

---

## Paso 2: Configuración
- [ ] `.env.local` creado en carpeta `escombot/`
- [ ] `DATABASE_URL` configurada
- [ ] `API_URL` configurada
- [ ] `API_KEY` configurada
- [ ] `MODEL` configurada
- [ ] `SYSTEM_PROMPT` configurada

---

## Paso 3: Base de datos
- [ ] PostgreSQL base de datos `escombot` creada
- [ ] Tablas creadas (`npm run setup-db` o SQL manual)
- [ ] Usuario de prueba insertado:
  - Email: `test@example.com`
  - Password: `password123`

**Verificar con:**
```bash
npm run prisma:studio
```

Deberías ver:
- [ ] Tabla `users` con 1 registro
- [ ] Tabla `chats` vacía
- [ ] Tabla `messages` vacía

---

## Paso 4: Backend funcionando
- [ ] `npm run dev` ejecutado sin errores
- [ ] Servidor escuchando en `http://localhost:3000`
- [ ] Consola muestra "Ready in Xs"

---

## Paso 5: Frontend funcionando
- [ ] Página carga en `http://localhost:3000`
- [ ] ESCOMBOT logo visible
- [ ] Botón "Iniciar sesión" visible
- [ ] Header renderiza correctamente

---

## Paso 6: Autenticación
- [ ] Click en "Iniciar sesión" abre modal
- [ ] Modal tiene:
  - [ ] Input de email
  - [ ] Input de contraseña
  - [ ] Botón "Entrar"
- [ ] Login con credenciales de prueba funciona
- [ ] Modal se cierra después del login
- [ ] Header cambia (muestra icono de usuario)

---

## Paso 7: Interfaz de chat
- [ ] Sidebar visible en desktop
- [ ] Sidebar oculto en móvil (con toggle)
- [ ] Chat interface visible
- [ ] Input de mensaje funcional
- [ ] Botón enviar funcional

---

## Paso 8: Funcionalidad de chat
- [ ] Enviar mensaje y ver en la interfaz
- [ ] Bot responde (si API_URL y API_KEY son válidas)
- [ ] Mensajes se guardan en BD
- [ ] Roles mapeados correctamente (user/bot)
- [ ] Historial persiste al recargar página

---

## Paso 9: Historial de chats
- [ ] Sidebar muestra lista de chats
- [ ] Botón "Nuevo chat" funciona
- [ ] Al crear chat, aparece en sidebar
- [ ] Al seleccionar chat, carga mensajes anteriores
- [ ] Título del chat se actualiza automáticamente

---

## Paso 10: Cierre de sesión
- [ ] Click en icono de usuario
- [ ] Opción "Cerrar sesión" visible
- [ ] Al cerrar sesión:
  - [ ] Página recarga
  - [ ] Login modal aparece
  - [ ] Cookie userId eliminada

---

## Verificación final

### Base de datos
```bash
npm run prisma:studio
```
- [ ] 1+ usuario en tabla `users`
- [ ] 0+ chats en tabla `chats`
- [ ] 0+ mensajes en tabla `messages`

### API endpoints
- [ ] `POST /api/login` - Login funciona
- [ ] `GET /api/chats` - Lista chats (sin autenticar = error)
- [ ] `POST /api/chats` - Crear chat
- [ ] `GET /api/chats/:id/messages` - Obtener mensajes
- [ ] `POST /api/messages` - Enviar mensaje

### Build
- [ ] `npm run build` sin errores
- [ ] Carpeta `.next` creada

---

## Problemas comunes

### ❌ "DATABASE_URL environment variable not found"
- [ ] Verificar `.env.local` existe
- [ ] Verificar que tiene `DATABASE_URL=...`
- [ ] Reiniciar `npm run dev`

### ❌ "connect ECONNREFUSED 127.0.0.1:5432"
- [ ] PostgreSQL no está corriendo
- [ ] Iniciar PostgreSQL según tu SO

### ❌ "relation 'users' does not exist"
- [ ] Ejecutar `npm run setup-db`
- [ ] O ejecutar SQL manualmente desde `prisma/init.sql`

### ❌ Login no funciona
- [ ] Verificar usuario existe en BD (`npm run prisma:studio`)
- [ ] Verificar email es `test@example.com`
- [ ] Verificar password es `password123`

### ❌ Bot no responde
- [ ] Verificar `API_URL` es correcta
- [ ] Verificar `API_KEY` es válida
- [ ] Verificar `MODEL` existe
- [ ] Revisar consola para errores

### ❌ Sidebar no carga chats
- [ ] Verificar estar autenticado
- [ ] Revisar Network tab en DevTools
- [ ] Verificar BD tiene datos

---

## Documentación disponible

Una vez completado, puedes consultar:
- [ ] [QUICK_START.md](./QUICK_START.md) - Guía rápida
- [ ] [SETUP.md](./SETUP.md) - Instalación detallada
- [ ] [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Detalles técnicos
- [ ] [API_REFERENCE.md](./API_REFERENCE.md) - Referencia de API

---

## 🎉 ¡Listo!

Si todas las casillas están marcadas, **ESCOMBOT está completamente funcional** ✨

### Próximos pasos:
1. Explorar la interfaz
2. Enviar mensajes
3. Crear múltiples chats
4. Personalizar según necesidades
5. Desplegar a producción

---

**Timestamp:** Enero 4, 2024
**Status:** ✅ Completamente implementado
