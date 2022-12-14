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
      await getSituacoesVaga(req, res);
      break;
    case "POST":
      await addSituacaoVaga(req, res);
      break;
    case "PUT":
      await modifySituacaoVaga(req, res);
      break;
    case "DELETE":
      await deleteSituacaoVaga(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getSituacoesVaga = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Situacoes_Vaga`;
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
        tipoSituacao: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addSituacaoVaga = async (req, res) => {
  const { entity } = req.query;
  const { situacao, tipo } = req.body;
  try {
    const table = `${entity}_Situacoes_Vaga`;
    if (
      (await prisma[table].findFirst({
        where: {
          nome: situacao,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error("Situação já existe");
      error.code = "P2002";
      throw error;
    }
    const query = await prisma.ba_Situacoes_Vaga.upsert({
      // const query = await prisma[table].upsert({
      create: {
        nome: situacao,
        tipoSituacao_Id: tipo,
      },
      update: {
        excluido: false,
        nome: situacao,
        tipoSituacao_Id: tipo,
      },
      where: {
        nome: situacao,
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
        res.status(500).json({ error: error });
        break;
    }
  }
};

const modifySituacaoVaga = async (req, res) => {
  const { entity } = req.query;
  const { situacao, tipo, id } = req.body;
  try {
    const table = `${entity}_Situacoes_Vaga`;
    const query = await prisma[table].update({
      data: {
        nome: situacao,
        tipoSituacao_Id: tipo,
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

const deleteSituacaoVaga = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Situacoes_Vaga`;
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
