import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { post_id, user_id } = await req.json();

    if (!post_id || !user_id) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Cria o like, ignora se já existir
    await prisma.like.upsert({
        where: {
            user_id_post_id: {
                user_id,
                post_id,
            },
        },
        update: {}, // não atualiza nada se já existir
        create: {
            user_id,
            post_id,
        },
    });

    // Atualiza contagem de likes
    await prisma.post.update({
        where: { id: post_id },
        data: {
            likes: {
                increment: 1,
            },
        },
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { post_id, user_id } = await req.json();

    if (!post_id || !user_id) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await prisma.like.deleteMany({
        where: {
            user_id,
            post_id,
        },
    });

    await prisma.post.update({
        where: { id: post_id },
        data: {
            likes: {
                decrement: 1,
            },
        },
    });

    return NextResponse.json({ success: true });
}
