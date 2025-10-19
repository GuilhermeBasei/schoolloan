import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

// Listar operadores
router.get('/', async (req, res) => {
  const operadores = await prisma.operador.findMany();
  res.json(operadores);
});

// Criar operador
router.post('/', async (req, res) => {
  const { nome, senha, isAdmin } = req.body;
  try {
    const operador = await prisma.operador.create({
      data: { nome, senha, isAdmin }
    });
    res.status(201).json(operador);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar operador' });
  }
});

export default router;
