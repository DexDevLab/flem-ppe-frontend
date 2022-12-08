/*
  Warnings:

  - You are about to drop the column `nome` on the `Ba_Eventos_Lista_Presenca` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] DROP COLUMN [nome];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
