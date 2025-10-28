import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ message: 'Nome e senha são obrigatórios' });
    }

    // findFirst porque nome não é unique
    const operador = await prisma.operador.findFirst({
      where: { nome },
    });

    if (!operador) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, operador.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({
      message: 'Login bem-sucedido',
      operador: {
        id: operador.id,
        nome: operador.nome,
        isAdmin: operador.isAdmin,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

export default router;
