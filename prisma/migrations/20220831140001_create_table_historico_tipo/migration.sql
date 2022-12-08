BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Historico] ADD [sigiloso] BIT NOT NULL CONSTRAINT [Ba_Historico_sigiloso_df] DEFAULT 0,
[tipoHistorico_Id] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[Ba_Historico_Tipo] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [sigiloso] BIT NOT NULL CONSTRAINT [Ba_Historico_Tipo_sigiloso_df] DEFAULT 0,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Historico_Tipo_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Historico_Tipo_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Historico_Tipo_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Historico_Tipo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Historico_Tipo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Historico_Tipo_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Historico] ADD CONSTRAINT [Ba_Historico_tipoHistorico_Id_fkey] FOREIGN KEY ([tipoHistorico_Id]) REFERENCES [dbo].[Ba_Historico_Tipo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
