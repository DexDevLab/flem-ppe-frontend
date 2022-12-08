BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Municipios] ADD [territorioIdentidade_Id] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[Ba_TerritoriosIdentidade] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_TerritoriosIdentidade_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000),
    [updatedBy] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_TerritoriosIdentidade_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_TerritoriosIdentidade_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Municipios] ADD CONSTRAINT [Ba_Municipios_territorioIdentidade_Id_fkey] FOREIGN KEY ([territorioIdentidade_Id]) REFERENCES [dbo].[Ba_TerritoriosIdentidade]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
