BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_superiorConcluido_df],
[Ba_Beneficiarios_superiorCursando_df],
[Ba_Beneficiarios_superiorPretende_df],
[Ba_Beneficiarios_tecnico_matriculado_outro_df];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
