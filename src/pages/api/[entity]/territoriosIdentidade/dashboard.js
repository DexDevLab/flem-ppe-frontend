import { prisma } from "services/prisma/prismaClient";
import _ from "lodash";
import { allowCors } from "services/apiAllowCors";
import QueryString from "qs";
import { DateTime } from "luxon";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getTerritoriosIdentidade(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET or PATCH requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getTerritoriosIdentidade = async (req, res) => {
  const { entity, where, transactionParams } = QueryString.parse(req.query);

  try {
    const table = `${entity}_TerritoriosIdentidade`;

    const teste = await prisma.ba_TerritoriosIdentidade.findMany({
      where: {
        municipios: {
          some: {
            vagas: {
              some: {
                situacaoVaga: {
                  nome: "Ativo",
                },
              },
            },
          },
        },
      },
      select: {
        nome: true,
        municipios: {
          select: {
            _count: {
              select: {
                vagas: true,
              },
            },
          },
        },
      },
    });

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma.ba_TerritoriosIdentidade[queryMode]({
            where: {
              excluido: false,
              ...queryParams,
            },
            ...rest,
          });
        })
      );

      const result = {};

      transactionParams.forEach((obj, idx) => {
        const parsedQuery = JSON.parse(obj);
        const key = Object.keys(parsedQuery)[0];

        return (result[key] = query[idx]);
      });

      return res.status(200).json(result);
    }

    const query = await prisma.ba_Beneficiarios.count({
      // const query = await prisma[table].findMany({

      where: {
        excluido: false,
        // vaga:{
        //   some:{
        //     situacaoVaga:{
        //       tipoSituacao:{
        //         nome:
        //       }
        //     }
        //   }
        // }
        // ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });

    return res.status(200).json(teste);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
