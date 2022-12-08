/*
  Warnings:

  - You are about to drop the column `superiorModalidade_Id` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `superiorPeriodo_Id` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `superiorTipo_Id` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `tecnicoCurso_Id` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the column `tecnico_matriculado_outro` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - You are about to drop the `Ba_SuperiorModalidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ba_SuperiorPeriodo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ba_SuperiorTipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ba_TecnicoCurso` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_superiorModalidade_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_superiorPeriodo_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_superiorTipo_Id_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_tecnicoCurso_Id_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP COLUMN [superiorModalidade_Id],
[superiorPeriodo_Id],
[superiorTipo_Id],
[tecnicoCurso_Id],
[tecnico_matriculado_outro];
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD [superiorCursandoData] DATETIME2,
[superiorModalidade] NVARCHAR(1000),
[superiorPeriodo] NVARCHAR(1000),
[superiorTipo] NVARCHAR(1000),
[tecnicoCursandoOutro] NVARCHAR(1000),
[tecnicoMatriculadoOutro] NVARCHAR(1000);

-- DropTable
DROP TABLE [dbo].[Ba_SuperiorModalidade];

-- DropTable
DROP TABLE [dbo].[Ba_SuperiorPeriodo];

-- DropTable
DROP TABLE [dbo].[Ba_SuperiorTipo];

-- DropTable
DROP TABLE [dbo].[Ba_TecnicoCurso];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
