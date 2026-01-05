# ⚡ TL;DR - 2 MINUTOS

## El Problema
```
Tenías 3 bugs que rompían la app
```

## La Solución
```
Arreglé el código + creé herramientas
```

## Qué Hacer Ahora
```bash
cd escombot
npm install
npx prisma generate
npm run setup-db
npm run dev
```

Luego abre: **http://localhost:3000**

Login con:
- Email: `estudiante@escom.edu.mx`
- Password: `password123`

## Si Hay Errores
```bash
# Diagnóstico automático
powershell -ExecutionPolicy Bypass -File .\scripts\diagnose.ps1
```

Luego lee: [QUICK_RECOVERY.md](QUICK_RECOVERY.md)

## ✅ Listo

Eso es todo. El sistema está arreglado.

Tiempo total: ~10 minutos desde aquí

---

**Nota:** Si PostgreSQL no está corriendo, esto fallará. Asegúrate de que PostgreSQL está activo en Services (Windows).

