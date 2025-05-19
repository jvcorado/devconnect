import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Parâmetro userId ausente." }, { status: 400 });
    }

    try {
        const [followers, following, publications] = await Promise.all([
            prisma.follow.count({ where: { followingId: userId } }),
            prisma.follow.count({ where: { followerId: userId } }),
            prisma.post.count({ where: { user_id: userId, content: { not: "feed" } } }),
        ]);

        return NextResponse.json({ followers, following, publications });
    } catch (err) {
        console.error("Erro ao buscar stats:", err);
        return NextResponse.json({ error: "Erro ao buscar estatísticas." }, { status: 500 });
    }
}
