/*
  Warnings:

  - You are about to drop the column `eixoFormacao_Id` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the `Ba_EixoFormacao` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_eixoFormacao_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP COLUMN [eixoFormacao_Id];

-- DropTable
DROP TABLE [dbo].[Ba_EixoFormacao];

-- CreateTable
CREATE TABLE [dbo].[Ba_Pendencias] (
    [id] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Pendencias_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Pendencias_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Pendencias_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Pendencias_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [tipoPendencia_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Pendencias_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Pendencias_Tipos] (
    [id] NVARCHAR(1000) NOT NULL,
    [label] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Pendencias_Tipos_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Pendencias_Tipos_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Pendencias_Tipos_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Pendencias_Tipos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Pendencias_Tipos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Pendencias] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Pendencias_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Pendencias_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Pendencias]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Pendencias] ADD CONSTRAINT [Ba_Pendencias_tipoPendencia_Id_fkey] FOREIGN KEY ([tipoPendencia_Id]) REFERENCES [dbo].[Ba_Pendencias_Tipos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Pendencias] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Pendencias_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Pendencias] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Pendencias_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Pendencias]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
