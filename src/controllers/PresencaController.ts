import { Request, Response } from "express";
import { getIO } from "../socket";
import PresencaService from "../services/PresencaService";

export const registrarPresenca = async (req: Request, res: Response) => {
    try {
        const { token, alunoNome } = req.body;
        const alunoIP = req.ip || req.socket.remoteAddress || "unknown";

        if (!token || !alunoNome) {
            return res.status(400).json({ error: "Token e nome do aluno são obrigatórios" });
        }

        const io = getIO();
        const presenca = await PresencaService.registrarPresenca(
            String(alunoNome),
            String(alunoIP),
            String(token),
            io
        );

        res.status(201).json(presenca);
    } catch (error: any) {
        console.error("Erro ao registrar presença:", error);
        res.status(400).json({ error: error.message || "Erro ao registrar presença" });
    }
};
