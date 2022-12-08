/*
  Warnings:

  - You are about to drop the column `dataPublicacaoDiarioOficial` on the `Ba_Vaga` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Vaga] DROP COLUMN [dataPublicacaoDiarioOficial];
ALTER TABLE [dbo].[Ba_Vaga] ADD [publicadoDiarioOficial] BIT NOT NULL CONSTRAINT [Ba_Vaga_publicadoDiarioOficial_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
