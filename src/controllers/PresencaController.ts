import PresencaService from '../services/PresencaService';
import { Request, Response } from 'express';
import { Server } from 'socket.io';

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

export default PresencaController;
