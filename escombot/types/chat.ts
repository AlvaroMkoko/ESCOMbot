export type MessageRole = 'user' | 'bot'; // Frontend: 'bot' se mapea a 'assistant' en BD

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

// Tipos para la API y base de datos
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface Chat {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface DbMessage {
    id: string;
    chatId: string;
    role: 'user' | 'assistant'; // En BD
    content: string;
    createdAt: string;
}
