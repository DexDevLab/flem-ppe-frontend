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
    case "POST":
      await postPresencaBenefEvento(req, res);
      break;

    default:
      res.status(405).send({ message: "Only POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getLocaisEventos = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Locais_Eventos`;
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
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const postPresencaBenefEvento = async (req, res) => {
  const { entity } = req.query;
  const { benefAssoc, eventoId } = req.body;

  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Eventos_Lista_Presenca`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToInformPresenca = await prisma[tableBeneficiarios].findMany({
      where: {
        OR: [
          {
            cpf: {
              in: benefCPFs,
            },
          },
          {
            matriculaFlem: {
              in: benefMatriculas,
            },
          },
        ],
      },
    });

    const query = await prisma[table].createMany({
      data: benefToInformPresenca.map(({ id }) => ({
        benefAssocId: id,
      })),
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
