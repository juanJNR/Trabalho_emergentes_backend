import TurmaService from '../services/TurmaService';
import { Request, Response } from 'express';
import { getIO } from '../socket';
import QRCode from 'qrcode';
import { prisma } from '../prisma/client';

export const criarTurma = async (req: Request, res: Response) => {
    try {
        const turma = await TurmaService.criarTurma(req.body.nome);
        res.status(201).json(turma);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const listarTurmas = async (req: Request, res: Response) => {
    try {
        const turmas = await prisma.turma.findMany({
            include: {
                _count: {
                    select: { presencas: true }
                }
            }
        });
        res.json(turmas);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const detalhesTurma = async (req: Request, res: Response) => {
    try {
        const turma = await TurmaService.detalhesTurma(req.params.id);
        res.json(turma);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};

export const gerarQRCode = async (req: Request, res: Response) => {
    try {
        const io = getIO();
        const token = await TurmaService.gerarToken(req.params.id, io);
        const qrCodeDataURL = await QRCode.toDataURL(token);
        res.json({ token, qrCode: qrCodeDataURL });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const listaPresenca = async (req: Request, res: Response) => {
    try {
        const lista = await TurmaService.listaPresenca(req.params.id);
        res.json(lista);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};

export const downloadPresenca = async (req: Request, res: Response) => {
    try {
        const txt = await TurmaService.downloadPresenca(req.params.id);
        res.setHeader('Content-Disposition', 'attachment; filename=presenca.txt');
        res.setHeader('Content-Type', 'text/plain');
        res.send(txt);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};
