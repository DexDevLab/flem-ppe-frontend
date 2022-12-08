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
      await getOficios(req, res);
      break;
    case "POST":
      await postOficio(req, res);
      break;
    case "PUT":
      await putOficio(req, res);
      break;
    case "DELETE":
      await deleteOficio(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};


const getOficios = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Oficios`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        remetenteOficio: true,
        benefAssoc: true,
        enviosOficios: true,
      },
      orderBy: [
        {
          assunto: "asc",
        },
      ],
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

const putOficio = async (req, res) => {
  const { entity, id } = req.query;
  const { anexosId } = req.body;
  try {
    const table = `${entity}_Oficios`;

    const teste = await prisma.ba_Uploads.updateMany({
      data: {
        excluido: true,
      },
      where: {
        AND: {
          referencesTo: id,
          id: {
            notIn: anexosId.map(({ id }) => id),
          },
        },
      },
    });

    const query = await prisma.ba_Oficios.update({
      // const query = await prisma[table].update({
      data: {
        anexosId: anexosId.length === 0 ? null : JSON.stringify(anexosId),
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
        console.log(error);
        res.status(500).send(error.message);
        break;
    }
  }
};

const deleteOficio = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Oficios`;

    const query = await prisma[table].update({
      data: {
        excluido: true,
        benefAssoc: {
          set: [],
        },

        enviosOficios: {
          deleteMany: {
            oficio_Id: id,
          },
        },
      },
      where: {
        id,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default allowCors(handler);
