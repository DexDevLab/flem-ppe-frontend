BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Eventos_Lista_Presenca] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Eventos_Lista_Presenca_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Eventos_Lista_Presenca_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [eventoId] NVARCHAR(1000),
    [benefAssocId] NVARCHAR(1000),
    CONSTRAINT [Ba_Eventos_Lista_Presenca_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD CONSTRAINT [Ba_Eventos_Lista_Presenca_eventoId_fkey] FOREIGN KEY ([eventoId]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD CONSTRAINT [Ba_Eventos_Lista_Presenca_benefAssocId_fkey] FOREIGN KEY ([benefAssocId]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
