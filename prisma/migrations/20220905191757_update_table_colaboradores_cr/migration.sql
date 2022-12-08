/*
  Warnings:

  - You are about to drop the column `matriculaFlem` on the `Ba_Colaboradores_Cr` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Ba_Colaboradores_Cr` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] DROP CONSTRAINT [Ba_Colaboradores_Cr_matriculaFlem_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] DROP COLUMN [matriculaFlem];
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] ADD [username] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] ADD CONSTRAINT [Ba_Colaboradores_Cr_username_key] UNIQUE NONCLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
