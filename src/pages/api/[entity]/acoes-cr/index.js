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
      await getAcoesCr(req, res);
      break;
    case "POST":
      await addAcaoCr(req, res);
      break;
    case "PUT":
      await modifyAcaoCr(req, res);
      break;
    case "DELETE":
      await deleteAcaoCr(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

const getAcoesCr = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Acoes_Cr`;
    const query = async () => {
      if (id) {
        return await prisma[table].findFirst({
          where: {
            id,
            excluido: {
              equals: false,
            },
          },
          include: {
            benefAssoc: {
              include: {
                contatosAcoes: true,
              },
            },
            colabCr: true,
            contatos: true,
          },
          orderBy: [
            {
              id: "asc",
            },
          ],
        });
      } else {
        return await prisma[table].findMany({
          where: {
            excluido: {
              equals: false,
            },
          },
          include: {
            benefAssoc: {
              include: {
                contatosAcoes: true,
              },
            },
            colabCr: true,
            contatos: true,
          },
          orderBy: [
            {
              id: "asc",
            },
          ],
        });
      }
    };
    return res.status(200).json(await query());
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const addAcaoCr = async (req, res) => {
  const { entity } = req.query;
  const { nome, tipo, descricao, benefAssoc, colabAcaoCR } = req.body;

  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Acoes_Cr`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectAcao = await prisma[tableBeneficiarios].findMany({
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
        nome,
        descricao,
        tipoAcaoCr_Id: tipo,
        benefAssoc: {
          connect: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        colabCr: {
          connect: colabAcaoCR.map(({ value }) => ({ id: value })),
        },
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ação CR",
        descricao: `Criação da ação: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        acoesCr: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ação CR",
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

const modifyAcaoCr = async (req, res) => {
  const { entity } = req.query;
  const { id, nome, tipo, descricao, benefAssoc, colabAcaoCR } = req.body;
  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Acoes_Cr`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectAcao = await prisma[tableBeneficiarios].findMany({
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
        nome,
        descricao,
        tipoAcaoCr_Id: tipo,
        benefAssoc: {
          set: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        colabCr: {
          set: colabAcaoCR.map(({ value }) => ({ id: value })),
        },
      },
      include: {
        benefAssoc: true,
      },
      where: {
        id,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ação CR",
        descricao: `Modificação da ação: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        acoesCr: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ação CR",
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
        console.log(error);
        res.status(500).json({ error: error });
        break;
    }
  }
};

const deleteAcaoCr = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Acoes_Cr`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
      },
      where: {
        id,
      },
    });

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Ação CR",
        descricao: `Exclusão da ação: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        acoesCr: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Ação CR",
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
