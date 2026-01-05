// scripts/seed.js
// Script para cargar datos de prueba en la base de datos

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  try {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'estudiante@escom.edu.mx' },
      update: {},
      create: {
        email: 'estudiante@escom.edu.mx',
        passwordHash: hashedPassword,
        firstName: 'Estudiante',
        lastName: 'De Prueba',
        username: 'estudiante',
      },
    });

    console.log('✅ Usuario creado/verificado:', user.email);

    // Crear un chat de ejemplo
    const chat = await prisma.chat.create({
      data: {
        title: 'Chat de Bienvenida',
        userId: user.id,
        messages: {
          create: [
            {
              role: 'user',
              content: '¿Hola? ¿Cómo estás?',
            },
            {
              role: 'assistant',
              content: '¡Hola! Soy ESCOMBOT, tu asistente virtual escolar. ¿En qué puedo ayudarte hoy?',
            },
          ],
        },
      },
      include: {
        messages: true,
      },
    });

    console.log('✅ Chat de prueba creado:', chat.title);

    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
