#!/bin/bash
# Script para crear un usuario de prueba en la base de datos
# Uso: bash scripts/create-test-user.sh

# Hash de "password123" generado con: npx bcryptjs hash "password123" 10
HASHED_PASSWORD='$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm'

# Usar Prisma CLI para crear el usuario
npx prisma db execute --stdin <<EOF
INSERT INTO users (first_name, last_name, username, email, password_hash)
VALUES (
    'Usuario',
    'Prueba',
    'testuser',
    'test@example.com',
    '$HASHED_PASSWORD'
)
ON CONFLICT (email) DO NOTHING;

SELECT * FROM users WHERE email = 'test@example.com';
EOF

echo "✅ Usuario de prueba creado"
echo "Email: test@example.com"
echo "Contraseña: password123"
