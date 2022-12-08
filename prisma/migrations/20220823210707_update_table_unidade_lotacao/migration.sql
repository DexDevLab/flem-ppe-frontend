/*
  Warnings:

  - You are about to drop the column `unidade_lotacao` on the `Ba_Unidade_Lotacao` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Ba_Unidade_Lotacao` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `Ba_Unidade_Lotacao` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] DROP CONSTRAINT [Ba_Unidade_Lotacao_unidade_lotacao_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] DROP COLUMN [unidade_lotacao];
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] ADD [nome] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] ADD CONSTRAINT [Ba_Unidade_Lotacao_nome_key] UNIQUE NONCLUSTERED ([nome]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
