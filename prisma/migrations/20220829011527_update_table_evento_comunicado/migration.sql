BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] DROP CONSTRAINT [Ba_Comunicados_historico_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ADD [evento_Id] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_evento_Id_fkey] FOREIGN KEY ([evento_Id]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
