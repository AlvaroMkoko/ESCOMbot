import { NextResponse } from 'next/server';
import { ChatService } from '@/services/chatService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const chatService = ChatService.getInstance();
        const response = await chatService.processMessage(message);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error processing chat message:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
