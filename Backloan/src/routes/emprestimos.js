import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// Listar todos os empréstimos
router.get('/', async (req, res) => {
  const emprestimos = await prisma.emprestimo.findMany({
    include: { usuario: true, equipamento: true }
  });
  res.json(emprestimos);
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

// Devolver equipamento
router.patch('/:id/devolver', async (req, res) => {
  const { id } = req.params;
  try {
    const emprestimo = await prisma.emprestimo.update({
      where: { id: Number(id) },
      data: { ativo: false, dataDevolucao: new Date() },
      include: { usuario: true, equipamento: true }
    });

    // Atualiza status do equipamento e usuário
    await prisma.equipamento.update({
      where: { id: emprestimo.equipamentoId },
      data: { disponivel: true }
    });

    await prisma.usuario.update({
      where: { id: emprestimo.usuarioId },
      data: { devolucaoPendente: false }
    });

    res.json(emprestimo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao devolver equipamento' });
  }
});

export default router;
