import { allowCors, prisma } from "services";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getColaboradorCrs(req, res);
      break;
    case "POST":
      await addColaboradorCr(req, res);
      break;
    case "PUT":
      await modifyColaboradorCr(req, res);
      break;
    case "DELETE":
      await deleteColaboradorCr(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getColaboradorCrs = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Colaboradores_Cr`;
    const query = await prisma.ba_Colaboradores_Cr.findMany({
      // const query = await prisma[table].findMany({
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

const addColaboradorCr = async (req, res) => {
  const { entity } = req.query;
  const { nome, login_usuario } = req.body;
  try {
    const table = `${entity}_Colaboradores_Cr`;
    if (
      (await prisma[table].findFirst({
        where: {
          login_usuario,
          excluido: false,
        },
      })) !== null
    ) {
      const error = new Error();
      error.message = "Colaborador já existe";
      error.code = "P2002";
      throw error;
    }
    const query = await prisma.ba_Colaboradores_Cr.upsert({
      // const query = await prisma[table].upsert({
      create: {
        nome,
        login_usuario,
      },
      update: {
        excluido: false,
        nome,
        login_usuario,
      },
      where: {
        login_usuario,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).json({ error: error.message });
        break;
    }
  }
};

const modifyColaboradorCr = async (req, res) => {
  const { entity, id } = req.query;
  const { nome, sigla } = req.body;
  try {
    const table = `${entity}_Colaboradores_Cr`;
    const query = await prisma[table].update({
      data: {
        nome,
        sigla,
      },
      where: {
        id,
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

const deleteColaboradorCr = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Colaboradores_Cr`;
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
