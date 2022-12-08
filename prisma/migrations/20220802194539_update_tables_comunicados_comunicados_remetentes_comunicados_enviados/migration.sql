/*
  Warnings:

  - You are about to drop the `Ba_Envios_Comunicados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ba_Remetentes_Comunicados` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `codComunicado` to the `Ba_Comunicados` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] DROP CONSTRAINT [Ba_Comunicados_remetenteComunicado_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Envios_Comunicados] DROP CONSTRAINT [Ba_Envios_Comunicados_beneficiario_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Envios_Comunicados] DROP CONSTRAINT [Ba_Envios_Comunicados_comunicado_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ADD [codComunicado] INT NOT NULL IDENTITY(1,1);

-- DropTable
DROP TABLE [dbo].[Ba_Envios_Comunicados];

-- DropTable
DROP TABLE [dbo].[Ba_Remetentes_Comunicados];

-- CreateTable
CREATE TABLE [dbo].[Ba_Comunicados_Remetentes] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Comunicados_Remetentes_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Comunicados_Remetentes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Comunicados_Remetentes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Comunicados_Remetentes_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Comunicados_Enviados] (
    [id] NVARCHAR(1000) NOT NULL,
    [enviado] BIT NOT NULL CONSTRAINT [Ba_Comunicados_Enviados_enviado_df] DEFAULT 0,
    [conteudoEmail] TEXT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Comunicados_Enviados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [comunicado_Id] NVARCHAR(1000),
    [beneficiario_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Comunicados_Enviados_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_remetenteComunicado_Id_fkey] FOREIGN KEY ([remetenteComunicado_Id]) REFERENCES [dbo].[Ba_Comunicados_Remetentes]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_comunicado_Id_fkey] FOREIGN KEY ([comunicado_Id]) REFERENCES [dbo].[Ba_Comunicados]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_beneficiario_Id_fkey] FOREIGN KEY ([beneficiario_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
