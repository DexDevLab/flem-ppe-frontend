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
      await getUnidadesLotacao(req, res);
      break;
    case "POST":
      await postUnidadesLotacao(req, res);
      break;
    case "PUT":
      await putUnidadesLotacao(req, res);
      break;
    case "DELETE":
      await deleteUnidadeLotacao(req, res);
      break;
    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getUnidadesLotacao = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Unidade_Lotacao`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
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

const postUnidadesLotacao = async (req, res) => {
  const { entity } = req.query;
  const { nome, cep, logradouro, complemento, bairro, municipio, uf } =
    req.body;
  try {
    const table = `${entity}_Unidade_Lotacao`;

    const query = await prisma[table].create({
      data: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        municipio,
        uf,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        console.log(error.message);
        res.status(500).json({ error: error });
        break;
    }
  }
};

const putUnidadesLotacao = async (req, res) => {
  const { entity } = req.query;
  const { id, nome, cep, logradouro, complemento, bairro, municipio, uf } =
    req.body;

  try {
    const table = `${entity}_Unidade_Lotacao`;

    const query = await prisma[table].update({
      data: {
        nome,
        cep,
        logradouro,
        complemento: complemento === "" ? null : complemento,
        bairro,
        municipio,
        uf,
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

const deleteUnidadeLotacao = async (req, res) => {
  const { entity, id } = req.query;

  try {
    const table = `${entity}_Unidade_Lotacao`;
    const table_Unidade_Lotacao_Ponto_Focal = `${entity}_Unidade_Lotacao_Ponto_Focal`;

    const deletePontoFocal = await prisma[
      table_Unidade_Lotacao_Ponto_Focal
    ].updateMany({
      data: {
        excluido: true,
      },
      where: {
        unidadeLotacao_Id: id,
      },
    });

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
