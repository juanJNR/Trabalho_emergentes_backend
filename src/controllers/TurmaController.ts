import TurmaService from '../services/TurmaService';
import { Request, Response } from 'express';
import { Server } from 'socket.io';

const TurmaController = {
    async criarTurma(req: Request, res: Response) {
        try {
            const turma = await TurmaService.criarTurma(req.body.nome);
            res.status(201).json(turma);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    },

    async detalhesTurma(req: Request, res: Response) {
        try {
            const turma = await TurmaService.detalhesTurma(req.params.id);
            res.json(turma);
        } catch (err: any) {
            res.status(404).json({ error: err.message });
        }
    },

    async gerarToken(req: Request, res: Response, io: Server) {
        try {
            const token = await TurmaService.gerarToken(req.params.id, io);
            res.json({ token });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    },

    async listaPresenca(req: Request, res: Response) {
        try {
            const lista = await TurmaService.listaPresenca(req.params.id);
            res.json(lista);
        } catch (err: any) {
            res.status(404).json({ error: err.message });
        }
    },

    async downloadPresenca(req: Request, res: Response) {
        try {
            const txt = await TurmaService.downloadPresenca(req.params.id);
            res.setHeader('Content-Disposition', 'attachment; filename=presenca.txt');
            res.setHeader('Content-Type', 'text/plain');
            res.send(txt);
        } catch (err: any) {
            res.status(404).json({ error: err.message });
        }
    }
};

export default TurmaController;
