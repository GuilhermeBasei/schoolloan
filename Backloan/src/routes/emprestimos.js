import express from 'express';
import prisma from '../config/prisma.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Todas as rotas abaixo exigem token válido
router.use(authMiddleware);

// Listar todos os empréstimos
router.get('/', async (req, res) => {
  try {
    const emprestimos = await prisma.emprestimo.findMany({
      include: { usuario: true, equipamento: true }
    });
    res.json(emprestimos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar empréstimos' });
  }
});

// Criar empréstimo
router.post('/', async (req, res) => {
  const { usuarioId, equipamentoId } = req.body;

  try {
    // Verifica se o equipamento existe
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: Number(equipamentoId) },
    });

    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // Verifica se o equipamento está disponível
    if (!equipamento.disponivel) {
      return res.status(400).json({ error: 'Este equipamento já está emprestado.' });
    }

    // Verifica se o usuário já tem uma devolução pendente
   /* const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (usuario.devolucaoPendente) {
      return res.status(400).json({ error: 'Usuário já possui um empréstimo pendente.' });
    }*/

    // Cria o empréstimo
    const emprestimo = await prisma.emprestimo.create({
      data: {
        usuarioId: Number(usuarioId),
        equipamentoId: Number(equipamentoId),
      },
    });

    // Atualiza equipamento e usuário
    await prisma.equipamento.update({
      where: { id: Number(equipamentoId) },
      data: { disponivel: false, dataUltimoEmprestimo: new Date() },
    });

    await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { devolucaoPendente: true, dataUltimoEmprestimo: new Date() },
    });

    res.status(201).json(emprestimo);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar empréstimo.' });
  }
});


  // Devolver por patrimônio do equipamento
router.patch('/devolver', async (req, res) => {
  const { patrimonio } = req.body;

  try {
    const equipamento = await prisma.equipamento.findUnique({
      where: { patrimonio },
    });

    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // Busca o empréstimo ativo
    const emprestimoAtivo = await prisma.emprestimo.findFirst({
      where: {
        equipamentoId: equipamento.id,
        ativo: true,
      },
    });

    if (!emprestimoAtivo) {
      return res.status(400).json({ error: 'Nenhum empréstimo ativo encontrado para este equipamento.' });
    }

    // Atualiza o empréstimo
    const emprestimoAtualizado = await prisma.emprestimo.update({
      where: { id: emprestimoAtivo.id },
      data: {
        ativo: false,
        dataDevolucao: new Date(),
      },
      include: { usuario: true, equipamento: true },
    });

    // Atualiza o equipamento e o usuário
    await prisma.equipamento.update({
      where: { id: equipamento.id },
      data: { disponivel: true },
    });

    await prisma.usuario.update({
      where: { id: emprestimoAtualizado.usuarioId },
      data: { devolucaoPendente: false },
    });

    res.json({
      message: 'Devolução registrada com sucesso!',
      emprestimo: emprestimoAtualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar devolução.' });
  }
});
router.get('/relatorio/diario', async (req, res) => {
  try {
    const emprestimosAtivos = await prisma.emprestimo.findMany({
      where: { ativo: true },
      include: {
        usuario: { select: { nome: true } },
        equipamento: { select: { patrimonio: true, descricao: true } },
      },
      orderBy: { dataEmprestimo: 'desc' },
    });

    // Formata data + hora no formato brasileiro
    const formatado = emprestimosAtivos.map(e => ({
      ...e,
      dataEmprestimoFormatada: new Date(e.dataEmprestimo).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }));

    res.json(formatado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar relatório diário.' });
  }
});



// Relatório mensal — empréstimos já devolvidos
router.get('/relatorio/mensal', async (req, res) => {
  try {
    const emprestimosDevolvidos = await prisma.emprestimo.findMany({
      where: { ativo: false },
      include: {
        usuario: { select: { nome: true } },
        equipamento: { select: { patrimonio: true, descricao: true } },
      },
      orderBy: { dataDevolucao: 'desc' },
    });

    // Formata data + hora no formato brasileiro
    const formatado = emprestimosDevolvidos.map(e => ({
      ...e,
      dataDevolucaoFormatada: new Date(e.dataDevolucao).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }));

    res.json(formatado);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar relatório mensal.' });
  }
});


export default router;
