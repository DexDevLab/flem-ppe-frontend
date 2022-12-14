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

    default:
      res.status(405).send({ message: "Only GET requests allowed" });
      break;
  }
};

const getInfoMonitoramentos = async (req, res) => {
  const { entity, id, demandanteId, dataInicio, dataFim } = req.query;

  try {
    const table = `${entity}_Monitoramentos`;

    const query = _.isEmpty(id)
      ? await prisma.ba_Monitoramentos.findMany({
          where: {
            beneficiario: {
              vaga: {
                some: {
                  demandante_Id: demandanteId,
                },
              },
            },
            dataMonitoramento:
              _.isEmpty(dataInicio) && _.isEmpty(dataFim)
                ? {}
                : {
                    gte: DateTime.fromISO(dataInicio).toISO(),
                    lte: DateTime.fromISO(dataFim).toISO(),
                  },
          },
          include: {
            beneficiario: {
              include: {
                vaga: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    unidadeLotacao: true,
                    municipio: true,
                    demandante: true,
                  },
                },
                formacao: true,
              },
            },
            monitor: true,
            monitoramentoComprovacao: true,
          },
        })
      : await prisma.ba_Monitoramentos.findFirst({
          include: {
            beneficiario: {
              include: {
                vaga: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    unidadeLotacao: true,
                    municipio: true,
                    demandante: true,
                  },
                },
                formacao: true,
              },
            },
            monitoramentoComprovacao: true,
          },
          where: {
            id,
            dataMonitoramento:
              _.isEmpty(dataInicio) && _.isEmpty(dataFim)
                ? {}
                : {
                    gte: DateTime.fromISO(dataInicio).toISO(),
                    lte: DateTime.fromISO(dataFim).toISO(),
                  },
          },
        });

    // const query = await prisma[table].findMany({});

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default allowCors(handler);
