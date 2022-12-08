/*
  Warnings:

  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Materiais_Entregues` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD [historico_Id] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD CONSTRAINT [Ba_Materiais_Entregues_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD CONSTRAINT [Ba_Materiais_Entregues_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
