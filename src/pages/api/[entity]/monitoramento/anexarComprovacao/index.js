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
      await postAnexarComprovacaoMonitoramento(req, res);
      break;
    // case "PUT":
    //   await modifyMaterial(req, res);
    //   break;
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
  const { entity, te } = req.query;
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

const postAnexarComprovacaoMonitoramento = async (req, res) => {
  const { entity } = req.query;
  const { monitoramentosParaAnexarComprovacao, comprovacaoAnexo } = req.body;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "" || req.body[key] == null) {
      req.body[key] = null;
    }
  });

  const comprovacaoAnexo_anexoId = _.isEmpty(comprovacaoAnexo)
    ? null
    : JSON.stringify(comprovacaoAnexo.map(({ id }) => ({ id })));

  try {
    const table = `${entity}_Monitoramentos_Comprovacoes`;
    const query = await prisma.ba_Monitoramentos_Comprovacoes.create({
      data: {
        anexoId: comprovacaoAnexo_anexoId,
        monitoramento: {
          connect: monitoramentosParaAnexarComprovacao.map(({ id }) => ({
            id,
          })),
        },
      },
    });

    await Promise.all(
      new Array().concat(
        !_.isEmpty(comprovacaoAnexo) &&
          comprovacaoAnexo.map(({ id }) =>
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
