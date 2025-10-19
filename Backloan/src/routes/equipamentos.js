import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// Listar equipamentos
router.get('/', async (req, res) => {
  const equipamentos = await prisma.equipamento.findMany();
  res.json(equipamentos);
});

// Criar equipamento
router.post('/', async (req, res) => {
  const { patrimonio, descricao } = req.body;
  try {
    const equipamento = await prisma.equipamento.create({
      data: { patrimonio, descricao }
    });
    res.status(201).json(equipamento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar equipamento' });
  }
});

// Atualizar disponibilidade
router.patch('/:id/disponivel', async (req, res) => {
  const { id } = req.params;
  const { disponivel } = req.body;
  try {
    const equipamento = await prisma.equipamento.update({
      where: { id: Number(id) },
      data: { disponivel }
    });
    res.json(equipamento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar disponibilidade' });
  }
});

export default router;
