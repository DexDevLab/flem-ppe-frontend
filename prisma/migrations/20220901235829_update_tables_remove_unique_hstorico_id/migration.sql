BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP CONSTRAINT [Ba_Acoes_Cr_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] DROP CONSTRAINT [Ba_Comunicados_Enviados_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] DROP CONSTRAINT [Ba_Contatos_Acoes_Cr_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Documentos] DROP CONSTRAINT [Ba_Documentos_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Eventos] DROP CONSTRAINT [Ba_Eventos_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Materiais_Entregues] DROP CONSTRAINT [Ba_Materiais_Entregues_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Oficios] DROP CONSTRAINT [Ba_Oficios_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_Oficios_Enviados] DROP CONSTRAINT [Ba_Oficios_Enviados_historico_Id_key];

-- DropIndex
ALTER TABLE [dbo].[Ba_RemessaSec] DROP CONSTRAINT [Ba_RemessaSetre_historico_Id_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
