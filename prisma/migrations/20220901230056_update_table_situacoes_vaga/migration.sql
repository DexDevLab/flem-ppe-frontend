/*
  Warnings:

  - You are about to drop the column `situacao_Vaga_Id` on the `Ba_Situacoes_Vaga` table. All the data in the column will be lost.
  - You are about to drop the `Ba_SituacaoVaga` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] DROP CONSTRAINT [Ba_Situacoes_Vaga_situacao_Vaga_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_situacaoVaga_Id_fkey];

-- DropIndex
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_historico_Id_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] DROP COLUMN [situacao_Vaga_Id];
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] ADD [tipoSituacao_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Vaga] ADD [municipio_Id] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[Ba_SituacaoVaga];

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] ADD CONSTRAINT [Ba_Situacoes_Vaga_tipoSituacao_Id_fkey] FOREIGN KEY ([tipoSituacao_Id]) REFERENCES [dbo].[Ba_Tipos_Situacoes_Vaga]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_municipio_Id_fkey] FOREIGN KEY ([municipio_Id]) REFERENCES [dbo].[Ba_Municipios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_situacaoVaga_Id_fkey] FOREIGN KEY ([situacaoVaga_Id]) REFERENCES [dbo].[Ba_Situacoes_Vaga]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
