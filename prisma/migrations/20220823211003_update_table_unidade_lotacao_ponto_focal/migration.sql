/*
  Warnings:

  - You are about to drop the column `ba_PontoFocalId` on the `Ba_Unidade_Lotacao` table. All the data in the column will be lost.
  - You are about to drop the `_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal] DROP CONSTRAINT [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal] DROP CONSTRAINT [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_B_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Unidade_Lotacao] DROP COLUMN [ba_PontoFocalId];

-- AlterTable
ALTER TABLE [dbo].[Ba_Unidade_Lotacao_Ponto_Focal] ADD [unidadeLotacao_Id] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal];

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Unidade_Lotacao_Ponto_Focal] ADD CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_unidadeLotacao_Id_fkey] FOREIGN KEY ([unidadeLotacao_Id]) REFERENCES [dbo].[Ba_Unidade_Lotacao]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
