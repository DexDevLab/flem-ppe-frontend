/*
  Warnings:

  - You are about to drop the column `contato` on the `Ba_Contatos_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `contato` on the `Ba_Contatos_Pontos_Focais` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Ba_Contatos_Beneficiarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Ba_Contatos_Pontos_Focais` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] DROP CONSTRAINT [Ba_Contatos_Pontos_Focais_pontoFocal_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] DROP COLUMN [contato];
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD [nome] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ALTER COLUMN [pontoFocal_Id] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] DROP COLUMN [contato];
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ADD [nome] NVARCHAR(1000) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ADD CONSTRAINT [Ba_Contatos_Pontos_Focais_pontoFocal_Id_fkey] FOREIGN KEY ([pontoFocal_Id]) REFERENCES [dbo].[Ba_Unidade_Lotacao_Ponto_Focal]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
