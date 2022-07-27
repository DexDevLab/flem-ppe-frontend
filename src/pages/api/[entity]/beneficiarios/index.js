import axios from "axios";
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
      await getBeneficiarios(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getBeneficiarios = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Beneficiarios`;
    const query = await prisma[table].findMany({
      where: {
        excluido: false,
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