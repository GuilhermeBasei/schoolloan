import express from 'express';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas abaixo exigem token válido
router.use(authMiddleware);

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Criar usuário
router.post('/', async (req, res) => {
  const { nome, codigo } = req.body;
  try {
    const user = await prisma.usuario.create({
      data: { nome, codigo }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar devolução pendente
router.patch('/:id/devolucao', async (req, res) => {
  const { id } = req.params;
  const { devolucaoPendente } = req.body;
  try {
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { devolucaoPendente }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar devolução' });
  }
});

export default router;
