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
      await getEixoFormacao(req, res);
      break;
    case "POST":
      await addEixoFormacao(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET or POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getEixoFormacao = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Eixo_Formacao`;
    const query = await prisma[table].findMany({
      orderBy: [
        {
          nome: "asc",
        },
      ],
      include: {
        formacoes: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addEixoFormacao = async (req, res) => {
  const { entity } = req.query;
  const { eixo } = req.body;
  try {
    const table = `${entity}_Eixo_Formacao`;
    const query = await prisma[table].create({
      data: {
        nome: eixo,
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
