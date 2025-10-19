-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "dataUltimoEmprestimo" TIMESTAMP(3),
    "devolucaoPendente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipamentos" (
    "id" SERIAL NOT NULL,
    "patrimonio" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataUltimoEmprestimo" TIMESTAMP(3),
    "disponivel" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "equipamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operadores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "operadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emprestimos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "equipamentoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataEmprestimo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDevolucao" TIMESTAMP(3),

    CONSTRAINT "emprestimos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigo_key" ON "usuarios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "equipamentos_patrimonio_key" ON "equipamentos"("patrimonio");

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "equipamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
