BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Materiais_Entregues] (
    [id] NVARCHAR(1000) NOT NULL,
    [dataEntrega] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Materiais_Entregues_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Materiais_Entregues_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Materiais_Entregues_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Materiais_Entregues_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [tipoMaterial_Id] NVARCHAR(1000),
    [beneficiarios_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Materiais_Entregues_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD CONSTRAINT [Ba_Materiais_Entregues_tipoMaterial_Id_fkey] FOREIGN KEY ([tipoMaterial_Id]) REFERENCES [dbo].[Ba_Materiais]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD CONSTRAINT [Ba_Materiais_Entregues_beneficiarios_Id_fkey] FOREIGN KEY ([beneficiarios_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
