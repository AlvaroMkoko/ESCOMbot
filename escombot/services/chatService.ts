import { ChatResponse } from "@/types/chat";

const API_URL = process.env.API_URL as string;
const API_KEY = process.env.API_KEY as string;
const MODEL = process.env.MODEL as string;
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || "";

export class ChatService {
    private static instance: ChatService;

    private constructor() {
        if (!API_URL || !API_KEY || !MODEL) {
            throw new Error("Missing required environment variables: API_URL, API_KEY, or MODEL");
        }
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async processMessage(content: string): Promise<ChatResponse> {
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content: SYSTEM_PROMPT,
                        },
                        {
                            role: "user",
                            content: content,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorData.error?.message || "Error desconocido"}`);
            }

            const data = await response.json();
            const message = data.choices[0]?.message?.content || "No puedo responder a eso por el momento";

            return {
                message: message,
            };
        } catch (error) {
            console.error("Error de conección:", error);
            return {
                message: `Error al procesar tu mensaje: ${error instanceof Error ? error.message : "Error desconocido"}`,
            };
        }
    }
}

export const chatService = ChatService.getInstance();
