/*
  Warnings:

  - You are about to drop the column `beneficiario_Id` on the `Ba_Uploads` table. All the data in the column will be lost.
  - You are about to drop the column `comunicado_Id` on the `Ba_Uploads` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Uploads] DROP COLUMN [beneficiario_Id],
[comunicado_Id];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
