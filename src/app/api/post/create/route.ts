// app/api/post/create/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, content, image_url, likes, shares } = body;

        if (!user_id || !content) {
            return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                user_id,
                content,
                image_url,
                likes: likes || 0,
                shares: shares || 0,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar post:", error);
        return NextResponse.json({ error: "Erro interno ao criar post" }, { status: 500 });
    }
}
