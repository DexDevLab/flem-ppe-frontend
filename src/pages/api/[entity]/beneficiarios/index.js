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
      await getBeneficiarios(req, res);
      break;
    case "PATCH":
      await patchBeneficiarios(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET or PATCH requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getBeneficiarios = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Beneficiarios`;
    const query = await prisma.ba_Beneficiarios.findMany({
      // const query = await prisma[table].findMany({
      where: {
        excluido: false,
      },
      include: {
        vaga: {
          include: {
            demandante: true,
            municipio: {
              include: {
                escritorioRegional: true,
              },
            },
            situacaoVaga: {
              include: {
                tipoSituacao: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
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
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const patchBeneficiarios = async (req, res) => {
  const { entity } = req.query;
  const { where, select } = req.body;

  try {
    const table = `${entity}_Beneficiarios`;
    const query = await prisma.ba_Beneficiarios.findMany({
      // const query = await prisma[table].findMany({
      where: {
        AND: [{ excluido: false }],
        ...where,
      },
      select,
      // orderBy: [
      //   {
      //     nome: "asc",
      //   },
      // ],
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
