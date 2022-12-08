BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_situacaoVaga_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_unidadeLotacao_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_ausenciaEstagio_df] DEFAULT 0 FOR [ausenciaEstagio], CONSTRAINT [Ba_Beneficiarios_carteiraAssinada1Ano_df] DEFAULT 0 FOR [carteiraAssinada1Ano], CONSTRAINT [Ba_Beneficiarios_superiorConcluido_df] DEFAULT 0 FOR [superiorConcluido], CONSTRAINT [Ba_Beneficiarios_superiorCursando_df] DEFAULT 0 FOR [superiorCursando], CONSTRAINT [Ba_Beneficiarios_superiorPretende_df] DEFAULT 0 FOR [superiorPretende], CONSTRAINT [Ba_Beneficiarios_tecnico_matriculado_outro_df] DEFAULT 0 FOR [tecnico_matriculado_outro];

-- AlterTable
ALTER TABLE [dbo].[Ba_Vaga] ALTER COLUMN [situacaoVaga_Id] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Vaga] ALTER COLUMN [remessaSec_Id] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Vaga] ALTER COLUMN [unidadeLotacao_Id] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Ba_Vaga] ADD [demandante_Id] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey] FOREIGN KEY ([remessaSec_Id]) REFERENCES [dbo].[Ba_RemessaSec]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_situacaoVaga_Id_fkey] FOREIGN KEY ([situacaoVaga_Id]) REFERENCES [dbo].[Ba_SituacaoVaga]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_unidadeLotacao_Id_fkey] FOREIGN KEY ([unidadeLotacao_Id]) REFERENCES [dbo].[Ba_Unidade_Lotacao]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_demandante_Id_fkey] FOREIGN KEY ([demandante_Id]) REFERENCES [dbo].[Ba_Demandantes]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
