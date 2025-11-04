import express from 'express';
import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas abaixo exigem token válido
router.use(authMiddleware);

// 🔹 Listar operadores
router.get('/', async (req, res) => {
  try {
    const operadores = await prisma.operador.findMany();
    res.json(operadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar operadores' });
  }
});

// 🔹 Criar operador
router.post('/', async (req, res) => {
  const { nome, senha, isAdmin } = req.body;
  if (!nome || !senha) {
    return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
  }
  try {
    const hashed = await bcrypt.hash(senha, 10);
    const operador = await prisma.operador.create({
      data: { nome, senha: hashed, isAdmin: isAdmin || false },
    });
    res.status(201).json(operador);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar operador.' });
  }
});

// 🔹 Atualizar operador
router.put('/:id', async (req, res) => {
  const { nome, senha, isAdmin } = req.body;
  const { id } = req.params;

  try {
    const data = { nome, isAdmin };
    if (senha) data.senha = await bcrypt.hash(senha, 10);

    const operador = await prisma.operador.update({
      where: { id: Number(id) },
      data,
    });
    res.json(operador);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar operador.' });
  }
});

// 🔹 Excluir operador
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.operador.delete({ where: { id: Number(id) } });
    res.json({ message: 'Operador excluído com sucesso.' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir operador.' });
  }
});

export default router;
