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
    case "PUT":
      await putAnexoComunicado(req, res);
      break;

    default:
      res.status(405).send({ message: "Only PUT requests allowed" });
      break;
  }
};

const putAnexoComunicado = async (req, res) => {
  const { entity, id } = req.query;
  const { anexosId } = req.body;
  try {
    const table = `${entity}_Comunicados`;

    // await prisma.ba_Uploads.updateMany({
    //   data: {
    //     excluido: true,
    //   },
    //   where: {
    //     AND: {
    //       referencesTo: id,
    //       id: {
    //         notIn: anexosId.map(({ id }) => id),
    //       },
    //     },
    //   },
    // });

    const query = await prisma[table].update({
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

export default allowCors(handler);
