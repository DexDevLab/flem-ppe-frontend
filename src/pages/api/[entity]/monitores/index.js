import _ from "lodash";
import { prisma } from "services/prisma/prismaClient";
import { maskCapitalize } from "utils/maskCapitalize";

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
      await getMonitores(req, res);
      break;
    case "POST":
      await addMonitor(req, res);
      break;
    case "PUT":
      await modifyMonitor(req, res);
      break;
    case "DELETE":
      await deleteMonitor(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

const getMonitores = async (req, res) => {
  const { entity, escritorioRegional_Id, municipio_Id, demandante_Id } =
    req.query;
  try {
    const table = `${entity}_Monitores`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
        escritoriosRegionais:
          _.isUndefined(escritorioRegional_Id) && _.isUndefined(municipio_Id)
            ? {}
            : {
                some: {
                  id: _.isUndefined(escritorioRegional_Id)
                    ? {}
                    : {
                        in: JSON.parse(escritorioRegional_Id),
                      },
                  municipios: _.isUndefined(municipio_Id)
                    ? {}
                    : {
                        some: {
                          id: {
                            in: JSON.parse(municipio_Id),
                          },
                        },
                      },
                },
              },
        demandantes: _.isUndefined(demandante_Id)
          ? {}
          : {
              some: {
                id: _.isUndefined(demandante_Id)
                  ? {}
                  : {
                      in: JSON.parse(demandante_Id),
                    },
              },
            },
      },
      include: {
        escritoriosRegionais: true,
        demandantes: true,
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

const addMonitor = async (req, res) => {
  const { entity } = req.query;
  const { monitor, erAssoc, demandantesAssociados } = req.body;

  try {
    const table = `${entity}_Monitores`;

    if (
      (await prisma[table].findFirst({
        where: {
          matricula: monitor.matriculaDominio,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error("Monitor já existe");
      error.code = "P2002";
      throw error;
    }
    const query = await prisma[table].upsert({
      where: {
        matricula: monitor.matriculaDominio,
      },
      update: {
        nome: maskCapitalize(monitor.nome),
        excluido: false,
        escritoriosRegionais: {
          set: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          set: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
      },
      create: {
        nome: maskCapitalize(monitor.nome),
        matricula: monitor.matriculaDominio,
        escritoriosRegionais: {
          connect: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          connect: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
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

const modifyMonitor = async (req, res) => {
  const { entity } = req.query;
  const { id, erAssoc, demandantesAssociados } = req.body;

  try {
    const table = `${entity}_Monitores`;
    const query = await prisma[table].update({
      data: {
        escritoriosRegionais: {
          set: erAssoc.map(({ value }) => ({ id: value })),
        },
        demandantes: {
          set: demandantesAssociados.map(({ value }) => ({ id: value })),
        },
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

const deleteMonitor = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Monitores`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
        escritoriosRegionais: {
          set: [],
        },
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

export default allowCors(handler);
