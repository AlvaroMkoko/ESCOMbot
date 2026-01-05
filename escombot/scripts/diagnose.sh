#!/bin/bash
# Script de diagnóstico para ESCOMBOT
# Verifica todos los requisitos antes de ejecutar

echo "🔍 DIAGNÓSTICO DE ESCOMBOT"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar .env.local
echo "1️⃣  Verificando archivo .env.local..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local existe${NC}"
    if grep -q "DATABASE_URL" .env.local; then
        DB_URL=$(grep "DATABASE_URL" .env.local)
        echo "   DATABASE_URL configurado: ${DB_URL:0:50}..."
    else
        echo -e "${RED}❌ DATABASE_URL no está configurado${NC}"
    fi
else
    echo -e "${RED}❌ .env.local NO existe${NC}"
    echo "   Copia .env.example a .env.local y configura DATABASE_URL"
fi

echo ""

# 2. Verificar node_modules
echo "2️⃣  Verificando node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
else
    echo -e "${RED}❌ node_modules NO existe${NC}"
    echo "   Ejecuta: npm install"
fi

echo ""

# 3. Verificar Prisma Client
echo "3️⃣  Verificando cliente de Prisma..."
if [ -d "node_modules/.prisma/client" ]; then
    echo -e "${GREEN}✅ Prisma Client generado${NC}"
else
    echo -e "${RED}❌ Prisma Client NO generado${NC}"
    echo "   Ejecuta: npm run prisma:generate"
fi

echo ""

# 4. Verificar PostgreSQL
echo "4️⃣  Intentando conexión a PostgreSQL..."
if command -v psql &> /dev/null; then
    # Intenta conexión sin base de datos primero
    if psql --version &> /dev/null; then
        echo -e "${GREEN}✅ psql está instalado${NC}"
        # Intenta conectarse a la BD (esto fallará si no existe, pero es un buen test)
        echo "   (ejecuta manualmente si quieres verificar la BD)"
    fi
else
    echo -e "${YELLOW}⚠️  psql no encontrado - no se puede verificar BD${NC}"
fi

echo ""

# 5. Verificar archivos API routes
echo "5️⃣  Verificando archivos de API routes..."
API_FILES=(
    "app/api/login/route.ts"
    "app/api/chats/route.ts"
    "app/api/chats/[id]/messages/route.ts"
)

for file in "${API_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file NO existe${NC}"
    fi
done

echo ""

# 6. Verificar componentes React
echo "6️⃣  Verificando componentes React..."
COMPONENT_FILES=(
    "components/Header.tsx"
    "components/LoginModal.tsx"
    "components/ChatInterface.tsx"
    "components/Sidebar.tsx"
)

for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file NO existe${NC}"
    fi
done

echo ""
echo "=========================================="
echo "🔍 DIAGNÓSTICO COMPLETADO"
echo ""
echo "Si ves errores rojos (❌), sigue las instrucciones para arreglarlos."
echo "Si todo es verde (✅), el problema está en la BD o la lógica de la app."
