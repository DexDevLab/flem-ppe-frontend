/*
  Warnings:

  - You are about to alter the column `matriculaFlem` on the `Ba_Beneficiarios` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_matriculaSec_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaFlem] INT NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaSec] NVARCHAR(1000) NOT NULL;

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
