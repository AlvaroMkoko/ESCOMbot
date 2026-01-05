import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/services/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;

    // Invitado: lista vacía para que no truene UI
    if (!userId) {
      return NextResponse.json({ chats: [] }, { status: 200 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error("Error en GET /api/chats:", error);
    return NextResponse.json({ chats: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get("userId")?.value;

    // Si no hay sesión, no se puede crear chat en DB (tu front ya cae a anónimo)
    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const title = typeof body?.title === "string" && body.title.trim()
      ? body.title.trim().substring(0, 120)
      : "Nueva conversación";

    const chat = await prisma.chat.create({
      data: { userId, title },
      select: { id: true, title: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/chats:", error);
    return NextResponse.json({ error: "Error al crear chat" }, { status: 500 });
  }
}
