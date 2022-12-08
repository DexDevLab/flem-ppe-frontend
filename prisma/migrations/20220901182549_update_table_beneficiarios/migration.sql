BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_matriculaSec_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaFlem] BIGINT NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaSec] BIGINT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_matriculaSec_key] UNIQUE NONCLUSTERED ([matriculaSec]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
