/*
  Warnings:

  - You are about to drop the column `nome` on the `Ba_Contatos_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Ba_Contatos_Pontos_Focais` table. All the data in the column will be lost.
  - Added the required column `contato` to the `Ba_Contatos_Beneficiarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contato` to the `Ba_Contatos_Pontos_Focais` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] DROP COLUMN [nome];
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD [contato] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] DROP COLUMN [nome];
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ADD [contato] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
