// pages/api/post/delete/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Método não permitido" });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        await prisma.post.delete({
            where: {
                id: Number(id),
            },
        });

        return res.status(200).json({ message: "Post deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar post:", error);
        return res.status(500).json({ message: "Erro ao deletar post" });
    }
}
