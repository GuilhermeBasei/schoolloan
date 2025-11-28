import express from 'express';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany();
    res.json(equipamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar equipamentos' });
  }
});


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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { patrimonio, descricao } = req.body;
  try {
    const equipamento = await prisma.equipamento.update({
      where: { id: Number(id) },
      data: { patrimonio, descricao },
    });
    res.json(equipamento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar equipamento' });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.equipamento.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir equipamento' });
  }
});


export default router;
