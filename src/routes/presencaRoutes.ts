import { Router } from "express";
import { registrarPresenca } from "../controllers/PresencaController";

const router = Router();

router.post("/presencas", registrarPresenca);

export default router;
