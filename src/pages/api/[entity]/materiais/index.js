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
      await getMateriais(req, res);
      break;
    case "POST":
      await addMaterial(req, res);
      break;
    case "PUT":
      await modifyMaterial(req, res);
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

const getMateriais = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Materiais`;
    const query = await prisma[table].findMany({
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

const addMaterial = async (req, res) => {
  const { entity } = req.query;
  const { nome, descricao } = req.body;

  try {
    const table = `${entity}_Materiais`;
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
      where: {
        nome,
      },
      update: {
        nome,
        descricao,
        excluido: false,
      },
      create: {
        nome,
        descricao,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(409).json({ error: error });
        break;
    }
  }
};

const modifyMaterial = async (req, res) => {
  const { entity } = req.query;
  const { id, nome, descricao } = req.body;

  try {
    const table = `${entity}_Materiais`;
    const query = await prisma[table].update({
      data: {
        nome,
        descricao,
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
    const table = `${entity}_Materiais`;
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

export default allowCors(handler);
