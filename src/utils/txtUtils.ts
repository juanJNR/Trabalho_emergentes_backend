import { Presenca } from '@prisma/client';

export function generateTXT(turmaNome: string, presencas: Presenca[]): string {
    let txt = `Lista de Presença - Turma ${turmaNome}\n`;
    presencas.forEach(p => {
        txt += `${p.alunoNome} — ${new Date(p.createdAt).toLocaleString()}\n`;
    });
    return txt;
}
