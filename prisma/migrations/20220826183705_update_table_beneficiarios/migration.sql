BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [superiorConcluido] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [superiorCursando] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [superiorPretende] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [tecnico_matriculado_outro] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
