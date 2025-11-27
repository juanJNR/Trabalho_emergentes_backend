import express from 'express';
import PresencaController from '../controllers/PresencaController';
import { Server } from 'socket.io';

export default (io: Server) => {
    const router = express.Router();

    router.post('/', (req, res) => PresencaController.registrarPresenca(req, res, io));

    return router;
};
