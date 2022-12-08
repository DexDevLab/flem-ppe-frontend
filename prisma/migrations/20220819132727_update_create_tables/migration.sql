/*
  Warnings:

  - You are about to drop the column `matriculaSaeb` on the `Ba_Beneficiarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matriculaSec]` on the table `Ba_Beneficiarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `Ba_Beneficiarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ctps]` on the table `Ba_Beneficiarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pis]` on the table `Ba_Beneficiarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matriculaSec` to the `Ba_Beneficiarios` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP CONSTRAINT [Ba_Beneficiarios_matriculaSaeb_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Acoes_Cr_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Acoes_Cr_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Beneficiarios] ALTER COLUMN [matriculaFlem] INT NULL;
ALTER TABLE [dbo].[Ba_Beneficiarios] DROP COLUMN [matriculaSaeb];
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD [anamnese] BIT NOT NULL CONSTRAINT [Ba_Beneficiarios_anamnese_df] DEFAULT 0,
[ausenciaEstagio] BIT,
[bairro] NVARCHAR(1000),
[carteiraAssinada1Ano] BIT,
[cep] NVARCHAR(1000),
[complemento] NVARCHAR(1000),
[createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Beneficiarios_createdBy_df] DEFAULT 'SISTEMA',
[ctps] NVARCHAR(1000),
[dataInicioAtividade] DATETIME2,
[dataNasc] DATETIME2,
[deficiencia] NVARCHAR(1000),
[eixoFormacao_Id] NVARCHAR(1000),
[etnia_Id] NVARCHAR(1000),
[logradouro] NVARCHAR(1000),
[matriculaSec] INT NOT NULL,
[municipio] NVARCHAR(1000),
[numero] NVARCHAR(1000),
[observacao] TEXT,
[pis] NVARCHAR(1000),
[rg] NVARCHAR(1000),
[sexo] NVARCHAR(1000),
[superiorAnoConclusao] INT,
[superiorConcluido] BIT,
[superiorCursando] BIT,
[superiorCurso] NVARCHAR(1000),
[superiorInstituicao] NVARCHAR(1000),
[superiorModalidade_Id] NVARCHAR(1000),
[superiorPeriodo_Id] NVARCHAR(1000),
[superiorPretende] BIT,
[superiorTipo_Id] NVARCHAR(1000),
[tamanhoUniforme_Id] NVARCHAR(1000),
[tecnicoCurso_Id] NVARCHAR(1000),
[tecnico_matriculado_outro] BIT,
[uf] NVARCHAR(1000),
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Beneficiarios_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Colaboradores_Cr] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Colaboradores_Cr_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Colaboradores_Cr_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados] ADD [createdBy] NVARCHAR(1000),
[updatedBy] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados_Enviados] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Comunicados_Enviados_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Comunicados_Enviados_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Comunicados_Remetentes] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Comunicados_Remetentes_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Comunicados_Remetentes_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Acoes_Cr_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Acoes_Cr_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Demandantes] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Demandantes_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Demandantes_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Eixo_Formacao] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Eixo_Formacao_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Eixo_Formacao_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Escritorio_Regional] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Escritorio_Regional_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Escritorio_Regional_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] ADD [createdBy] NVARCHAR(1000),
[updatedBy] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos_Lista_Presenca] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Eventos_Lista_Presenca_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Eventos_Lista_Presenca_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Formacao] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Formacao_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Formacao_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Locais_Eventos] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Locais_Eventos_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Locais_Eventos_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Materiais] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Materiais_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Materiais_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Monitores] ADD [createdBy] NVARCHAR(1000),
[updatedBy] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Municipios] ADD [createdBy] NVARCHAR(1000),
[updatedBy] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficio_Template] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficio_Template_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficio_Template_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficio_Tipo] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficio_Tipo_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficio_Tipo_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficios_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficios_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Oficios_Enviados] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficios_Enviados_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Oficios_Enviados_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Situacoes_Vaga_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Situacoes_Vaga_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Tipos_Acoes_Cr] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Acoes_Cr_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Acoes_Cr_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Tipos_Eventos] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Eventos_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Eventos_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Tipos_Situacoes_Vaga] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Situacoes_Vaga_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Tipos_Situacoes_Vaga_updatedBy_df] DEFAULT 'SISTEMA';

-- AlterTable
ALTER TABLE [dbo].[Ba_Uploads] ADD [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Uploads_createdBy_df] DEFAULT 'SISTEMA',
[updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Uploads_updatedBy_df] DEFAULT 'SISTEMA';

-- CreateTable
CREATE TABLE [dbo].[Ba_Etnia] (
    [id] NVARCHAR(1000) NOT NULL,
    [etnia] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Etnia_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Etnia_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Etnia_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Etnia_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_Etnia_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_TamanhoUniforme] (
    [id] NVARCHAR(1000) NOT NULL,
    [tamanho] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_TamanhoUniforme_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_TamanhoUniforme_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_TamanhoUniforme_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_TamanhoUniforme_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_TamanhoUniforme_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_EixoFormacao] (
    [id] NVARCHAR(1000) NOT NULL,
    [eixo] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_EixoFormacao_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_EixoFormacao_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_EixoFormacao_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_EixoFormacao_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_EixoFormacao_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_EixoFormacao_eixo_key] UNIQUE NONCLUSTERED ([eixo])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_TecnicoCurso] (
    [id] NVARCHAR(1000) NOT NULL,
    [curso] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_TecnicoCurso_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_TecnicoCurso_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_TecnicoCurso_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_TecnicoCurso_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_TecnicoCurso_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_TecnicoCurso_curso_key] UNIQUE NONCLUSTERED ([curso])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_SuperiorModalidade] (
    [id] NVARCHAR(1000) NOT NULL,
    [modalidade] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorModalidade_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorModalidade_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_SuperiorModalidade_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_SuperiorModalidade_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_SuperiorModalidade_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_SuperiorModalidade_modalidade_key] UNIQUE NONCLUSTERED ([modalidade])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_SuperiorPeriodo] (
    [id] NVARCHAR(1000) NOT NULL,
    [periodo] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorPeriodo_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorPeriodo_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_SuperiorPeriodo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_SuperiorPeriodo_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_SuperiorPeriodo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_SuperiorPeriodo_periodo_key] UNIQUE NONCLUSTERED ([periodo])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_SuperiorTipo] (
    [id] NVARCHAR(1000) NOT NULL,
    [tipo] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorTipo_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SuperiorTipo_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_SuperiorTipo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_SuperiorTipo_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_SuperiorTipo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_SuperiorTipo_tipo_key] UNIQUE NONCLUSTERED ([tipo])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Contatos_Tipos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Contatos_Tipos_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Tipos_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Tipos_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Contatos_Tipos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Contatos_Tipos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Contatos_Beneficiarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [contato] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Contatos_Beneficiarios_excluido_df] DEFAULT 0,
    [tipoContato_Id] NVARCHAR(1000) NOT NULL,
    [benefAssoc_Id] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Beneficiarios_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Beneficiarios_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Contatos_Beneficiarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Contatos_Beneficiarios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Contatos_Pontos_Focais] (
    [id] NVARCHAR(1000) NOT NULL,
    [contato] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Contatos_Pontos_Focais_excluido_df] DEFAULT 0,
    [tipoContato_Id] NVARCHAR(1000) NOT NULL,
    [pontoFocal_Id] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Pontos_Focais_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Contatos_Pontos_Focais_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Contatos_Pontos_Focais_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Contatos_Pontos_Focais_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Documentos_Tipos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Documentos_Tipos_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Documentos_Tipos_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Documentos_Tipos_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Documentos_Tipos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Documentos_Tipos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Documentos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000),
    [sigiloso] BIT NOT NULL CONSTRAINT [Ba_Documentos_sigiloso_df] DEFAULT 0,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Documentos_excluido_df] DEFAULT 0,
    [tipoDocumento_Id] NVARCHAR(1000) NOT NULL,
    [benefAssoc_Id] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Documentos_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Documentos_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Documentos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Documentos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Unidade_Lotacao] (
    [id] NVARCHAR(1000) NOT NULL,
    [unidade_lotacao] NVARCHAR(1000) NOT NULL,
    [cep] INT NOT NULL,
    [municipio] NVARCHAR(1000) NOT NULL,
    [bairro] NVARCHAR(1000) NOT NULL,
    [logradouro] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_excluido_df] DEFAULT 0,
    [ba_PontoFocalId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ba_Unidade_Lotacao_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Unidade_Lotacao_unidade_lotacao_key] UNIQUE NONCLUSTERED ([unidade_lotacao])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Unidade_Lotacao_Ponto_Focal] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_Unidade_Lotacao_Ponto_Focal_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Vaga] (
    [id] NVARCHAR(1000) NOT NULL,
    [dataConvocacao] DATETIME2 NOT NULL,
    [dataPublicacaoDiarioOficial] DATETIME2,
    [observacao] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Vaga_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Vaga_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Vaga_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Vaga_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [situacaoVaga_Id] NVARCHAR(1000) NOT NULL,
    [remessaSec_Id] NVARCHAR(1000) NOT NULL,
    [unidadeLotacao_Id] NVARCHAR(1000) NOT NULL,
    [beneficiario_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Vaga_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_SituacaoVaga] (
    [id] NVARCHAR(1000) NOT NULL,
    [situacao] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SituacaoVaga_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_SituacaoVaga_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_SituacaoVaga_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_SituacaoVaga_excluido_df] DEFAULT 0,
    [ba_RemessaSetreId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ba_SituacaoVaga_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_RemessaSec] (
    [id] NVARCHAR(1000) NOT NULL,
    [remessa] INT NOT NULL,
    [data_remessa] DATETIME2 NOT NULL,
    [arquivo_importacao] NVARCHAR(1000) NOT NULL,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_RemessaSetre_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_RemessaSetre_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_RemessaSetre_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_RemessaSetre_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_RemessaSetre_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Historico] (
    [id] NVARCHAR(1000) NOT NULL,
    [descricao] TEXT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Historico_excluido_df] DEFAULT 0,
    [createdBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Historico_createdBy_df] DEFAULT 'SISTEMA',
    [updatedBy] NVARCHAR(1000) NOT NULL CONSTRAINT [Ba_Historico_updatedBy_df] DEFAULT 'SISTEMA',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Historico_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [categoria_Id] NVARCHAR(1000) NOT NULL,
    [beneficiario_Id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Ba_Historico_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Historico_Categoria] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Historico_Categoria_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Historico_Categoria_excluido_df] DEFAULT 0,
    CONSTRAINT [Ba_Historico_Categoria_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Historico_Categoria_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_B_index] ON [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal]([B]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_matriculaSec_key] UNIQUE NONCLUSTERED ([matriculaSec]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_rg_key] UNIQUE NONCLUSTERED ([rg]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_ctps_key] UNIQUE NONCLUSTERED ([ctps]);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_pis_key] UNIQUE NONCLUSTERED ([pis]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_etnia_Id_fkey] FOREIGN KEY ([etnia_Id]) REFERENCES [dbo].[Ba_Etnia]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_tamanhoUniforme_Id_fkey] FOREIGN KEY ([tamanhoUniforme_Id]) REFERENCES [dbo].[Ba_TamanhoUniforme]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_eixoFormacao_Id_fkey] FOREIGN KEY ([eixoFormacao_Id]) REFERENCES [dbo].[Ba_EixoFormacao]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_tecnicoCurso_Id_fkey] FOREIGN KEY ([tecnicoCurso_Id]) REFERENCES [dbo].[Ba_TecnicoCurso]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_superiorModalidade_Id_fkey] FOREIGN KEY ([superiorModalidade_Id]) REFERENCES [dbo].[Ba_SuperiorModalidade]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_superiorPeriodo_Id_fkey] FOREIGN KEY ([superiorPeriodo_Id]) REFERENCES [dbo].[Ba_SuperiorPeriodo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Beneficiarios] ADD CONSTRAINT [Ba_Beneficiarios_superiorTipo_Id_fkey] FOREIGN KEY ([superiorTipo_Id]) REFERENCES [dbo].[Ba_SuperiorTipo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD CONSTRAINT [Ba_Contatos_Beneficiarios_tipoContato_Id_fkey] FOREIGN KEY ([tipoContato_Id]) REFERENCES [dbo].[Ba_Contatos_Tipos]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Beneficiarios] ADD CONSTRAINT [Ba_Contatos_Beneficiarios_benefAssoc_Id_fkey] FOREIGN KEY ([benefAssoc_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ADD CONSTRAINT [Ba_Contatos_Pontos_Focais_tipoContato_Id_fkey] FOREIGN KEY ([tipoContato_Id]) REFERENCES [dbo].[Ba_Contatos_Tipos]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Pontos_Focais] ADD CONSTRAINT [Ba_Contatos_Pontos_Focais_pontoFocal_Id_fkey] FOREIGN KEY ([pontoFocal_Id]) REFERENCES [dbo].[Ba_Unidade_Lotacao_Ponto_Focal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Documentos] ADD CONSTRAINT [Ba_Documentos_tipoDocumento_Id_fkey] FOREIGN KEY ([tipoDocumento_Id]) REFERENCES [dbo].[Ba_Documentos_Tipos]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Documentos] ADD CONSTRAINT [Ba_Documentos_benefAssoc_Id_fkey] FOREIGN KEY ([benefAssoc_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_remessaSetre_Id_fkey] FOREIGN KEY ([remessaSec_Id]) REFERENCES [dbo].[Ba_RemessaSec]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_situacaoVaga_Id_fkey] FOREIGN KEY ([situacaoVaga_Id]) REFERENCES [dbo].[Ba_SituacaoVaga]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_unidadeLotacao_Id_fkey] FOREIGN KEY ([unidadeLotacao_Id]) REFERENCES [dbo].[Ba_Unidade_Lotacao]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Vaga] ADD CONSTRAINT [Ba_Vaga_beneficiario_Id_fkey] FOREIGN KEY ([beneficiario_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Historico] ADD CONSTRAINT [Ba_Historico_categoria_Id_fkey] FOREIGN KEY ([categoria_Id]) REFERENCES [dbo].[Ba_Historico_Categoria]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Historico] ADD CONSTRAINT [Ba_Historico_beneficiario_Id_fkey] FOREIGN KEY ([beneficiario_Id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal] ADD CONSTRAINT [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Unidade_Lotacao]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal] ADD CONSTRAINT [_Ba_Unidade_LotacaoToBa_Unidade_Lotacao_Ponto_Focal_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Unidade_Lotacao_Ponto_Focal]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
