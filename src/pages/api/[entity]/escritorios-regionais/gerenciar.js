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
      await modifyMunicipiosMonitoresEscrReg(req, res);
      break;

    default:
      res.status(405).send({ message: "Only POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const modifyMunicipiosMonitoresEscrReg = async (req, res) => {
  const { entity } = req.query;
  const { id, municipios = [], monitores = [] } = req.body;

  const tableEscritorios = `${entity}_Escritorio_Regional`;
  
  try {
    const query = await prisma[tableEscritorios].update({
      data: {
        municipios: {
          set: municipios.map((municipio) => ({ id: municipio.value })),
        },
        monitores: {
          set: monitores.map((monitor) => ({ id: monitor.value })),
        },
      },
      where: {
        id,
      },
    });

    return res.status(200).json({ query });
  } catch (error) {
    return res.status(409).json({ error });
  }
};
