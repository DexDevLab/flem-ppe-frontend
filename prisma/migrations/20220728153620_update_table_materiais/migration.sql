/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Ba_Materiais` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Ba_Materiais] ADD CONSTRAINT [Ba_Materiais_nome_key] UNIQUE NONCLUSTERED ([nome]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
