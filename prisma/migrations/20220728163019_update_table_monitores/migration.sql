/*
  Warnings:

  - You are about to drop the column `escritorio_RegionalId` on the `Ba_Monitores` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Ba_Monitores` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Monitores] DROP CONSTRAINT [Ba_Monitores_escritorio_RegionalId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Monitores] DROP COLUMN [escritorio_RegionalId];
ALTER TABLE [dbo].[Ba_Monitores] ADD [nome] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[_Ba_Escritorio_RegionalToBa_Monitores] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_Escritorio_RegionalToBa_Monitores_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_Escritorio_RegionalToBa_Monitores_B_index] ON [dbo].[_Ba_Escritorio_RegionalToBa_Monitores]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Escritorio_RegionalToBa_Monitores] ADD CONSTRAINT [_Ba_Escritorio_RegionalToBa_Monitores_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Escritorio_Regional]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Escritorio_RegionalToBa_Monitores] ADD CONSTRAINT [_Ba_Escritorio_RegionalToBa_Monitores_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Monitores]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
