import { prisma } from "services/prisma/prismaClient";
import _ from "lodash";
import { allowCors } from "services/apiAllowCors";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getDemandanteById(req, res);
      break;
    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getDemandanteById = async (req, res) => {
  const { entity, idDemandante } = req.query;
  try {
    const table = `${entity}_Demandantes`;
    const query = await prisma[table].findFirst({
      orderBy: [
        {
          sigla: "asc",
        },
      ],
      where: {
        excluido: {
          equals: false,
        },
        id: {
          equals: idDemandante,
        },
      },
      include: {
        vagas: {
          select: {
            demandante_Id: true,
            municipio: {
              select: {
                escritorio_RegionalId: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
