BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Uploads] (
    [id] NVARCHAR(1000) NOT NULL,
    [filename] NVARCHAR(1000) NOT NULL,
    [path] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Uploads_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Uploads_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [comunicado_Id] NVARCHAR(1000),
    [beneficiario_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Uploads_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
