/*
  Warnings:

  - You are about to drop the column `nome` on the `Ba_Documentos` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Documentos] DROP COLUMN [nome];
ALTER TABLE [dbo].[Ba_Documentos] ADD [descricao] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
