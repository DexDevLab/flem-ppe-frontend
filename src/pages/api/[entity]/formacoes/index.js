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
      await getFormacao(req, res);
      break;
    case "POST":
      await addFormacao(req, res);
      break;
    case "PUT":
      await modifyFormacao(req, res);
      break;
    case "DELETE":
      await deleteFormacao(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getFormacao = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Formacao`;
    const query = await prisma[table].findMany({
      orderBy: [
        {
          nome: "asc",
        },
      ],
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        eixo: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addFormacao = async (req, res) => {
  const { entity } = req.query;
  const { formacao, eixo } = req.body;
  try {
    const table = `${entity}_Formacao`;
    const query = await prisma[table].upsert({
      create: {
        nome: formacao,
        eixo: { connect: { id: eixo } },
      },
      update: {
        excluido: false,
        eixo: { connect: { id: eixo } },
      },
      where: {
        nome: formacao,
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

const modifyFormacao = async (req, res) => {
  const { entity } = req.query;
  const { formacao, eixo, id } = req.body;
  try {
    const table = `${entity}_Formacao`;
    const query = await prisma[table].update({
      data: {
        nome: formacao,
        eixo: { connect: { id: eixo } },
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

const deleteFormacao = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Formacao`;
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
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
