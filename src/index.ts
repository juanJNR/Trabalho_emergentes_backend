import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import turmaRoutes from './routes/turmaRoutes';
import presencaRoutes from './routes/presencaRoutes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

app.use('/turmas', turmaRoutes(io));
app.use('/presenca', presencaRoutes(io));

app.get('/', (req, res) => {
    res.send('API de chamada escolar ativa!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export { io };
