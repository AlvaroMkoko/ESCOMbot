import { NextRequest, NextResponse } from "next/server";
import { getChatService } from "@/services/chatService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const message = body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const userId = request.cookies.get("userId")?.value;
    const chatService = getChatService();

    // Invitado: modo mock
    if (!userId) {
      const text = await chatService.processMessageAnonymous(message);
      return NextResponse.json({
        message: text,
        mode: "guest",
      });
    }

    // Usuario autenticado: LLM
    const response = await chatService.processMessage(message);
    return NextResponse.json({
      ...response,
      mode: "auth",
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
