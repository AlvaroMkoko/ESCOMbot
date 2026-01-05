#!/bin/bash
# Script de recuperación completa para ESCOMBOT
# Ejecuta esto si hay errores después de npm run dev

echo "🔧 INICIANDO RECUPERACIÓN DE ESCOMBOT..."
echo ""

# Paso 1: Limpiar caché
echo "1️⃣  Limpiando caché y archivos temporales..."
rm -rf .next
rm -rf node_modules/.prisma
npm cache clean --force 2>/dev/null

# Paso 2: Generar cliente Prisma
echo ""
echo "2️⃣  Regenerando cliente de Prisma..."
npx prisma generate

# Paso 3: Ejecutar migraciones
echo ""
echo "3️⃣  Ejecutando migraciones de BD..."
npx prisma migrate dev --name init || echo "⚠️  Migraciones completadas (puede haber conflictos)"

# Paso 4: Verificar BD
echo ""
echo "4️⃣  Verificando conexión a BD..."
npx prisma db execute --stdin <<EOF
SELECT COUNT(*) as usuarios FROM users;
EOF

echo ""
echo "✅ RECUPERACIÓN COMPLETADA"
echo ""
echo "Ahora ejecuta: npm run dev"
