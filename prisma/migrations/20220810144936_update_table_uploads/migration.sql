/*
  Warnings:

  - Added the required column `referencesTo` to the `Ba_Uploads` table without a default value. This is not possible if the table is not empty.
  - Made the column `path` on table `Ba_Uploads` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Uploads] ALTER COLUMN [path] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Uploads] ADD [referencesTo] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
