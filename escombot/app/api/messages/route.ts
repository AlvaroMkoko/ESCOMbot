import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";
import { getChatService } from "@/services/chatService";

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const chatId = body?.chatId;
    const message = body?.message;

    if (typeof chatId !== "string" || !chatId.trim()) {
      return NextResponse.json({ error: "chatId es requerido" }, { status: 400 });
    }

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "message es requerido" }, { status: 400 });
    }

    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
      select: { id: true, title: true },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat no encontrado" }, { status: 404 });
    }

    // Guardar mensaje del usuario
    const userMessage = await prisma.message.create({
      data: { chatId, role: "user", content: message },
    });

    // Respuesta del LLM
    const chatService = getChatService();
    const llmResponse = await chatService.processMessage(message);

    // Guardar respuesta del bot
    const botMessage = await prisma.message.create({
      data: { chatId, role: "assistant", content: llmResponse.message },
    });

    // Actualizar título si es nuevo
    if (chat.title === "Nueva conversación") {
      await prisma.chat.update({
        where: { id: chatId },
        data: { title: message.substring(0, 60) },
      });
    }

    return NextResponse.json(
      {
        userMessage: {
          ...userMessage,
          role: "user",
          timestamp: userMessage.createdAt.toISOString(),
        },
        botMessage: {
          ...botMessage,
          role: "bot",
          timestamp: botMessage.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/messages:", error);
    return NextResponse.json({ error: "Error al crear mensaje" }, { status: 500 });
  }
}
