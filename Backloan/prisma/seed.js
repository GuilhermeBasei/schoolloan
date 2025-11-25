
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.operador.findFirst({
    where: { nome: 'Admin' },
  })

  if (!existing) {
    await prisma.operador.create({
      data: {
        nome: 'Admin',
        senha: '$2a$10$bhidJWE70jZ0L5Z8nZNznuYNtSTu/RH2ebQnsT0cMnh03W69p.y5G', 
        isAdmin: true,
      },
    })

    console.log('✅ Operador padrão criado com sucesso!')
  } else {
    console.log('ℹ️ Operador "Admin" já existe, nada a fazer.')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
