import { PrismaClient } from '@prisma/client';
import { generateToken, getExpirationDate } from '../utils/tokenUtils';
import { generateTXT } from '../utils/txtUtils';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

// Mapa para controlar os timers de cada turma
const turmaTimers: Map<number, NodeJS.Timeout> = new Map();

const TurmaService = {
    async criarTurma(nome: string) {
        return await prisma.turma.create({ data: { nome } });
    },

    async detalhesTurma(id: string) {
        return await prisma.turma.findUnique({ where: { id: Number(id) } });
    },

    async gerarToken(turmaId: string, io: Server) {
        const turmaIdNum = Number(turmaId);
        const token = generateToken();
        const expiraEm = getExpirationDate(20); // 20 segundos
        const turma = await prisma.turma.findUnique({ where: { id: turmaIdNum } });
        if (!turma) throw new Error('Turma não encontrada');

        // Limpar timer anterior se existir
        if (turmaTimers.has(turmaIdNum)) {
            clearTimeout(turmaTimers.get(turmaIdNum));
        }

        // Deletar tokens antigos desta turma
        await prisma.tokenPresenca.deleteMany({ where: { turmaId: turmaIdNum } });

        const tokenPresenca = await prisma.tokenPresenca.create({
            data: { token, turmaId: turmaIdNum, expiraEm }
        });
        io.emit('novoToken', { token, turmaId: turmaIdNum });

        // Gerar novo token automaticamente após 20 segundos
        const timer = setTimeout(() => {
            this.gerarToken(turmaId, io);
        }, 20000);

        turmaTimers.set(turmaIdNum, timer);

        return token;
    },

    async listaPresenca(turmaId: string) {
        return await prisma.presenca.findMany({
            where: { turmaId: Number(turmaId) },
            orderBy: { createdAt: 'asc' }
        });
    },

    async downloadPresenca(turmaId: string) {
        const turma = await prisma.turma.findUnique({ where: { id: Number(turmaId) } });
        if (!turma) throw new Error('Turma não encontrada');
        const presencas = await prisma.presenca.findMany({
            where: { turmaId: Number(turmaId) },
            orderBy: { createdAt: 'asc' }
        });
        return generateTXT(turma.nome, presencas);
    }
};

export default TurmaService;
