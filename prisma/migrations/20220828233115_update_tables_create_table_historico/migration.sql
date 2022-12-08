/*
  Warnings:

  - You are about to drop the column `beneficiario_Id` on the `Ba_Historico` table. All the data in the column will be lost.
  - You are about to drop the column `categoria_Id` on the `Ba_Historico` table. All the data in the column will be lost.
  - You are about to drop the `Ba_Historico_Categoria` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[historico_Id]` on the table `Ba_Oficios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria` to the `Ba_Historico` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP CONSTRAINT [Ba_Acoes_Cr_evento_id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] DROP CONSTRAINT [Ba_Comunicados_Enviados_comunicado_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] DROP CONSTRAINT [Ba_Eventos_Lista_Presenca_eventoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Historico] DROP CONSTRAINT [Ba_Historico_beneficiario_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Historico] DROP CONSTRAINT [Ba_Historico_categoria_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] DROP CONSTRAINT [Ba_Oficios_Enviados_oficio_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Vaga] DROP CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Documentos] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD [ba_HistoricoId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Historico] DROP COLUMN [beneficiario_Id],
[categoria_Id];
ALTER TABLE [dbo].[Ba_Historico] ADD [categoria] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_RemessaSec] ADD [historico_Id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Vaga] ADD [historico_Id] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[Ba_Historico_Categoria];

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Historico] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Historico_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Historico_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Historico]([B]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Oficios] ADD CONSTRAINT [Ba_Oficios_historico_Id_key] UNIQUE NONCLUSTERED ([historico_Id]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios] ADD CONSTRAINT [Ba_Oficios_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_oficio_Id_fkey] FOREIGN KEY ([oficio_Id]) REFERENCES [dbo].[Ba_Oficios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD CONSTRAINT [Ba_Oficios_Enviados_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD CONSTRAINT [Ba_Eventos_Lista_Presenca_eventoId_fkey] FOREIGN KEY ([eventoId]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD CONSTRAINT [Ba_Eventos_Lista_Presenca_ba_HistoricoId_fkey] FOREIGN KEY ([ba_HistoricoId]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_evento_id_fkey] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_comunicado_Id_fkey] FOREIGN KEY ([comunicado_Id]) REFERENCES [dbo].[Ba_Comunicados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD CONSTRAINT [Ba_Comunicados_Enviados_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD CONSTRAINT [Ba_Contatos_Beneficiarios_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Documentos] ADD CONSTRAINT [Ba_Documentos_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey] FOREIGN KEY ([remessaSec_Id]) REFERENCES [dbo].[Ba_RemessaSec]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_RemessaSec] ADD CONSTRAINT [Ba_RemessaSetre_historico_Id_fkey] FOREIGN KEY ([historico_Id]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Historico] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Historico_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Historico] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Historico_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Historico]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
