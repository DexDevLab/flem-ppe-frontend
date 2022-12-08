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
      await getComunicados(req, res);
      break;
    case "POST":
      await addComunicado(req, res);
      break;
    case "PUT":
      await modifyComunicado(req, res);
      break;
    case "DELETE":
      await deleteComunicado(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

const getComunicados = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Comunicados`;
    const query = await prisma[table].findMany({
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        remetenteComunicado: true,
        benefAssoc: true,
        enviosComunicados: true,
      },
      orderBy: [
        {
          codComunicado: "desc",
        },
      ],
    });

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addComunicado = async (req, res) => {
  const { entity } = req.query;
  const { emailRemetente, assunto, conteudoEmail, benefAssoc } = req.body;

  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Comunicados`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectComunicado = await prisma[tableBeneficiarios].findMany({
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

    const query = await prisma[table].create({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        remetenteComunicado_Id: emailRemetente,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Comunicado",
        descricao: `Criação do comunicado: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Comunicado",
            },
          })
        ).id,
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

const modifyComunicado = async (req, res) => {
  const { entity } = req.query;
  const { id, emailRemetente, assunto, conteudoEmail, benefAssoc } = req.body;
  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Comunicados`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectComunicado = await prisma[tableBeneficiarios].findMany({
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

    const query = await prisma[table].update({
      data: {
        assunto,
        conteudoEmail: JSON.stringify(conteudoEmail),
        benefAssoc: {
          set: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        remetenteComunicado_Id: emailRemetente,
        anexosId: null,
      },
      where: {
        id,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Comunicado",
        descricao: `Modificação do comunicado: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Comunicado",
            },
          })
        ).id,
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

const deleteComunicado = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Comunicados`;

    const query = await prisma[table].update({
      data: {
        excluido: true,
        benefAssoc: {
          set: [],
        },
        enviosComunicados: {
          deleteMany: {
            comunicado_Id: id,
          },
        },
      },
      where: {
        id,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Comunicado",
        descricao: `Exclusão do comunicado: ${query.assunto}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Comunicado",
            },
          })
        ).id,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default allowCors(handler);
