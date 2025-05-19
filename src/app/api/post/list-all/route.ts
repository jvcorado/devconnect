// app/api/post/list-all/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    try {
        const posts = await prisma.post.findMany({
            orderBy: { created_at: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                likesList: currentUserId
                    ? {
                        where: { user_id: currentUserId },
                    }
                    : false,
            },
        });

        // Coletar todos os user_ids únicos
        const userIds = posts.map((post) => post.user_id).filter((id, i, arr) => arr.indexOf(id) === i);

        // Verificar quem o usuário logado já segue
        const follows = currentUserId
            ? await prisma.follow.findMany({
                where: {
                    followerId: currentUserId,
                    followingId: { in: userIds },
                },
            })
            : [];

        const followedMap = new Set(follows.map((f) => f.followingId));

        const formatted = posts.map((post) => ({
            ...post,
            username: post.user?.name || "Sem nome",
            avatar_url: post.user?.image || "",
            likedByUser: post.likesList?.length > 0,
            followedByUser: followedMap.has(post.user_id),
        }));

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("Erro ao buscar posts:", err);
        return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 });
    }
}
