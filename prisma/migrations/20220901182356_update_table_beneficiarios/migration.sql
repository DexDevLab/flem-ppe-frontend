/*
  Warnings:

  - You are about to drop the column `ba_RemessaSetreId` on the `Ba_SituacaoVaga` table. All the data in the column will be lost.
  - Made the column `matriculaFlem` on table `Ba_Beneficiarios` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_matriculaFlem_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaFlem] BIGINT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_SituacaoVaga] DROP COLUMN [ba_RemessaSetreId];

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_matriculaFlem_key] UNIQUE NONCLUSTERED ([matriculaFlem]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
