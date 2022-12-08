/*
  Warnings:

  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Acoes_Cr` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Comunicados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Comunicados_Enviados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Contatos_Acoes_Cr` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Contatos_Beneficiarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Documentos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Eventos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ba_HistoricoId]` on the table `Ba_Eventos_Lista_Presenca` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Oficios_Enviados` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_RemessaSec` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Vaga` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP CONSTRAINT [Ba_Acoes_Cr_evento_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] DROP CONSTRAINT [Ba_Comunicados_Enviados_comunicado_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] DROP CONSTRAINT [Ba_Contatos_Acoes_Cr_historico_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] DROP CONSTRAINT [Ba_Oficios_Enviados_oficio_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey];

-- CreateIndex
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD CONSTRAINT [Ba_Contatos_Beneficiarios_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Documentos] ADD CONSTRAINT [Ba_Documentos_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD CONSTRAINT [Ba_Eventos_Lista_Presenca_ba_HistoricoId_key] UNIQUE NONCLUSTERED ([ba_HistoricoId]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_RemessaSec] ADD CONSTRAINT [Ba_RemessaSetre_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_oficio_Id_fkey] FOREIGN KEY ([oficio_Id]) REFERENCES [dbo].[Ba_Oficios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_evento_id_fkey] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_comunicado_Id_fkey] FOREIGN KEY ([comunicado_Id]) REFERENCES [dbo].[Ba_Comunicados]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey] FOREIGN KEY ([remessaSec_Id]) REFERENCES [dbo].[Ba_RemessaSec]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
