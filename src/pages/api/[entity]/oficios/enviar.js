import { prisma } from "services/prisma/prismaClient";
import { maskCapitalize } from "utils";

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
      await addEnvios(req, res);
      break;

    default:
      res.status(405).send({ message: "Only POST requests allowed" });
      break;
  }
};

const addEnvios = async (req, res) => {
  const { entity } = req.query;
  const {
    id,
    templateOficio,
    emailRemetente,
    assunto,
    conteudoEmail,
    benefAssoc,
  } = req.body;

  try {
    const table = `${entity}_Oficios_Enviados`;
    const tableComunicados = `${entity}_Oficios`;

    const getOficio = await prisma[tableComunicados].findFirst({
      where: {
        id,
      },
      include: {
        benefAssoc: true,
        remetenteOficio: true,
        templateOficio: true,
      },
    });

    const conteudoEmail = JSON.parse(getOficio.conteudoEmail);
    const conteudoTemplate = JSON.parse(getOficio.templateOficio.conteudo);

    const enviosToCreate = getOficio.benefAssoc.map((benef) => {
      const conteudoEmailPopulado = conteudoEmail.ops.map((obj, idx) => {
        if (obj.insert.mention) {
          switch (obj.insert.mention.id) {
            case "nome_beneficiario":
              obj.insert.mention.denotationChar = "";
              obj.insert.mention.value = maskCapitalize(benef.nome);
              break;
          }
          return obj;
        } else {
          return obj;
        }
      });
      const conteudoOficioPopulado = conteudoTemplate.ops.map((obj, idx) => {
        if (obj.insert.mention) {
          switch (obj.insert.mention.id) {
            case "nome_beneficiario":
              obj.insert.mention.denotationChar = "";
              obj.insert.mention.value = maskCapitalize(benef.nome);
              break;
          }
          return obj;
        } else {
          return obj;
        }
      });

      return {
        beneficiario_Id: benef.id,
        oficio_Id: getOficio.id,
        conteudoEmail: JSON.stringify({ ops: conteudoEmailPopulado }),
        conteudoOficio: JSON.stringify({ ops: conteudoOficioPopulado }),
      };
    });

    const query = await prisma[table].createMany({
      data: enviosToCreate,
    });

    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).send(error.message);
        break;
    }
  }
};

export default allowCors(handler);
