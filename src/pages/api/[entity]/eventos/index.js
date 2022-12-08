import { DateTime } from "luxon";
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
      await getEvento(req, res);
      break;
    case "POST":
      await addEvento(req, res);
      break;
    case "PUT":
      await modifyEvento(req, res);
      break;
    case "DELETE":
      await deleteEvento(req, res);
      break;
    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getEvento = async (req, res) => {
  const { entity, idEvento } = req.query;
  try {
    const table = `${entity}_Eventos`;

    if (idEvento) {
      const query = await prisma[table].findFirst({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          excluido: {
            equals: false,
          },
          id: idEvento,
        },
        include: {
          localEvento: true,
          tipoEvento: true,
          benefAssoc: true,
          acao_Cr: {
            include: {
              colabCr: true,
            },
          },
          comunicado: true,
        },
      });
      return res.status(200).json(query);
    }
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
      include: {
        localEvento: true,
        tipoEvento: true,
        benefAssoc: true,
        acao_Cr: {
          include: {
            colabCr: true,
          },
        },
        comunicado: true,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addEvento = async (req, res) => {
  const { entity } = req.query;
  const {
    nome,
    modalidade,
    data,
    local,
    tipo,
    benefAssoc,
    criarAcaoCR,
    colabAcaoCR,
    emailAlerts,
    emailRemetente,
    conteudoEmail = null,
  } = req.body;
  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Eventos`;
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
      // const query = await prisma[table].create({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),
        local_EventoId: local,
        tipo_eventoId: tipo,
        benefAssoc: {
          connect: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_Cr: criarAcaoCR
          ? {
              create: {
                nome,
                descricao:
                  "Ação gerada automaticamente na criação do evento " + nome,
                benefAssoc: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                colabCr: {
                  connect: colabAcaoCR.map(({ value }) => ({ id: value })),
                },
              },
            }
          : {},
        comunicado: emailAlerts
          ? {
              create: {
                assunto: `PPE - Novo Evento: ${nome}`,
                conteudoEmail,
                remetenteComunicado: {
                  connect: {
                    id: emailRemetente,
                  },
                },
                benefAssoc: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
              },
            }
          : {},
      },
      include: {
        acao_Cr: true,
        comunicado: true,
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

const modifyEvento = async (req, res) => {
  const { entity } = req.query;
  const {
    id,
    nome,
    modalidade,
    data,
    local,
    tipo,
    benefAssoc,
    acao_CrId,
    criarAcaoCR,
    colabAcaoCR,
    emailAlerts,
    comunicado_Id,
    emailRemetente,
    conteudoEmail = null,
  } = req.body;
  const benefMatriculas = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc
    .filter(({ value }) => value)
    .map((benef) => benef.value.toString());

  try {
    const table = `${entity}_Eventos`;
    const tableAcoesCr = `${entity}_Acoes_Cr`;
    const tableComunicados = `${entity}_Comunicados`;
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

    const getAcaoCr = async () => {
      if (criarAcaoCR) {
        return await prisma.ba_Acoes_Cr.upsert({
          // return await prisma[tableAcoesCr].upsert({
          where: {
            id: acao_CrId === undefined ? "" : acao_CrId,
          },
          update: {
            nome,
            descricao:
              "Ação gerada automaticamente na modificação do evento " + nome,
            benefAssoc: {
              set: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              set: colabAcaoCR.map(({ value }) => ({ id: value })),
            },
            historico: {
              create: {
                // categoria: "Ação CR",
                descricao:
                  "Atualização de ação em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                tipoHistorico_Id: (
                  await prisma.ba_Historico_Tipo.findFirst({
                    where: {
                      nome: "Ação CR",
                    },
                  })
                ).id,
              },
            },
            excluido: false,
          },
          create: {
            nome,
            descricao:
              "Ação gerada automaticamente na modificação do evento " + nome,
            benefAssoc: {
              connect: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              connect: colabAcaoCR.map(({ value }) => ({ id: value })),
            },
            historico: {
              create: {
                // categoria: "Ação CR",
                descricao:
                  "Criação de ação em função da modificação do evento: " + nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                tipoHistorico_Id: (
                  await prisma.ba_Historico_Tipo.findFirst({
                    where: {
                      nome: "Ação CR",
                    },
                  })
                ).id,
              },
            },
          },
        });
      } else if (acao_CrId !== undefined) {
        return prisma[tableAcoesCr].update({
          data: {
            excluido: true,
          },
          where: {
            id: acao_CrId,
          },
        });
      } else {
        return null;
      }
    };

    const getComunicado = async () => {
      if (emailAlerts) {
        return prisma[tableComunicados].upsert({
          where: {
            id: comunicado_Id === undefined ? "" : comunicado_Id,
          },
          update: {
            assunto: nome,
            remetenteComunicado: {
              connect: {
                id: emailRemetente,
              },
            },
            benefAssoc: {
              set: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            conteudoEmail: JSON.stringify(conteudoEmail),
            excluido: false,
            historico: {
              create: {
                // categoria: "Comunicado",
                descricao:
                  "Atualização de comunicado em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },

                tipoHistorico_Id: (
                  await prisma.ba_Historico_Tipo.findFirst({
                    where: {
                      nome: "Comunicado",
                    },
                  })
                ).id,
              },
            },
          },
          create: {
            assunto: nome,
            benefAssoc: {
              connect: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            remetenteComunicado: {
              connect: {
                id: emailRemetente,
              },
            },
            conteudoEmail: JSON.stringify(conteudoEmail),
            historico: {
              create: {
                // categoria: "Comunicado",
                descricao:
                  "Criação de comunicado em função da modificação do evento: " +
                  nome,
                beneficiario: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },

                tipoHistorico_Id: (
                  await prisma.ba_Historico_Tipo.findFirst({
                    where: {
                      nome: "Comunicado",
                    },
                  })
                ).id,
              },
            },
          },
        });
      } else if (comunicado_Id !== undefined) {
        return prisma[tableComunicados].update({
          data: {
            excluido: true,
          },
          where: {
            id: comunicado_Id,
          },
        });
      } else {
        return null;
      }
    };

    const acaoCr = await getAcaoCr();
    const comunicado = await getComunicado();

    const query = await prisma[table].update({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),

        tipo_eventoId: tipo,
        local_EventoId: local || null,
        benefAssoc: {
          set: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_Cr: {
          set: acaoCr ? [{ id: acaoCr.id }] : [],
        },
        comunicado: {
          set: comunicado ? [{ id: comunicado.id }] : [],
        },
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
        res.status(409).json({ error: error });
        break;
    }
  }
};

const deleteEvento = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Eventos`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
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
        descricao: `Exclusão do evento: ${query.nome}`,
        beneficiario: {
          connect: query.benefAssoc.map(({ id }) => ({ id })),
        },
        eventos: {
          connect: {
            id: query.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Evento",
            },
          })
        ).id,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
