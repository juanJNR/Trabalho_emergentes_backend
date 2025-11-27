import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket";
import turmaRoutes from "./routes/turmaRoutes";
import presencaRoutes from "./routes/presencaRoutes";

const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO
initSocket(server);

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", turmaRoutes);
app.use("/api", presencaRoutes);

// Rota de teste
app.get("/", (req, res) => {
    res.json({ message: "API de Presença com QR Code funcionando!" });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
