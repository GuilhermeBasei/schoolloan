import express from 'express'
import prisma from '../config/prisma.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router()

// Todas as rotas abaixo exigem token válido
router.use(authMiddleware)

// Listar todos os usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { id: 'asc' }
    })
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' })
  }
})

// Criar usuário
router.post('/', async (req, res) => {
  const { nome, codigo, email } = req.body; 
  try {
    const existente = await prisma.usuario.findUnique({ where: { codigo } })
    if (existente) return res.status(400).json({ error: 'Código já cadastrado.' })

    const user = await prisma.usuario.create({
      data: { nome, codigo, email }
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar usuário' })
  }
})

// Atualizar usuário
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nome, codigo, email } = req.body 
  try {
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nome, codigo, email }
    })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário' })
  }
})

// Excluir usuário
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } })
    res.json({ message: 'Usuário excluído com sucesso.' })
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir usuário.' })
  }
})

export default router
