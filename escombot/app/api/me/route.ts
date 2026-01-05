import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/services/db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true, username: true },
  });

  return NextResponse.json({ user: user ?? null }, { status: 200 });
}
