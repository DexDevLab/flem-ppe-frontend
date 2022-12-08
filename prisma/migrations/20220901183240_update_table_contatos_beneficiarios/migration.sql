BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] DROP CONSTRAINT [Ba_Contatos_Beneficiarios_historico_Id_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
