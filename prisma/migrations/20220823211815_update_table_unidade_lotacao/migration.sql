/*
  Warnings:

  - Added the required column `uf` to the `Ba_Unidade_Lotacao` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] ADD [complemento] NVARCHAR(1000),
[uf] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
