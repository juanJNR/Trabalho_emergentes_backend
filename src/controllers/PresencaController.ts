import PresencaService from '../services/PresencaService';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { prisma } from '../database';

const PresencaController = {
    async registrarPresenca(req: Request, res: Response, io: Server) {
        try {
            const { alunoNome, token } = req.body;
            const alunoIP = req.ip;
            const presenca = await PresencaService.registrarPresenca(alunoNome, alunoIP, token, io);
            res.status(201).json(presenca);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
};

export const registrarPresenca = async (req: Request, res: Response) => {
    try {
        const { token, alunoNome } = req.body;

        if (!token || !alunoNome) {
            return res.status(400).json({ error: "Token e nome do aluno são obrigatórios" });
        }

        const tokenPresenca = await prisma.tokenPresenca.findUnique({
            where: { token: String(token) },
            include: { turma: true }
        });

        if (!tokenPresenca) {
            return res.status(400).json({ error: "Token inválido" });
        }

        const alunoIP = req.ip;
        const presenca = await PresencaService.registrarPresenca(alunoNome, alunoIP, token, io);
        res.status(201).json(presenca);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export default PresencaController;
