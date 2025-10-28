import express from 'express';
import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Listar operadores (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const operadores = await prisma.operador.findMany();
    res.json(operadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar operadores' });
  }
});

// Criar operador (não precisa de login)
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
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar operador.' });
  }
});

export default router;
