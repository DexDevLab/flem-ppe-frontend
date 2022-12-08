/*
  Warnings:

  - You are about to drop the column `cpf` on the `Ba_Colaboradores_Cr` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Ba_Colaboradores_Cr` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login_usuario]` on the table `Ba_Colaboradores_Cr` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login_usuario` to the `Ba_Colaboradores_Cr` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] DROP CONSTRAINT [Ba_Colaboradores_Cr_username_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] DROP COLUMN [cpf],
[username];
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] ADD [login_usuario] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] ADD CONSTRAINT [Ba_Colaboradores_Cr_login_usuario_key] UNIQUE NONCLUSTERED ([login_usuario]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
