/*
  Warnings:

  - You are about to alter the column `anexosId` on the `Ba_Comunicados_Enviados` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to drop the column `tipoDocumento_Id` on the `Ba_Documentos` table. All the data in the column will be lost.
  - You are about to alter the column `anexosId` on the `Ba_Oficios` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to alter the column `anexosId` on the `Ba_Oficios_Enviados` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.
  - You are about to drop the `Ba_Documentos_Tipos` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Documentos] DROP CONSTRAINT [Ba_Documentos_tipoDocumento_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ALTER COLUMN [anexosId] TEXT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_Documentos] DROP COLUMN [tipoDocumento_Id];
ALTER TABLE [dbo].[Ba_Documentos] ADD [anexosId] TEXT;

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios] ALTER COLUMN [anexosId] TEXT NULL;

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ALTER COLUMN [anexosId] TEXT NULL;

-- DropTable
DROP TABLE [dbo].[Ba_Documentos_Tipos];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
