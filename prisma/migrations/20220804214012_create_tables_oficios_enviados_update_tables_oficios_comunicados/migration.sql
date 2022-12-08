BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Oficios] (
    [id] NVARCHAR(1000) NOT NULL,
    [codOficio] INT NOT NULL IDENTITY(1,1),
    [assunto] NVARCHAR(1000) NOT NULL,
    [conteudoEmail] TEXT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Oficios_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Oficios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [remetenteOficio_Id] NVARCHAR(1000),
    [templateOficio_Id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ba_Oficios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Oficios_Enviados] (
    [id] NVARCHAR(1000) NOT NULL,
    [enviado] BIT NOT NULL CONSTRAINT [Ba_Oficios_Enviados_enviado_df] DEFAULT 0,
    [conteudoEmail] TEXT NOT NULL,
    [conteudoOficio] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Oficios_Enviados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [oficio_Id] NVARCHAR(1000),
    [beneficiario_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Oficios_Enviados_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Oficios] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Oficios_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Oficios_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Oficios]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios] ADD CONSTRAINT [Ba_Oficios_templateOficio_Id_fkey] FOREIGN KEY ([templateOficio_Id]) REFERENCES [dbo].[Ba_Oficio_Template]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios] ADD CONSTRAINT [Ba_Oficios_remetenteOficio_Id_fkey] FOREIGN KEY ([remetenteOficio_Id]) REFERENCES [dbo].[Ba_Comunicados_Remetentes]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_oficio_Id_fkey] FOREIGN KEY ([oficio_Id]) REFERENCES [dbo].[Ba_Oficios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_beneficiario_Id_fkey] FOREIGN KEY ([beneficiario_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Oficios] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Oficios_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Oficios] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Oficios_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Oficios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
