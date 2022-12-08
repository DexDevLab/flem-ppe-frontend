import { axios, prisma } from "services";

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
      await deleteMaterial(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

const getMonitores = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Monitores`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        escritoriosRegionais: true,
      },
      orderBy: [
        {
          nome: "asc",
        },
      ],
    });

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addMonitor = async (req, res) => {
  const { entity } = req.query;
  const { monitor, erAssoc } = req.body;

  try {
    const table = `${entity}_Monitores`;

    const {
      data: [colabFromRh],
    } = await axios.get("http://localhost:3001/api/funcionarios", {
      params: {
        matricula: parseInt(monitor),
        condition: "AND",
      },
    });

    if (
      (await prisma[table].findFirst({
        where: {
          matricula: colabFromRh.func_matricula,
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
        matricula: colabFromRh.func_matricula,
      },
      update: {
        nome: colabFromRh.func_nome,
        excluido: false,
        escritoriosRegionais: {
          connect: erAssoc.map(({ id }) => ({ id })),
        },
      },
      create: {
        nome: colabFromRh.func_nome,
        matricula: colabFromRh.func_matricula,
        escritoriosRegionais: {
          connect: erAssoc.map(({ id }) => ({ id })),
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
  const { id, erAssoc } = req.body;

  try {
    const table = `${entity}_Monitores`;
    const query = await prisma[table].update({
      data: {
        escritoriosRegionais: {
          set: erAssoc.map(({ id }) => ({ id })),
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

const deleteMaterial = async (req, res) => {
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
