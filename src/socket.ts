import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export const initSocket = (server: HttpServer): SocketServer => {
    io = new SocketServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('joinRoom', (turmaId: string) => {
            socket.join(turmaId);
            console.log(`Cliente ${socket.id} entrou na sala ${turmaId}`);
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    return io;
};

export const getIO = (): SocketServer => {
    if (!io) {
        throw new Error('Socket.io não foi inicializado');
    }
    return io;
};