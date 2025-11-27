import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

const PresencaService = {
    async registrarPresenca(alunoNome: string, alunoIP: string, token: string, io: Server) {
        // Verifica token válido e não expirado
        const tokenPresenca = await prisma.tokenPresenca.findUnique({ where: { token } });
        if (!tokenPresenca) throw new Error('Token inválido');
        if (new Date() > tokenPresenca.expiraEm) throw new Error('Token expirado');

        // Verifica se já existe presença do mesmo IP ou nome na turma
        const jaPresente = await prisma.presenca.findFirst({
            where: {
                turmaId: tokenPresenca.turmaId,
                OR: [
                    { alunoIP },
                    { alunoNome }
                ]
            }
        });
        if (jaPresente) throw new Error('Presença já registrada para este IP ou nome');

        // Registra presença
        const presenca = await prisma.presenca.create({
            data: {
                alunoNome,
                alunoIP,
                turmaId: tokenPresenca.turmaId
            }
        });

        // Remove token (one-time)
        await prisma.tokenPresenca.delete({ where: { token } });

        // Atualiza lista em tempo real
        io.emit('atualizarPresenca', { turmaId: tokenPresenca.turmaId });

        return presenca;
    }
};

export default PresencaService;
