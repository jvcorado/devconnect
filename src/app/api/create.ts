export default async function create({ path, body }: { path: string; body: any }) {
    return fetch(`/api/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(async (res) => {
        const data = await res.json();
        return { status: res.status, data };
    });
}
