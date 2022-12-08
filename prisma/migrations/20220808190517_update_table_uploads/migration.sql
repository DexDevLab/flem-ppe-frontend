/*
  Warnings:

  - You are about to drop the column `filename` on the `Ba_Uploads` table. All the data in the column will be lost.
  - Added the required column `name` to the `Ba_Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Ba_Uploads` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Uploads] DROP COLUMN [filename];
ALTER TABLE [dbo].[Ba_Uploads] ADD [name] NVARCHAR(1000) NOT NULL,
[originalName] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
