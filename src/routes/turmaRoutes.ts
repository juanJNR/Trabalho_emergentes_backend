import { Router } from "express";
import {
    criarTurma,
    listarTurmas,
    detalhesTurma,
    gerarQRCode,
    listaPresenca,
    downloadPresenca
} from "../controllers/TurmaController";

const router = Router();

router.post("/turmas", criarTurma);
router.get("/turmas", listarTurmas);
router.get("/turmas/:id", detalhesTurma);
router.post("/turmas/:id/qrcode", gerarQRCode);
router.get("/turmas/:id/presencas", listaPresenca);
router.get("/turmas/:id/download", downloadPresenca);

export default router;
