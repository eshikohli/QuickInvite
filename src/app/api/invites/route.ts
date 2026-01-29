import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import OpenAI from "openai";

const TONE_INSTRUCTIONS: Record<string, string> = {
  hangout: "casual, short, and friendly",
  meeting: "formal, clear, and professional",
  party: "celebratory and energetic",
};

const PLACEHOLDER_TITLE = "QuickInvite (placeholder)";
const PLACEHOLDER_BODY =
  "AI-generated invitation text will appear here. Reply Yes / No / Maybe.";

async function generateInviteText(
  style: string,
  description: string
): Promise<{ title: string; body: string }> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const tone = TONE_INSTRUCTIONS[style];

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: `You are an invitation writer. Generate a ${tone} invitation based on the user's description. The body MUST end with: "Reply Yes / No / Maybe."`,
      },
      {
        role: "user",
        content: description,
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "invitation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "A short, catchy title for the invitation",
            },
            body: {
              type: "string",
              description:
                "The invitation body text ending with 'Reply Yes / No / Maybe.'",
            },
          },
          required: ["title", "body"],
          additionalProperties: false,
        },
      },
    },
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("No output text in response");
  }

  return JSON.parse(outputText) as { title: string; body: string };
}

export async function POST(req: Request) {
  try {
    const { style, description } = await req.json();

    if (!style || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!["hangout", "meeting", "party"].includes(style)) {
      return NextResponse.json({ error: "Invalid style" }, { status: 400 });
    }

    const publicSlug = randomBytes(8).toString("hex");
    const hostSlug = randomBytes(12).toString("hex");

    let title = PLACEHOLDER_TITLE;
    let body = PLACEHOLDER_BODY;

    try {
      const generated = await generateInviteText(style, description);
      title = generated.title;
      body = generated.body;
    } catch {
      // Fall back to placeholder on any OpenAI error
    }

    const invite = await prisma.invite.create({
      data: {
        style,
        description,
        title,
        body,
        publicSlug,
        hostSlug,
      },
    });

    return NextResponse.json({
      publicSlug: invite.publicSlug,
      hostSlug: invite.hostSlug,
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
