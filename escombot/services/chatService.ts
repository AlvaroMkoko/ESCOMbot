import { ChatResponse } from "@/types/chat";
import { prisma } from "@/services/db";

const API_URL = process.env.API_URL ?? "";
const API_KEY = process.env.API_KEY ?? "";
const MODEL = process.env.MODEL ?? "";
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ?? "";

// Cuántos mensajes previos mandar como contexto (4 = 2 turnos: user+assistant, user+assistant)
const CONTEXT_MESSAGES = 4;

type LLMRole = "system" | "user" | "assistant";

export class ChatService {
  private static instance: ChatService;

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Invitado: respuestas básicas (NO TOCADO)
  public async processMessageAnonymous(content: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const lower = content.toLowerCase();

    if (lower.includes("hola") || lower.includes("buenos")) {
      return "Hola. Soy ESCOMBOT (ESCOM - IPN). ¿Qué trámite necesitas consultar?";
    }

    if (lower.includes("constancia") || lower.includes("boleta")) {
      return [
        "Constancias: 5 a 7 días hábiles.",
        "Boleta informativa: 7 a 10 días hábiles.",
        "Boleta certificada: 20 días hábiles (firma digital al correo registrado).",
        "Dime cuál necesitas y te indico el procedimiento.",
      ].join("\n");
    }

    if (lower.includes("baja")) {
      return "Para bajas (materia/temporal/definitiva) normalmente se solicita mediante una carta dirigida al director con tus datos y motivos. ¿Qué tipo de baja necesitas?";
    }

    return "Puedo orientarte sobre constancias, boletas, bajas, credencial, COSIE, inscripción/reinscripción y ETS. ¿Qué trámite buscas?";
  }

  // Helper: llama al LLM con una lista de mensajes ya construida
  private async callLLM(messages: { role: LLMRole; content: string }[]): Promise<ChatResponse> {
    if (!API_URL || !API_KEY || !MODEL) {
      return {
        message:
          "El modo inteligente no está disponible en este momento (configuración incompleta). Puedes seguir usando el modo invitado.",
      };
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ESCOMBOT",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        data?.error?.message || data?.message || JSON.stringify(data) || "Error desconocido";
      throw new Error(`API Error: ${res.status} - ${msg}`);
    }

    const text = data?.choices?.[0]?.message?.content || "No puedo responder a eso por el momento";
    return { message: text };
  }

  /**
   * Autenticado SIN contexto (se queda como estaba)
   */
  public async processMessage(content: string): Promise<ChatResponse> {
    try {
      return await this.callLLM([
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ]);
    } catch (err) {
      console.error("Error de conexión LLM:", err);
      return {
        message:
          err instanceof Error
            ? `Error al procesar tu mensaje: ${err.message}`
            : "Error al procesar tu mensaje",
      };
    }
  }

  /**
   * Autenticado CON contexto del chat (últimos N mensajes de DB + mensaje actual)
   */
  public async processMessageWithContext(chatId: string, content: string): Promise<ChatResponse> {
    try {
      // Traer últimos mensajes del chat (los más recientes)
      const prev = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "desc" },
        take: CONTEXT_MESSAGES,
        select: { role: true, content: true },
      });

      // Prisma regresa desc; los invertimos a orden cronológico
      const historyChrono = prev.reverse();

      const historyForLLM = historyChrono
        .map((m) => {
          const role: LLMRole = m.role === "assistant" ? "assistant" : "user";
          return { role, content: m.content };
        })
        // por si algún mensaje está vacío
        .filter((m) => typeof m.content === "string" && m.content.trim().length > 0);

      return await this.callLLM([
        { role: "system", content: SYSTEM_PROMPT },
        ...historyForLLM,
        { role: "user", content },
      ]);
    } catch (err) {
      console.error("Error de conexión LLM (contexto):", err);
      return {
        message:
          err instanceof Error
            ? `Error al procesar tu mensaje: ${err.message}`
            : "Error al procesar tu mensaje",
      };
    }
  }
}

export function getChatService(): ChatService {
  return ChatService.getInstance();
}
