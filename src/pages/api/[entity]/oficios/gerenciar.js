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
    return res.status(500).send(error.message);
  }
};

const postOficio = async (req, res) => {
  const { entity } = req.query;
  const {
    templateOficio,
    emailRemetente,
    conteudoEmail,
    benefAssoc,
    assunto,
    anexos = [],
  } = req.body;

  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Oficios`;
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
        anexosId: anexos.length === 0 ? null : JSON.stringify(anexos),
        remetenteOficio_Id: emailRemetente,
        templateOficio_Id: templateOficio,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ofício",
        descricao: `Criação do ofício: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ofício",
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
        res.status(409).send(error.message);
        break;
    }
  }
};

const putOficio = async (req, res) => {
  const { entity, id } = req.query;
  const {
    templateOficio,
    emailRemetente,
    assunto,
    conteudoEmail,
    benefAssoc = [],
  } = req.body;
  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Oficios`;
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
        remetenteOficio_Id: emailRemetente,
        templateOficio_Id: templateOficio,
      },
      where: {
        id,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ofício",
        descricao: `Modificação do ofício: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ofício",
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

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ofício",
        descricao: `Exclusão do ofício: ${assunto}`,
        beneficiario: {
          connect: benefToConnectComunicado.map(({ id }) => ({ id })),
        },
        oficio: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ofício",
            },
          })
        ).id,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default allowCors(handler);
