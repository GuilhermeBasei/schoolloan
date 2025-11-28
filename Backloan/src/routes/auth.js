import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
  const { nome, senha } = req.body;

  try {
  
    const operador = await prisma.operador.findFirst({ where: { nome } });

    if (!operador) {
      return res.status(401).json({ error: 'Operador não encontrado' });
    }

    
    const senhaCorreta = await bcrypt.compare(senha, operador.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

   
    const token = jwt.sign(
      {
        id: operador.id,
        nome: operador.nome,
        isAdmin: operador.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

  
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
