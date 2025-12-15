export type MessageRole = 'user' | 'bot';

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: string;
}

export interface ChatResponse {
    message: string;
    options?: string[]; // Para sugerencias futuras
}
