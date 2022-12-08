import { prisma } from "services/prisma/prismaClient";

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
      await getTiposHistorico(req, res);
      break;
    case "POST":
      await postTipoHistorico(req, res);
      break;
    case "DELETE":
      await deleteTipoHistorico(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getTiposHistorico = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Historico_Tipo`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const postTipoHistorico = async (req, res) => {
  const { entity } = req.query;
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "" || req.body[key] == null) {
      req.body[key] = null;
    }
  });
  const { nome, tipoHist } = req.body;
  try {
    const table = `${entity}_Historico_Tipo`;

    if (
      (await prisma[table].findFirst({
        where: {
          nome,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error();
      error.message = "Tipo de histórico já existe";
      error.code = "P2002";
      throw error;
    }

    const query = await prisma[table].upsert({
      create: {
        nome,
        sigiloso: JSON.parse(tipoHist),
      },
      update: {
        nome,
        sigiloso: JSON.parse(tipoHist),
        excluido: false,
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

const deleteTipoHistorico = async (req, res) => {
  const { entity, id } = req.query;

  try {
    const table = `${entity}_Historico_Tipo`;
    const query = await prisma.ba_Historico_Tipo.update({
      // const query = await prisma[table].update({
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
