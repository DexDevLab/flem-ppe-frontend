import _ from "lodash";
import { prisma } from "services";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getDemandantes(req, res);
      break;
    case "POST":
      await addDemandante(req, res);
      break;
    case "PUT":
      await modifyDemandante(req, res);
      break;
    case "DELETE":
      await deleteDemandante(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getDemandantes = async (req, res) => {
  const { entity, municipio_Id, escritorioRegional_Id } = req.query;

  try {
    const table = `${entity}_Demandantes`;
    const query = await prisma[table].findMany({
      orderBy: [
        {
          sigla: "asc",
        },
      ],
      where: {
        excluido: {
          equals: false,
        },
        vagas:
          _.isUndefined(municipio_Id) && _.isUndefined(escritorioRegional_Id)
            ? {}
            : {
                some: {
                  municipio_Id: _.isUndefined(municipio_Id)
                    ? {}
                    : {
                        in: JSON.parse(municipio_Id),
                      },
                  municipio: _.isUndefined(escritorioRegional_Id)
                    ? {}
                    : {
                        escritorio_RegionalId: {
                          in: JSON.parse(escritorioRegional_Id),
                        },
                      },
                },
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

const addDemandante = async (req, res) => {
  const { entity } = req.query;
  const { nome, sigla } = req.body;
  try {
    const table = `${entity}_Demandantes`;
    if (
      (await prisma[table].findFirst({
        where: {
          nome,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error("Situação já existe");
      error.code = "P2002";
      throw error;
    }
    const query = await prisma[table].upsert({
      create: {
        nome,
        sigla,
      },
      update: {
        excluido: false,
        nome,
        sigla,
      },
      where: {
        nome,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const modifyDemandante = async (req, res) => {
  const { entity } = req.query;
  const { nome, sigla, id } = req.body;
  try {
    const table = `${entity}_Demandantes`;
    const query = await prisma[table].update({
      data: {
        nome,
        sigla,
      },
      where: {
        id,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const deleteDemandante = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Demandantes`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
      },
      where: {
        id,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
