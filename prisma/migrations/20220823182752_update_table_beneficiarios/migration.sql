BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [cpf] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD [formacao_Id] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_formacao_Id_fkey] FOREIGN KEY ([formacao_Id]) REFERENCES [dbo].[Ba_Formacao]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
