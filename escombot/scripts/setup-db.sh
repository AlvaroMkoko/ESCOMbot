#!/bin/bash

# Script para inicializar la base de datos después de instalar dependencias
echo "Generando cliente de Prisma..."
npx prisma generate

echo "Ejecutando migraciones de Prisma..."
npx prisma migrate dev --name init

echo "✅ Base de datos inicializada correctamente"
