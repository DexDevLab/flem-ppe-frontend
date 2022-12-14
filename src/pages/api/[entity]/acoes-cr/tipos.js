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
      await getTiposAcoesCr(req, res);
      break;
    case "POST":
      await addTipoAcaoCr(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET or POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getTiposAcoesCr = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Tipos_Acoes_Cr`;
    const query = await prisma[table].findMany({
      // const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
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
    return res.status(500).json({ error: error });
  }
};

const addTipoAcaoCr = async (req, res) => {
  const { entity } = req.query;
  const { nome } = req.body;

  try {
    const table = `${entity}_Tipos_Acoes_Cr`;
    const query = await prisma[table].create({
      data: {
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
        console.log(error);
        res.status(500).json({ error: error });
        break;
    }
  }
};
