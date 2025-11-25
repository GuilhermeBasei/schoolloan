/*
  Warnings:

  - Made the column `salaUtilizacao` on table `emprestimos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "emprestimos" ALTER COLUMN "salaUtilizacao" SET NOT NULL;
