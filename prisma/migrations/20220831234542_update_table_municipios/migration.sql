/*
  Warnings:

  - Made the column `createdBy` on table `Ba_Comunicados` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Ba_Comunicados` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Ba_Eventos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Ba_Eventos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Ba_Monitores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Ba_Monitores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Ba_Municipios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Ba_Municipios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Ba_TerritoriosIdentidade` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedBy` on table `Ba_TerritoriosIdentidade` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ALTER COLUMN [createdBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Comunicados] ALTER COLUMN [updatedBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Comunicados] ADD CONSTRAINT [Ba_Comunicados_createdBy_df] DEFAULT 'SISTEMA' FOR [createdBy], CONSTRAINT [Ba_Comunicados_updatedBy_df] DEFAULT 'SISTEMA' FOR [updatedBy];

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] ALTER COLUMN [createdBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Eventos] ALTER COLUMN [updatedBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_createdBy_df] DEFAULT 'SISTEMA' FOR [createdBy], CONSTRAINT [Ba_Eventos_updatedBy_df] DEFAULT 'SISTEMA' FOR [updatedBy];

-- AlterTable
ALTER TABLE [dbo].[Ba_Monitores] ALTER COLUMN [createdBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Monitores] ALTER COLUMN [updatedBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Monitores] ADD CONSTRAINT [Ba_Monitores_createdBy_df] DEFAULT 'SISTEMA' FOR [createdBy], CONSTRAINT [Ba_Monitores_updatedBy_df] DEFAULT 'SISTEMA' FOR [updatedBy];

-- AlterTable
ALTER TABLE [dbo].[Ba_Municipios] ALTER COLUMN [createdBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Municipios] ALTER COLUMN [updatedBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_Municipios] ADD CONSTRAINT [Ba_Municipios_createdBy_df] DEFAULT 'SISTEMA' FOR [createdBy], CONSTRAINT [Ba_Municipios_updatedBy_df] DEFAULT 'SISTEMA' FOR [updatedBy];

-- AlterTable
ALTER TABLE [dbo].[Ba_TerritoriosIdentidade] ALTER COLUMN [createdBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_TerritoriosIdentidade] ALTER COLUMN [updatedBy] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Ba_TerritoriosIdentidade] ADD CONSTRAINT [Ba_TerritoriosIdentidade_createdBy_df] DEFAULT 'SISTEMA' FOR [createdBy], CONSTRAINT [Ba_TerritoriosIdentidade_updatedBy_df] DEFAULT 'SISTEMA' FOR [updatedBy];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
