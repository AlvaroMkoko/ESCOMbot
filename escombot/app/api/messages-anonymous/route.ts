import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Mensaje vacío' },
                { status: 400 }
            );
        }

        const lowerContent = message.toLowerCase();

        let responseText = '';

        if (lowerContent.includes("inscri") || lowerContent.includes("inscribirme")) {
            responseText = "Para el proceso de inscripción necesitas: \n1. Estar al corriente en tus dictámenes.\n2. Realizar tu cita en el SAES.\n3. Presentarte el día y hora señalados.\n\n¿Quieres saber más sobre las fechas? **Inicia sesión para acceso completo.**";
        } else if (lowerContent.includes("constancia") || lowerContent.includes("boleta")) {
            responseText = "Las constancias y boletas se tramitan en Gestión Escolar. El tiempo de entrega aproximado es de 3 días hábiles. Recuerda llevar tu comprobante de pago. **Inicia sesión para más detalles.**";
        } else if (lowerContent.includes("reglamento") || lowerContent.includes("baja")) {
            responseText = "Según el Reglamento General de Estudios del IPN, la baja temporal debe solicitarse dentro de las primeras semanas del semestre. Te sugiero consultar el Artículo 45 para más detalles. **Inicia sesión para asesoría personalizada.**";
        } else if (lowerContent.includes("hola") || lowerContent.includes("buenos")) {
            responseText = "¡Hola! Soy ESCOMBOT, tu asistente virtual. Puedo ayudarte con trámites básicos como inscripciones, constancias y reglamento. **Inicia sesión para acceso a toda mi inteligencia artificial.**";
        } else {
            responseText = "Entiendo tu consulta, pero en este momento solo tengo información sobre trámites básicos (inscripciones, constancias, reglamento). **Inicia sesión para que pueda ayudarte con consultas más avanzadas.**";
        }

        return NextResponse.json({
            botMessage: {
                id: Date.now().toString(),
                role: 'bot',
                content: responseText,
                timestamp: new Date().toISOString(),
            }
        });
    } catch (error) {
        console.error('Error processing anonymous message:', error);
        return NextResponse.json(
            { error: 'Error al procesar el mensaje' },
            { status: 500 }
        );
    }
}
