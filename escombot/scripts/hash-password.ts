/**
 * Script para generar hash de contraseña
 * Uso: npx ts-node scripts/hash-password.ts
 * Luego ingresa la contraseña que deseas hashear
 */

import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function hashPassword() {
    return new Promise<void>((resolve) => {
        rl.question('Ingresa la contraseña a hashear: ', async (password) => {
            try {
                const hash = await bcrypt.hash(password, 10);
                console.log('\n✅ Hash generado exitosamente:');
                console.log(hash);
                console.log('\nPuedes usar este hash en la BD como password_hash');
            } catch (error) {
                console.error('❌ Error al hashear:', error);
            } finally {
                rl.close();
                resolve();
            }
        });
    });
}

hashPassword();
