import express from 'express';
import TurmaController from '../controllers/TurmaController';
import { Server } from 'socket.io';

export default (io: Server) => {
    const router = express.Router();

    router.post('/', TurmaController.criarTurma);
    router.get('/:id', TurmaController.detalhesTurma);
    router.post('/:id/gerar-token', (req, res) => TurmaController.gerarToken(req, res, io));
    router.get('/:id/presenca', TurmaController.listaPresenca);
    router.get('/:id/download', TurmaController.downloadPresenca);

    return router;
};
