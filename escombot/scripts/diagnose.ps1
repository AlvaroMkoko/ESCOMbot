# Script de Diagnóstico para ESCOMBOT en PowerShell
# Ejecuta: powershell -ExecutionPolicy Bypass -File .\scripts\diagnose.ps1

param(
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

Write-Host "🔍 DIAGNÓSTICO DE ESCOMBOT" -ForegroundColor Cyan -BackgroundColor Black
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$allOK = $true

# Función para imprimir estados
function Test-Component {
    param(
        [string]$Name,
        [scriptblock]$TestBlock,
        [string]$FixCommand = ""
    )
    
    try {
        $result = & $TestBlock
        if ($result) {
            Write-Host "✅ $Name" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Name" -ForegroundColor Red
            if ($FixCommand) {
                Write-Host "   📋 Solución: $FixCommand" -ForegroundColor Yellow
            }
            return $false
        }
    } catch {
        Write-Host "❌ $Name" -ForegroundColor Red
        Write-Host "   📋 Error: $($_.Exception.Message)" -ForegroundColor Yellow
        if ($FixCommand) {
            Write-Host "   📋 Solución: $FixCommand" -ForegroundColor Yellow
        }
        return $false
    }
}

# 1. Verificar .env.local
Write-Host "1️⃣  Configuración" -ForegroundColor White
$envOK = Test-Component ".env.local existe" {
    Test-Path ".env.local"
} "Copia .env.example a .env.local y configura tus valores"

if ($envOK) {
    $dbUrl = Select-String -Path ".env.local" -Pattern "DATABASE_URL" | ForEach-Object { $_.Line }
    Write-Host "   DATABASE_URL: $($dbUrl.Substring(0, [Math]::Min($dbUrl.Length, 50)))..." -ForegroundColor Gray
}

Write-Host ""

# 2. Verificar Node.js
Write-Host "2️⃣  Dependencias" -ForegroundColor White
$nodeOK = Test-Component "Node.js instalado" {
    $null = node --version 2>$null
    $LASTEXITCODE -eq 0
} "Descarga Node.js desde nodejs.org"

if ($nodeOK) {
    $nodeVersion = node --version
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor Gray
}

$nmOK = Test-Component "node_modules existe" {
    Test-Path "node_modules"
} "Ejecuta: npm install"

$allOK = $allOK -and $nmOK

Write-Host ""

# 3. Verificar Prisma
Write-Host "3️⃣  Prisma ORM" -ForegroundColor White
$prismaGenerated = Test-Component "Prisma Client generado" {
    Test-Path "node_modules\.prisma\client"
} "Ejecuta: npx prisma generate"

if (-not $prismaGenerated) {
    $allOK = $false
}

$schemOK = Test-Component "schema.prisma existe" {
    Test-Path "prisma\schema.prisma"
} "El archivo schema.prisma está faltando"

Write-Host ""

# 4. Verificar PostgreSQL
Write-Host "4️⃣  Base de Datos PostgreSQL" -ForegroundColor White

# Intenta psql
$psqlOK = Test-Component "psql disponible" {
    $null = psql --version 2>$null
    $LASTEXITCODE -eq 0
} "PostgreSQL no está en PATH. Instala PostgreSQL o agrega su bin a PATH"

if ($psqlOK) {
    $psqlVersion = psql --version
    Write-Host "   psql: $psqlVersion" -ForegroundColor Gray
    
    # Intenta conexión
    $connOK = Test-Component "Conexión a PostgreSQL" {
        $output = psql -c "SELECT 1" 2>&1
        $output | Select-String "1" | Test-Path $_
    } "Verifica que PostgreSQL está corriendo y credenciales son correctas"
}

Write-Host ""

# 5. Verificar Archivos
Write-Host "5️⃣  Archivos del Proyecto" -ForegroundColor White

$apiFiles = @(
    "app/api/login/route.ts",
    "app/api/chats/route.ts",
    "app/api/chats/[id]/messages/route.ts"
)

foreach ($file in $apiFiles) {
    $ok = Test-Component $file { Test-Path $file }
    $allOK = $allOK -and $ok
}

Write-Host ""

# 6. Verificar Componentes
Write-Host "6️⃣  Componentes React" -ForegroundColor White

$compFiles = @(
    "components/Header.tsx",
    "components/ChatInterface.tsx",
    "components/LoginModal.tsx",
    "components/Sidebar.tsx"
)

foreach ($file in $compFiles) {
    $ok = Test-Component $file { Test-Path $file }
    $allOK = $allOK -and $ok
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

if ($allOK) {
    Write-Host "✅ DIAGNÓSTICO OK - Puedes ejecutar: npm run dev" -ForegroundColor Green
} else {
    Write-Host "❌ Hay problemas - Sigue las instrucciones arriba" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para más detalles, ejecuta: npm run dev" -ForegroundColor Cyan
Write-Host "Luego abre DevTools (F12) y revisa Console y Network tabs" -ForegroundColor Cyan
