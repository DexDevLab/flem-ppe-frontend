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
      await getPontoFocal(req, res);
      break;
    case "POST":
      await postPontoFocal(req, res);
      break;
    case "PUT":
      await putPontoFocal(req, res);
      break;
    case "DELETE":
      await deletePontoFocal(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getPontoFocal = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
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
      include: {
        contato: true,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const postPontoFocal = async (req, res) => {
  const { entity } = req.query;
  const { idUnidadeLotacao, nome, email, contato } = req.body;

  const listaContatos = () => {
    const arr = [];
    if (Array.isArray(email)) {
      arr.push(
        ...email.map((email) => ({
          contato: email,
          tipoContato_Id: "email",
        }))
      );
    }
    if (Array.isArray(contato)) {
      arr.push(
        ...contato.map((contato) => ({
          contato,
          tipoContato_Id: "celular",
        }))
      );
    }
    return arr;
  };
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
    const query = await prisma[table].create({
      data: {
        nome,
        contato: {
          createMany: {
            data: listaContatos(),
          },
        },
        unidadeLotacao_Id: idUnidadeLotacao,
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

const putPontoFocal = async (req, res) => {
  const { entity, idPontoFocal } = req.query;
  const { idUnidadeLotacao, nome, email, contato } = req.body;

  const listaContatos = () => {
    const arr = [];
    if (Array.isArray(email)) {
      arr.push(
        ...email.map((email) => ({
          contato: email,
          tipoContato_Id: "email",
        }))
      );
    }
    if (Array.isArray(contato)) {
      arr.push(
        ...contato.map((contato) => ({
          contato,
          tipoContato_Id: "celular",
        }))
      );
    }
    return arr;
  };
  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;

    const removeContatos = await prisma.ba_Contatos_Pontos_Focais.deleteMany({
      where: {
        pontoFocal_Id: idPontoFocal,
      },
    });

    const query = await prisma[table].update({
      data: {
        nome,
        contato: {
          createMany: {
            data: listaContatos(),
          },
        },
        unidadeLotacao_Id: idUnidadeLotacao,
      },
      where: {
        id: idPontoFocal,
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

const deletePontoFocal = async (req, res) => {
  const { entity, id } = req.query;

  try {
    const table = `${entity}_Unidade_Lotacao_Ponto_Focal`;
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
