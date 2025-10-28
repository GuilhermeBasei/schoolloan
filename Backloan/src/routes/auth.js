import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Login de operador
router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
    // Verifica se o operador existe
    const operador = await prisma.operador.findFirst({ where: { nome } });

    if (!operador) {
      return res.status(401).json({ error: 'Operador não encontrado' });
    }

    // Verifica senha com bcrypt
    const senhaCorreta = await bcrypt.compare(senha, operador.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        id: operador.id,
        nome: operador.nome,
        isAdmin: operador.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Retorna token e dados do operador
    res.json({
      message: 'Login bem-sucedido',
      token,
      operador: {
        id: operador.id,
        nome: operador.nome,
        isAdmin: operador.isAdmin,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

export default router;
