import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_RESPONSES = ["YES", "NO", "MAYBE"];

export async function POST(req: Request) {
  try {
    const { inviteId, name, response } = await req.json();

    if (!inviteId || !name || !response) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!VALID_RESPONSES.includes(response)) {
      return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 400 });
    }

    const existing = await prisma.rSVP.findUnique({
      where: { inviteId_name: { inviteId, name } },
    });

    await prisma.rSVP.upsert({
      where: { inviteId_name: { inviteId, name } },
      update: { response, createdAt: new Date() },
      create: { inviteId, name, response },
    });

    return NextResponse.json({ success: true, updated: !!existing });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
