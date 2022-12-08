BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Comunicados] (
    [id] NVARCHAR(1000) NOT NULL,
    [assunto] NVARCHAR(1000) NOT NULL,
    [conteudoEmail] TEXT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Comunicados_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Comunicados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [remetenteComunicado_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Comunicados_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Remetentes_Comunicados] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Remetentes_Comunicados_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Remetentes_Comunicados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Remetentes_Comunicados_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Remetentes_Comunicados_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Envios_Comunicados] (
    [id] NVARCHAR(1000) NOT NULL,
    [enviado] BIT NOT NULL CONSTRAINT [Ba_Envios_Comunicados_enviado_df] DEFAULT 0,
    [conteudoEmail] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Envios_Comunicados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [comunicado_Id] NVARCHAR(1000),
    [beneficiario_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Envios_Comunicados_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Comunicados] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Comunicados_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Comunicados_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Comunicados]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_remetenteComunicado_Id_fkey] FOREIGN KEY ([remetenteComunicado_Id]) REFERENCES [dbo].[Ba_Remetentes_Comunicados]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Envios_Comunicados] ADD CONSTRAINT [Ba_Envios_Comunicados_comunicado_Id_fkey] FOREIGN KEY ([comunicado_Id]) REFERENCES [dbo].[Ba_Comunicados]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Envios_Comunicados] ADD CONSTRAINT [Ba_Envios_Comunicados_beneficiario_Id_fkey] FOREIGN KEY ([beneficiario_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Comunicados] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Comunicados_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Comunicados] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Comunicados_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Comunicados]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
