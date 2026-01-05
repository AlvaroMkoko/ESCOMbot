# 🚀 COMIENZA AQUÍ - ESCOMBOT RECOVERY

**TL;DR:** Copiar y pegar esto en una terminal, en la carpeta `escombot`:

```powershell
cd c:\Users\jebed\Documents\Escom\FEPI\ESCOMbot\escombot
npm install
npx prisma generate
npm run setup-db
npm run dev
```

Luego abre: **http://localhost:3000**

---

## 📊 ¿Por Qué Hay Errores?

Hay 3 problemas que he identificado y arreglado:

| # | Error | Arreglado |
|---|-------|----------|
| 1 | "Unexpected token '<'"  | ✅ Arreglado SQL |
| 2 | Login button desaparece | ✅ Arreglado Header |
| 3 | "Error al crear chat" | ⏳ Necesita verificación |

---

## ✅ Qué He Hecho

He **corregido código** y creado **herramientas de debugging**:

### Arreglos en Código:
- ✅ `/prisma/init.sql` - Error SQL corregido
- ✅ `/components/Header.tsx` - Lógica de autenticación mejorada
- ✅ `/middleware.ts` - Deprecation warning removido
- ✅ `/package.json` - Agregadas dependencias faltantes (Prisma, bcryptjs)

### Herramientas de Debugging Creadas:
- 📄 `QUICK_RECOVERY.md` - Guía paso a paso
- 📄 `DEBUG_GUIDE.md` - Debugging profundo
- 📄 `STATUS_REPORT.md` - Reporte técnico
- 📄 `scripts/diagnose.ps1` - Script de diagnóstico automático
- 📄 `scripts/seed.js` - Script para cargar datos de prueba
- 📄 `scripts/recovery.sh` - Script de recuperación automática

---

## 🎯 Próximos 3 Pasos

### PASO 1: Instalar Dependencias
```bash
npm install
```

### PASO 2: Generar Prisma y Crear Base de Datos
```bash
npx prisma generate
npm run setup-db
```

**Nota:** Si da error aquí, probablemente:
- PostgreSQL no está corriendo
- `.env.local` tiene DATABASE_URL incorrecto
- Ver `QUICK_RECOVERY.md` para soluciones

### PASO 3: Iniciar la Aplicación
```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 16.0.0
- Local:        http://localhost:3000
```

Si ves errores, abre `DEBUG_GUIDE.md`

---

## 🔍 Cómo Verificar Que Todo Funciona

1. **Abre el navegador:** http://localhost:3000
2. **Presiona F12** (DevTools)
3. **Ve a pestaña "Console"**
4. **Haz click en "Iniciar sesión"**

### ✅ Debería Pasar Lo Siguiente:
1. Se abre un modal de login
2. Ingresa email: `estudiante@escom.edu.mx`, password: `password123`
3. Se cierra el modal
4. Aparece tu email en la esquina superior derecha
5. Escribe un mensaje y presiona Enter
6. El mensaje aparece en el chat

### ❌ Si Algo Sale Mal:
- **Mira el error en Console (pestaña de DevTools)**
- **Mira qué status code tiene en Network (pestaña de DevTools)**
- **Copia el error y busca la solución en DEBUG_GUIDE.md**

---

## 📖 Documentación Disponible

| Archivo | Propósito |
|---------|----------|
| `QUICK_RECOVERY.md` | Pasos detallados de recuperación |
| `DEBUG_GUIDE.md` | Guía completa de debugging |
| `STATUS_REPORT.md` | Reporte técnico de lo que hice |
| `API_REFERENCE.md` | Referencia de todos los endpoints |
| `ARCHITECTURE.md` | Cómo funciona el sistema |

---

## 🐛 Si Aún Hay Problemas

Ejecuta el script de diagnóstico:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\diagnose.ps1
```

Esto te dirá qué está faltando o mal configurado.

---

## 💡 Comando Útiles

```bash
# Ver la BD en interfaz web
npx prisma studio

# Ver si PostgreSQL está corriendo
psql -c "SELECT 1"

# Resetear BD completamente
npm run setup-db

# Ver logs en tiempo real
$env:DEBUG = "prisma:*"; npm run dev

# Limpiar caché
rm -r .next

# Reinstalar todo (nuclear option)
rm -r node_modules
npm install
npm run setup-db
```

---

## ❓ Preguntas Rápidas

**P: ¿Qué es Prisma?**  
A: Es el sistema que conecta el código con la base de datos PostgreSQL.

**P: ¿Por qué necesito `npm install` si ya lo ejecuté?**  
A: Porque agregué dependencias nuevas (Prisma y bcryptjs) en package.json.

**P: ¿Puedo usar otra contraseña?**  
A: Sí, pero entonces debes cambiarla en el script de seed.js (línea 16).

**P: ¿Cuándo ejecuto cada comando?**  
A: En orden: install → generate → setup-db → dev

**P: ¿PostgreSQL necesita estar corriendo?**  
A: Sí, antes de ejecutar cualquier comando con `npm`.

**P: ¿Dónde está PostgreSQL?**  
A: Si está en Windows, probablemente en `C:\Program Files\PostgreSQL` o en pgAdmin.

---

## ⚠️ IMPORTANTE

Si en algún momento ves errores sobre "cannot find module", significa que faltan dependencias:

```bash
npm install
npx prisma generate
```

Si ves errores sobre "Database connection failed", significa que PostgreSQL no está corriendo o `.env.local` es incorrecto.

---

## ✨ Al Final

Una vez que todo funcione:

1. El login trabajará correctamente
2. Los chats se crearán sin errores
3. Los mensajes se guardarán en la BD
4. Todo estará listo para agregar más funciones

---

## 🎉 ¿Está Todo Funcionando?

Si llegaste aquí y `npm run dev` está corriendo sin errores, ¡felicidades! El sistema está listo para usar y desarrollar.

Siguiente paso: Leer `ARCHITECTURE.md` para entender el código.

