import { DateTime } from "luxon";
import { allowCors } from "services/apiAllowCors";
import { prisma } from "services/prisma/prismaClient";
import _ from "lodash";
import { filesAPIService } from "services/apiService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getInfoMonitoramentos(req, res);
      break;
    case "POST":
      await postMonitoramento(req, res);
      break;
    case "PUT":
      await putMonitoramento(req, res);
      break;
    // case "DELETE":
    //   await deleteMaterial(req, res);
    //   break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

const getInfoMonitoramentos = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Beneficiarios`;
    const query = await prisma.ba_Beneficiarios.findMany({
      // const query = await prisma[table].findMany({
      where: {
        excluido: false,
        vaga: {
          some: {
            situacaoVaga_Id: (
              await prisma.ba_Situacoes_Vaga.findFirst({
                where: {
                  nome: "Ativo",
                },
              })
            ).id,
          },
        },
      },
      include: {
        vaga: {
          include: {
            demandante: true,
            municipio: {
              include: {
                escritorioRegional: true,
              },
            },
            situacaoVaga: {
              include: {
                tipoSituacao: true,
              },
            },
            unidadeLotacao: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        formacao: true,
        monitoramentos: {
          orderBy: {
            dataMonitoramento: "desc",
          },
        },
      },
      orderBy: [
        {
          nome: "asc",
        },
      ],
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const postMonitoramento = async (req, res) => {
  const { entity } = req.query;
  const {
    beneficiario_Id,
    dataMonitoramento,
    presencaTecnico,
    tipoMonitoramento,
    registrosVisitacao,
    desvioFuncao,
    desvioFuncaoTipo = null,
    desvioFuncaoDescricao = null,
    gravidez = null,
    acidenteTrabalho,
    acidenteTrabalhoDescricao = null,
    impressoesConhecimento,
    impressoesHabilidade,
    impressoesAutonomia,
    impressoesPontualidade,
    impressoesMotivacao,
    impressoesExperienciaCompFormacao,
    observacoesEquipePpe,
    metaType,
    autoAvaliacao,
    benefPontoFocal,
    ambienteTrabalho,
  } = req.body;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "" || req.body[key] == null) {
      req.body[key] = null;
    }
  });

  const autoAvaliacao_anexoId = _.isEmpty(autoAvaliacao)
    ? null
    : JSON.stringify(autoAvaliacao.map(({ id }) => ({ id })));

  const benefPontoFocal_anexoId = _.isEmpty(benefPontoFocal)
    ? null
    : JSON.stringify(benefPontoFocal.map(({ id }) => ({ id })));

  const ambienteTrabalho_anexoId = _.isEmpty(ambienteTrabalho)
    ? null
    : JSON.stringify(ambienteTrabalho.map(({ id }) => ({ id })));

  try {
    const table = `${entity}_Monitoramentos`;
    const query = await prisma.ba_Monitoramentos.create({
      data: {
        beneficiario_Id,
        dataMonitoramento: DateTime.fromISO(dataMonitoramento)
          .setLocale("pt-BR")
          .toISO(),
        presencaTecnico,
        tipoMonitoramento,
        registrosVisitacao,
        desvioFuncao,
        desvioFuncaoTipo,
        desvioFuncaoDescricao,
        gravidez,
        acidenteTrabalho,
        acidenteTrabalhoDescricao,
        impressoesConhecimento,
        impressoesHabilidade,
        impressoesAutonomia,
        impressoesPontualidade,
        impressoesMotivacao,
        impressoesExperienciaCompFormacao,
        observacoesEquipePpe,
        autoAvaliacao_anexoId,
        benefPontoFocal_anexoId,
        ambienteTrabalho_anexoId,
        metaType,
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(autoAvaliacao) &&
          autoAvaliacao.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(benefPontoFocal) &&
          benefPontoFocal.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(ambienteTrabalho) &&
          ambienteTrabalho.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          )
      )
    );

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const putMonitoramento = async (req, res) => {
  const { entity, id } = req.query;
  const {
    beneficiario_Id,
    dataMonitoramento,
    presencaTecnico,
    tipoMonitoramento,
    registrosVisitacao,
    desvioFuncao,
    desvioFuncaoTipo = null,
    desvioFuncaoDescricao = null,
    gravidez = null,
    acidenteTrabalho,
    acidenteTrabalhoDescricao = null,
    impressoesConhecimento,
    impressoesHabilidade,
    impressoesAutonomia,
    impressoesPontualidade,
    impressoesMotivacao,
    impressoesExperienciaCompFormacao,
    observacoesEquipePpe,
    metaType,
    autoAvaliacao,
    benefPontoFocal,
    ambienteTrabalho,
  } = req.body;

  // Object.keys(req.body).forEach((key) => {
  //   if (req.body[key] === "" || req.body[key] == null) {
  //     req.body[key] = null;
  //   }
  // });

  const autoAvaliacao_anexoId = _.isEmpty(autoAvaliacao)
    ? null
    : JSON.stringify(autoAvaliacao.map(({ id }) => ({ id })));

  const benefPontoFocal_anexoId = _.isEmpty(benefPontoFocal)
    ? null
    : JSON.stringify(benefPontoFocal.map(({ id }) => ({ id })));

  const ambienteTrabalho_anexoId = _.isEmpty(ambienteTrabalho)
    ? null
    : JSON.stringify(ambienteTrabalho.map(({ id }) => ({ id })));

  try {
    const table = `${entity}_Monitoramentos`;
    const query = await prisma.ba_Monitoramentos.update({
      data: {
        beneficiario_Id,
        dataMonitoramento: DateTime.fromISO(dataMonitoramento)
          .setLocale("pt-BR")
          .toISO(),
        presencaTecnico,
        tipoMonitoramento,
        registrosVisitacao,
        desvioFuncao,
        desvioFuncaoTipo,
        desvioFuncaoDescricao,
        gravidez,
        acidenteTrabalho,
        acidenteTrabalhoDescricao,
        impressoesConhecimento,
        impressoesHabilidade,
        impressoesAutonomia,
        impressoesPontualidade,
        impressoesMotivacao,
        impressoesExperienciaCompFormacao,
        observacoesEquipePpe,
        autoAvaliacao_anexoId,
        benefPontoFocal_anexoId,
        ambienteTrabalho_anexoId,
        metaType,
      },
      where: {
        id,
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(autoAvaliacao) &&
          autoAvaliacao.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(benefPontoFocal) &&
          benefPontoFocal.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          ),
        !_.isEmpty(ambienteTrabalho) &&
          ambienteTrabalho.map(({ id }) =>
            filesAPIService.patch(
              `/indexFile`,
              { referenceObj: query },
              {
                params: { fileId: id },
              }
            )
          )
      )
    );

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export default allowCors(handler);
