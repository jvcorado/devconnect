import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


async function main() {
    // 🚀 Usuários fictícios
    const users = await prisma.user.createMany({
        data: [
            { id: 'user1', name: 'Ana Dev', email: 'ana@dev.com', image: 'https://i.pravatar.cc/150?img=1' },
            { id: 'user2', name: 'Bruno Code', email: 'bruno@code.com', image: 'https://i.pravatar.cc/150?img=2' },
            { id: 'user3', name: 'Carla Script', email: 'carla@script.com', image: 'https://i.pravatar.cc/150?img=3' },
        ],
        skipDuplicates: true,
    });

    // 🌟 Posts
    const posts = await prisma.post.createMany({
        data: [
            { user_id: 'user1', content: 'Meu primeiro post!', image_url: 'https://source.unsplash.com/random/1', likes: 3, shares: 1 },
            { user_id: 'user2', content: 'Hello Dev World 🌍', image_url: 'https://source.unsplash.com/random/2', likes: 5, shares: 2 },
            { user_id: 'user3', content: 'Testando minha nova ideia 🔥', image_url: 'https://source.unsplash.com/random/3', likes: 2, shares: 1 },
            { user_id: 'user1', content: 'Frontend é vida!', image_url: 'https://source.unsplash.com/random/4', likes: 1, shares: 0 },
            { user_id: 'user2', content: 'Next.js + Prisma ❤️', image_url: 'https://source.unsplash.com/random/5', likes: 4, shares: 3 },
        ],
    });

    // 💬 Comentários
    await prisma.comment.createMany({
        data: [
            { user_id: 'user2', post_id: 1, content: 'Top demais!' },
            { user_id: 'user3', post_id: 1, content: 'Parabéns pelo post!' },
            { user_id: 'user1', post_id: 2, content: 'Muito bom esse conteúdo' },
        ],
    });

    // ❤️ Likes
    await prisma.like.createMany({
        data: [
            { user_id: 'user2', post_id: 1 },
            { user_id: 'user3', post_id: 1 },
            { user_id: 'user1', post_id: 2 },
            { user_id: 'user3', post_id: 2 },
        ],
    });

    // 🤝 Seguidores
    await prisma.follow.createMany({
        data: [
            { followerId: 'user1', followingId: 'user2' },
            { followerId: 'user2', followingId: 'user1' },
            { followerId: 'user3', followingId: 'user1' },
        ],
    });

    console.log('✅ Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
