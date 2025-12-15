import { ChatResponse } from "@/types/chat";

export class ChatService {
    private static instance: ChatService;

    private constructor() { }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async processMessage(content: string): Promise<ChatResponse> {
        // Simulación de latencia de red/procesamiento de IA
        await new Promise((resolve) => setTimeout(resolve, 800));

        const lowerContent = content.toLowerCase();

        if (lowerContent.includes("inscri") || lowerContent.includes("inscribirme")) {
            return {
                message: "Para el proceso de inscripción necesitas: \n1. Estar al corriente en tus dictámenes.\n2. Realizar tu cita en el SAES.\n3. Presentarte el día y hora señalados.\n\n¿Quieres saber más sobre las fechas?",
                options: ["Fechas de inscripción", "Documentos necesarios"]
            };
        }

        if (lowerContent.includes("constancia") || lowerContent.includes("boleta")) {
            return {
                message: "Las constancias y boletas se tramitan en Gestión Escolar. El tiempo de entrega aproximado es de 3 días hábiles. Recuerda llevar tu comprobante de pago.",
            };
        }

        if (lowerContent.includes("reglamento") || lowerContent.includes("baja")) {
            return {
                message: "Según el Reglamento General de Estudios del IPN, la baja temporal debe solicitarse dentro de las primeras semanas del semestre. Te sugiero consultar el Artículo 45 para más detalles.",
            };
        }

        if (lowerContent.includes("hola") || lowerContent.includes("buenos")) {
            return {
                message: "¡Hola! Soy ESCOMBOT, tu asistente virtual. ¿En qué puedo ayudarte hoy con tus trámites escolares?",
                options: ["Inscripciones", "Constancias", "Reglamento"]
            };
        }

        return {
            message: "Entiendo tu consulta, pero en este momento solo tengo información sobre trámites básicos (inscripciones, constancias, reglamento). Estoy aprendiendo más cada día. ¿Podrías reformular tu pregunta?",
            options: ["Ayuda con inscripciones", "Contactar a servicios escolares"]
        };
    }
}

export const chatService = ChatService.getInstance();
