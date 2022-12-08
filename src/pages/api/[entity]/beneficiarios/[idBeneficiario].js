import _ from "lodash";
import { allowCors, filesAPIService } from "services";
import { prisma } from "services/prisma/prismaClient";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getBeneficiario(req, res);
      break;
    case "PUT":
      await putBeneficiarios(req, res);
      break;
    default:
      res.status(405).send({ message: "Only GET or PUT requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getBeneficiario = async (req, res) => {
  const { entity, idBeneficiario } = req.query;

  try {
    const table = `${entity}_Beneficiarios`;
    // const query = await prisma[table].findFirst({
    const query = await prisma.ba_Beneficiarios.findFirst({
      where: {
        excluido: false,
        id: idBeneficiario,
      },
      orderBy: [
        {
          nome: "asc",
        },
      ],
      include: {
        acoes: true,
        contatosAcoes: true,
        eventos: true,
        eventosListaPresenca: true,
        materiais: true,
        comunicados: true,
        enviosComunicados: true,
        oficios: true,
        enviosOficios: true,
        documentos: {
          orderBy: {
            createdAt: "desc",
          },
        },
        contatos: true,
        vaga: {
          include: {
            municipio: {
              include: {
                escritorioRegional: true,
                territorioIdentidade: true,
              },
            },
            remessaSec: true,
          },
        },
        etnia: true,
        materiaisEntregues: {
          include: {
            tamanhoEntregue: true,
            tipo: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        tamanhoUniforme: true,
        formacao: {
          include: {
            eixo: true,
          },
        },
        pendencias: true,
        historico: {
          include: {
            tipoHistorico: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const putBeneficiarios = async (req, res) => {
  const { entity, idBeneficiario } = req.query;

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === "" || req.body[key] == null) {
      req.body[key] = null;
    }
    if (req.body[key] === undefined) {
      delete req.body[key];
    }
  });

  const {
    pendencias,
    territorio,
    eixoFormacao_Id,
    matriculaFlem,
    superiorPeriodo,
    superiorAnoInicio,
    superiorAnoConclusao,
    email,
    obsEmail = [],
    celular,
    obsCelular = [],
    dataEntregaMaterial,
    idMaterial,
    idTamanho,
    qtdMaterial,
    obsMaterial,
    idCatHistorico,
    descricaoHistorico,
    histSigiloso,
    // Vaga
    demandante_Id,
    situacaoVaga_Id,
    publicadoDiarioOficial,
    vaga_municipio_Id,
    unidadeLotacao_Id,
    // Anexos
    anexos,
    descricaoDocumento,
    docSigiloso,
    ...formData
  } = req.body;

  try {
    const table = `${entity}_Beneficiarios`;

    const listaContatos = () => {
      const arr = [];
      if (Array.isArray(email)) {
        arr.push(
          ...email
            .filter((con) => con)
            .map((email, idx) => ({
              contato: email,
              observacao: _.isEmpty(obsEmail[idx]) ? null : obsEmail[idx],
              tipoContato_Id: "email",
            }))
        );
      }
      if (Array.isArray(celular)) {
        arr.push(
          ...celular
            .filter((con) => con)
            .map((celular, idx) => ({
              contato: celular,
              observacao: _.isEmpty(obsCelular[idx]) ? null : obsCelular[idx],
              tipoContato_Id: "celular",
            }))
        );
      }
      return arr;
    };

    const addMaterial = () => {
      if ((dataEntregaMaterial, idMaterial, idTamanho, qtdMaterial)) {
        return [
          prisma.ba_Materiais_Entregues.create({
            data: {
              beneficiarios_Id: idBeneficiario,
              tamanhoUniforme_Id: idTamanho,
              tipoMaterial_Id: idMaterial,
              observacao: obsMaterial,
              dataEntrega: dataEntregaMaterial,
              quantidade: parseInt(qtdMaterial),
            },
            include: {
              tamanhoEntregue: true,
              tipo: true,
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const addHistorico = () => {
      if ((idCatHistorico, descricaoHistorico, histSigiloso)) {
        return [
          prisma.ba_Historico.create({
            data: {
              descricao: descricaoHistorico,
              tipoHistorico_Id: idCatHistorico,
              sigiloso: JSON.parse(histSigiloso),
              beneficiario: {
                connect: {
                  id: idBeneficiario,
                },
              },
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const addDocumento = () => {
      if ((anexos, descricaoDocumento, docSigiloso)) {
        return [
          prisma.ba_Documentos.create({
            data: {
              descricao: descricaoDocumento,
              sigiloso: JSON.parse(docSigiloso),
              benefAssoc_Id: idBeneficiario,
              anexosId: JSON.stringify([{ id: anexos.id }]),
            },
          }),
        ];
      } else return [prisma.$queryRaw``];
    };

    const pendenciasToUpsert = await prisma.$transaction(async (prisma) => {
      const pendenciasBeneficiario = await prisma.ba_Beneficiarios
        .findFirst({
          where: {
            id: idBeneficiario,
          },
        })
        .pendencias();

      const pendenciasToCreate = Object.keys(pendencias)
        .map((key) => ({
          tipoPendencia_Id: key,
          value: pendencias[key],
        }))
        .filter(
          ({ tipoPendencia_Id }) =>
            !pendenciasBeneficiario
              .map(({ tipoPendencia_Id }) => tipoPendencia_Id)
              .includes(tipoPendencia_Id)
        )
        .filter(({ value }) => value);

      const pendenciasToUpdate = Object.keys(pendencias)
        .map((key) => ({
          tipoPendencia_Id: key,
          value: pendencias[key],
        }))
        .filter(({ tipoPendencia_Id }) =>
          pendenciasBeneficiario
            .map(({ tipoPendencia_Id }) => tipoPendencia_Id)
            .includes(tipoPendencia_Id)
        )
        .filter(({ value }) => value);

      return { create: pendenciasToCreate, update: pendenciasToUpdate };
    });

    const [contatosToCreate, contatosToUpdate] = await prisma.$transaction(
      async (prisma) => {
        const getContatos = await prisma.ba_Contatos_Beneficiarios.findMany({
          where: {
            AND: [
              {
                contato: {
                  in: listaContatos().map(({ contato }) => contato),
                },
              },
              {
                benefAssoc_Id: idBeneficiario,
              },
            ],
          },
        });

        const contatosCreate = listaContatos().filter(({ contato }) => {
          if (getContatos.length) {
            return !getContatos.map(({ contato }) => contato).includes(contato);
          } else {
            return true;
          }
        });

        const contatosUpdate = listaContatos().filter(({ contato }) => {
          if (getContatos.length) {
            return getContatos.map(({ contato }) => contato).includes(contato);
          } else {
            return true;
          }
        });
        return [contatosCreate, contatosUpdate];
      }
    );

    const [queryDocumento, queryMaterial, queryHistorico] =
      await prisma.$transaction([
        ...addDocumento(),
        ...addMaterial(),
        ...addHistorico(),
        prisma.ba_Pendencias.updateMany({
          data: {
            pendente: false,
          },
          where: {
            beneficiarios: {
              some: {
                id: idBeneficiario,
              },
            },
          },
        }),
        prisma.ba_Pendencias.updateMany({
          data: {
            pendente: true,
          },
          where: {
            beneficiarios: {
              some: {
                id: idBeneficiario,
              },
            },
            tipoPendencia_Id: {
              in: pendenciasToUpsert.update.map(
                ({ tipoPendencia_Id }) => tipoPendencia_Id
              ),
            },
          },
        }),
        ...pendenciasToUpsert.create.map(({ tipoPendencia_Id }) =>
          prisma.ba_Pendencias.create({
            data: {
              tipoPendencia_Id,
              beneficiarios: {
                connect: {
                  id: idBeneficiario,
                },
              },
            },
          })
        ),
        prisma.ba_Contatos_Beneficiarios.deleteMany({
          where: {
            AND: [
              {
                contato: {
                  notIn: listaContatos().map(({ contato }) => contato),
                },
              },
              {
                benefAssoc_Id: idBeneficiario,
              },
            ],
          },
        }),
        prisma.ba_Beneficiarios.update({
          data: {
            ...formData,
            superiorAnoInicio: parseInt(superiorAnoInicio) || null,
            superiorAnoConclusao: parseInt(superiorAnoConclusao) || null,
            superiorPeriodo: parseInt(superiorPeriodo) || null,
            matriculaFlem: parseInt(matriculaFlem) || null,
            contatos: {
              createMany: {
                data: contatosToCreate,
              },
              updateMany: contatosToUpdate.map((data) => ({
                data,
                where: {
                  contato: data.contato,
                },
              })),
            },
            vaga: {
              update: {
                data: {
                  demandante_Id,
                  situacaoVaga_Id,
                  publicadoDiarioOficial,
                  municipio_Id: vaga_municipio_Id,
                  unidadeLotacao_Id,
                },
                where: {
                  id: (
                    await prisma.ba_Vaga.findFirst({
                      where: {
                        beneficiario_Id: idBeneficiario,
                      },
                      orderBy: {
                        createdAt: "desc",
                      },
                    })
                  ).id,
                },
              },
            },
          },
          where: {
            id: idBeneficiario,
          },
        }),
      ]);

    if (queryMaterial.id) {
      await prisma.ba_Historico.create({
        data: {
          // categoria: "Entrega de Material",
          descricao: `Entrega do material: ${queryMaterial.tipo.nome}, tamanho: ${queryMaterial.tamanhoEntregue.tamanho}, qtd.: ${queryMaterial.quantidade}`,
          beneficiario: {
            connect: {
              id: queryMaterial.beneficiarios_Id,
            },
          },
          materialEntregue: {
            connect: {
              id: queryMaterial.id,
            },
          },
          tipoHistorico_Id: (
            await prisma.ba_Historico_Tipo.findFirst({
              where: {
                nome: "Entrega de Material",
              },
            })
          ).id,
        },
      });
    }

    if (queryDocumento.id) {
      await filesAPIService.patch(
        `/indexFile`,
        { referenceObj: queryDocumento },
        {
          params: { fileId: anexos.id },
        }
      );

      await prisma.ba_Historico.create({
        data: {
          descricao: `Incluído novo documento: ${descricaoDocumento}`,
          beneficiario: {
            connect: {
              id: idBeneficiario,
            },
          },
          sigiloso: queryDocumento.sigiloso,
          documentos: {
            connect: {
              id: queryDocumento.id,
            },
          },
          tipoHistorico_Id: (
            await prisma.ba_Historico_Tipo.findFirst({
              where: {
                nome: queryDocumento.sigiloso
                  ? "Documento Sigiloso"
                  : "Documento",
              },
            })
          ).id,
        },
      });
    }

    return res
      .status(200)
      .json({ queryDocumento, queryMaterial, queryHistorico });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
