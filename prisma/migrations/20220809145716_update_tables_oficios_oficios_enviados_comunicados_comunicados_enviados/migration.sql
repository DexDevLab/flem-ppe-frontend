BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ADD [anexosId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD [anexosId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios] ADD [anexosId] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD [anexosId] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
