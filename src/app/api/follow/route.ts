import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const { followerId, followingId } = await req.json();

    if (!followerId || !followingId || followerId === followingId) {
        return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
    }

    try {
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
            });
            return NextResponse.json({ followed: false });
        } else {
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId,
                },
            });
            return NextResponse.json({ followed: true });
        }
    } catch (err) {
        console.error("Erro ao seguir/desseguir:", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
