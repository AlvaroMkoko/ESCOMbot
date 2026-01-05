# 🧪 Prueba de Logout - Verificación Rápida

## Pasos para verificar que el logout funciona correctamente:

### 1. **Iniciar sesión**
   - Abre la aplicación: http://localhost:3000
   - Haz clic en "Iniciar sesión"
   - Ingresa credenciales:
     - Email: `estudiante@escom.edu.mx`
     - Contraseña: `password123`
   - ✅ Deberías ver el sidebar con tu historial de chats

### 2. **Método 1: Logout desde Header (Dropdown)**
   - En la esquina superior derecha, haz clic en el botón **"Mi cuenta"** (color azul)
   - Se abrirá un dropdown
   - Haz clic en **"Cerrar sesión"** (en rojo)
   - ✅ Deberías ser redirigido a la página de inicio
   - ✅ El dropdown de "Mi cuenta" debe desaparecer
   - ✅ En su lugar debe aparececer el botón "Iniciar sesión"

### 3. **Método 2: Logout desde Sidebar**
   - Vuelve a iniciar sesión
   - En el sidebar izquierdo (oscuro), al final, hay un botón **"Cerrar sesión"**
   - Haz clic en ese botón
   - ✅ Deberías ser redirigido a la página de inicio
   - ✅ El sidebar debe desaparecer o mostrar modo anónimo

### 4. **Verificar que la sesión se limpió**
   - Abre las Developer Tools (F12)
   - Ve a la pestaña **Application** (o **Storage**)
   - En **Cookies**, busca la cookie `userId`
   - ✅ Después de logout, esa cookie NO debe existir
   - ✅ Si aún existe, el logout no limpió correctamente la cookie

### 5. **Verificar que no hay caché de chats**
   - Después de logout, recarga la página (F5)
   - ✅ No deberías ver el sidebar con historial de chats
   - ✅ Deberías ver el botón "Iniciar sesión"
   - ✅ Si ves chats después de logout, el logout no funcionó

## ¿Qué cambió?

| Componente | Cambio |
|-----------|--------|
| **page.tsx** | `handleLogout()` mejorado con doble limpieza de cookies y navegación a home |
| **Header.tsx** | Ahora acepta `onLogout` prop del padre y la usa |
| **Sidebar.tsx** | Ya tenía el botón de logout funcionando |
| **/api/logout** | Nuevo endpoint para limpiar cookies desde servidor |

## 🐛 Si aún no funciona:

1. **Limpia caché del navegador** (Ctrl+Shift+Del)
2. **Reinicia el servidor** (`npm run dev`)
3. **Verifica en la consola** si hay errores (F12 → Console)
4. **Revisa las cookies** antes y después de logout

## 📝 Notas técnicas:

- Las cookies se limpian de DOS formas:
  - Cliente: `document.cookie = '...expires=...';` (HTTP)
  - Servidor: `/api/logout` limpia httpOnly cookies
- La navegación es a `/` (home) en lugar de `reload()` para asegurar un refresh completo
- Los estados locales (chatId, sidebar) se limpian también
