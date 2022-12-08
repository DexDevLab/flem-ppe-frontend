BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Materiais] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [descricao] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Materiais_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Materiais_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Materiais_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Materiais] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Materiais_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Materiais_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Materiais]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Materiais] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Materiais_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Materiais] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Materiais_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Materiais]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
