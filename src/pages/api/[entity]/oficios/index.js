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
      await getOficioTemplate(req, res);
      break;
    case "POST":
      await addOficioTemplate(req, res);
      break;
    case "PUT":
      await modifyOficioTemplate(req, res);
      break;
    case "DELETE":
      await deleteOficioTemplate(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getOficioTemplate = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Oficio_Template`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        tipo: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addOficioTemplate = async (req, res) => {
  const { entity } = req.query;
  const { titulo, descricao, conteudo, tipo } = req.body;
  try {
    const table = `${entity}_Oficio_Template`;
    const query = await prisma[table].upsert({
      create: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
      },
      update: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
        excluido: false,
      },
      where: {
        titulo,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res
          .status(409)
          .json({ error: "Unique constraint failed", on: error.meta.target });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const modifyOficioTemplate = async (req, res) => {
  const { entity } = req.query;
  const { titulo, descricao, conteudo, tipo, id } = req.body;
  try {
    const table = `${entity}_Oficio_Template`;
    const query = await prisma[table].update({
      data: {
        titulo,
        descricao: descricao || null,
        conteudo: JSON.stringify(conteudo),
        tipo: { connect: { id: tipo } },
      },
      where: {
        id,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res
          .status(409)
          .json({ error: "Unique constraint failed", on: error.meta.target });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const deleteOficioTemplate = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Oficio_Template`;
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
