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
      await getAcoesCr(req, res);
      break;
    case "POST":
      await addContatoAcaoCr(req, res);
      break;
    case "PUT":
      await modifyContatoAcaoCr(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST or PUT requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getAcoesCr = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Acoes_Cr`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        benefAssoc: true,
        colabCr: true,
      },
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addContatoAcaoCr = async (req, res) => {
  const { entity } = req.query;
  const {
    contatoRealizado,
    descricao,
    benef: { id: idBenef },
    acaoCR: { id: idAcao },
  } = req.body;

  try {
    const table = `${entity}_Contatos_Acoes_Cr`;
    const query = await prisma[table].create({
      data: {
        acaoCr_id: idAcao,
        beneficiario_id: idBenef,
        concluido: JSON.parse(contatoRealizado),
        descricao,
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

const modifyContatoAcaoCr = async (req, res) => {
  const { entity } = req.query;
  const {
    contatoRealizado,
    descricao,
    benef: { id: idBenef },
    acaoCR: { id: idAcao },
    contatoAcao: { id: idContato },
  } = req.body;

  try {
    const table = `${entity}_Contatos_Acoes_Cr`;

    const query = await prisma[table].update({
      data: {
        acaoCr_id: idAcao,
        beneficiario_id: idBenef,
        concluido: JSON.parse(contatoRealizado),
        descricao,
      },
      where: {
        id: idContato,
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
