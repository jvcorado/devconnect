// app/api/like.ts
export default async function likePost({ post_id, like }: { post_id: string; like: boolean }) {
    const res = await fetch("/api/post/like", {
        method: "POST",
        body: JSON.stringify({ post_id, like }),
        headers: { "Content-Type": "application/json" },
    });

    return res;
}
