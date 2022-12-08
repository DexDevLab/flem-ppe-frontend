BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Materiais_Entregues] DROP CONSTRAINT [Ba_Materiais_Entregues_tamanhoUniforme_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD [tamanhoUniforme_Id] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD CONSTRAINT [Ba_Materiais_Entregues_tamanhoUniforme_Id_fkey] FOREIGN KEY ([tamanhoUniforme_Id]) REFERENCES [dbo].[Ba_TamanhoUniforme]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_tamanhoUniforme_Id_fkey] FOREIGN KEY ([tamanhoUniforme_Id]) REFERENCES [dbo].[Ba_TamanhoUniforme]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
