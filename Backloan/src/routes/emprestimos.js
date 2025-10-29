import express from 'express';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas abaixo exigem token válido
router.use(authMiddleware);

// Listar todos os empréstimos
router.get('/', async (req, res) => {
  try {
    const emprestimos = await prisma.emprestimo.findMany({
      include: { usuario: true, equipamento: true }
    });
    res.json(emprestimos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar empréstimos' });
  }
});

// Criar empréstimo
router.post('/', async (req, res) => {
  const { usuarioId, equipamentoId } = req.body;
  try {
    // Atualiza equipamento e usuário
    await prisma.equipamento.update({
      where: { id: Number(equipamentoId) },
      data: { disponivel: false, dataUltimoEmprestimo: new Date() }
    });

    await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { devolucaoPendente: true, dataUltimoEmprestimo: new Date() }
    });

    const emprestimo = await prisma.emprestimo.create({
      data: { usuarioId: Number(usuarioId), equipamentoId: Number(equipamentoId) }
    });

    res.status(201).json(emprestimo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar empréstimo' });
  }
});


  // Devolver por patrimônio do equipamento
router.patch('/devolver', async (req, res) => {
  const { patrimonio } = req.body;

  try {
    const equipamento = await prisma.equipamento.findUnique({
      where: { patrimonio },
    });

    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // Busca o empréstimo ativo
    const emprestimoAtivo = await prisma.emprestimo.findFirst({
      where: {
        equipamentoId: equipamento.id,
        ativo: true,
      },
    });

    if (!emprestimoAtivo) {
      return res.status(400).json({ error: 'Nenhum empréstimo ativo encontrado para este equipamento.' });
    }

    // Atualiza o empréstimo
    const emprestimoAtualizado = await prisma.emprestimo.update({
      where: { id: emprestimoAtivo.id },
      data: {
        ativo: false,
        dataDevolucao: new Date(),
      },
      include: { usuario: true, equipamento: true },
    });

    // Atualiza o equipamento e o usuário
    await prisma.equipamento.update({
      where: { id: equipamento.id },
      data: { disponivel: true },
    });

    await prisma.usuario.update({
      where: { id: emprestimoAtualizado.usuarioId },
      data: { devolucaoPendente: false },
    });

    res.json({
      message: 'Devolução registrada com sucesso!',
      emprestimo: emprestimoAtualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar devolução.' });
  }
});


export default router;
