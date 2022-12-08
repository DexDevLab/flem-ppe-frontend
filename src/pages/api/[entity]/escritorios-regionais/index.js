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
      await getEscritoriosRegionais(req, res);
      break;
    case "POST":
      await addEscritorioRegional(req, res);
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

const getEscritoriosRegionais = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Escritorio_Regional`;
    // const query = await prisma[table].findMany({
    const query = await prisma.ba_Escritorio_Regional.findMany({
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
        monitores: true,
        municipios: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addEscritorioRegional = async (req, res) => {
  const { entity } = req.query;
  const {
    cep,
    num_contato,
    nome,
    logradouro,
    complemento,
    bairro,
    cidade,
    uf,
    email,
  } = req.body;
  try {
    const table = `${entity}_Escritorio_Regional`;
    // const query = await prisma[table].upsert({
    if (
      (await prisma[table].findFirst({
        where: {
          nome,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error("escritório já existe");
      error.code = "P2002";
      throw error;
    }
    const query = await prisma[table].upsert({
      create: {
        cep,
        num_contato,
        nome,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
      },
      update: {
        excluido: false,
        cep,
        num_contato,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
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
        console.log(error);
        res.status(500).json({ error: error });
        break;
    }
  }
};

const modifyFormacao = async (req, res) => {
  const { entity } = req.query;
  const {
    cep,
    num_contato,
    nome,
    logradouro,
    complemento,
    bairro,
    cidade,
    uf,
    email,
    id,
  } = req.body;
  try {
    const table = `${entity}_Escritorio_Regional`;
    const query = await prisma[table].update({
      data: {
        cep,
        num_contato,
        nome,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        cidade,
        uf,
        email,
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
