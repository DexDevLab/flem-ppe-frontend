import { prisma } from "services/prisma/prismaClient";
import _ from "lodash";
import { allowCors } from "services/apiAllowCors";
import QueryString from "qs";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getFormacoes(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET or PATCH requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getFormacoes = async (req, res) => {
  const { entity, where, transactionParams } = QueryString.parse(req.query);

  try {
    const table = `${entity}_Formacao`;

    if (!_.isEmpty(transactionParams)) {
      const query = await prisma.$transaction(
        transactionParams.map((rawQueryParams) => {
          const parsedQuery = JSON.parse(rawQueryParams);
          const {
            queryMode,
            where: queryParams,
            ...rest
          } = Object.values(parsedQuery)[0];
          return prisma[table][queryMode]({
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

    const query = await prisma[table].count({
      where: {
        excluido: false,
        ...(_.isEmpty(where) ? {} : JSON.parse(where)),
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
