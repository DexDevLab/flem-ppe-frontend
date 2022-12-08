import { DateTime } from "luxon";
import { celularMask } from "masks-br";
import { filesAPIService} from "services";
import { prisma } from "services/prisma/prismaClient";
import { maskCapitalize } from "utils/maskCapitalize";

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
      await getbenef(req, res);
      break;
    case "POST":
      await postBeneficiariosLote(req, res);
      break;

    default:
      res.status(405).send({ message: "Only POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getbenef = async (req, res) => {
  const etniaId = (
    await prisma.ba_Etnia.findFirst({
      where: {
        etnia: {
          contains: "Não Informada",
        },
      },
    })
  ).id;

  const teste = [
    {
      id: "cl7jpxbq701317o243tbe1c5i",
      nome: "Juliana Sousa Prado",
      cpf: null,
      matriculaFlem: null,
      matriculaSec: "9999999999",
      rg: null,
      dataNasc: "2004-01-12T02:00:00.000Z",
      ctps: null,
      pis: null,
      sexo: "Feminino",
      deficiencia: null,
      dataInicioAtividade: null,
      observacao: null,
      logradouro: null,
      numero: null,
      complemento: null,
      bairro: null,
      municipio: "Salvador",
      uf: null,
      cep: null,
      carteiraAssinada1Ano: false,
      ausenciaEstagio: false,
      escolaConclusao:
        "Centro Estadual de Educacao Profissional em Gestao Severino Vieira",
      escolaMunicipio: null,
      superiorConcluido: null,
      superiorModalidade: null,
      superiorPeriodo: null,
      cursoTipo: null,
      superiorTipo: null,
      superiorPretende: null,
      superiorCursando: null,
      superiorCursandoData: null,
      tecnicoMatriculadoOutro: null,
      tecnicoCursandoOutro: null,
      superiorCurso: null,
      superiorInstituicao: null,
      rendaPpeAjuda: null,
      superiorAnoInicio: null,
      superiorAnoConclusao: null,
      anamnese: false,
      excluido: false,
      createdBy: "SISTEMA",
      updatedBy: "SISTEMA",
      createdAt: "2022-09-02T00:08:44.959Z",
      updatedAt: "2022-09-02T00:08:44.960Z",
      etnia_Id: "cl7j1rjg601262124agtps6tv",
      tamanhoUniforme_Id: null,
      formacao_Id: "cl79lfrhk01123r24kmpj9815",
      vaga: [
        {
          id: "cl7jpxbq701337o24zj5yrf4s",
          dataConvocacao: "2022-02-07T03:00:00.000Z",
          dataPublicacaoDiarioOficial: null,
          observacao: null,
          excluido: false,
          createdBy: "SISTEMA",
          updatedBy: "SISTEMA",
          createdAt: "2022-09-02T00:08:44.959Z",
          updatedAt: "2022-09-02T00:08:44.960Z",
          situacaoVaga_Id: "cl7jntrub0019vr24ycup3gs4",
          remessaSec_Id: null,
          unidadeLotacao_Id: null,
          demandante_Id: "cl7i2ch7j0046rf24ade3pj59",
          beneficiario_Id: "cl7jpxbq701317o243tbe1c5i",
          historico_Id: null,
          municipio_Id: "cl7i9qut50379m124un6q6hbk",
        },
      ],
    },
    {
      id: "cl7jpxbq901357o246ggxl68e",
      nome: "Leticia dos Santoz Maciel",
      cpf: "080.823.175-83",
      matriculaFlem: null,
      matriculaSec: "11",
      rg: null,
      dataNasc: "2002-06-28T03:00:00.000Z",
      ctps: null,
      pis: null,
      sexo: "Feminino",
      deficiencia: null,
      dataInicioAtividade: null,
      observacao: null,
      logradouro: null,
      numero: null,
      complemento: null,
      bairro: null,
      municipio: "Salvador",
      uf: null,
      cep: null,
      carteiraAssinada1Ano: false,
      ausenciaEstagio: false,
      escolaConclusao: "Colegio Estadual Democratico Bertholdo Cirilo dos Reis",
      escolaMunicipio: null,
      superiorConcluido: null,
      superiorModalidade: null,
      superiorPeriodo: null,
      cursoTipo: null,
      superiorTipo: null,
      superiorPretende: null,
      superiorCursando: null,
      superiorCursandoData: null,
      tecnicoMatriculadoOutro: null,
      tecnicoCursandoOutro: null,
      superiorCurso: null,
      superiorInstituicao: null,
      rendaPpeAjuda: null,
      superiorAnoInicio: null,
      superiorAnoConclusao: null,
      anamnese: false,
      excluido: false,
      createdBy: "SISTEMA",
      updatedBy: "SISTEMA",
      createdAt: "2022-09-02T00:08:44.961Z",
      updatedAt: "2022-09-02T00:08:44.961Z",
      etnia_Id: "cl7j1rjg601262124agtps6tv",
      tamanhoUniforme_Id: null,
      formacao_Id: "cl79lfrhk01123r24kmpj9815",
      vaga: [
        {
          id: "cl7jpxbq901377o248mes9arz",
          dataConvocacao: "2022-02-07T03:00:00.000Z",
          dataPublicacaoDiarioOficial: null,
          observacao: null,
          excluido: false,
          createdBy: "SISTEMA",
          updatedBy: "SISTEMA",
          createdAt: "2022-09-02T00:08:44.961Z",
          updatedAt: "2022-09-02T00:08:44.961Z",
          situacaoVaga_Id: "cl7jntrub0019vr24ycup3gs4",
          remessaSec_Id: null,
          unidadeLotacao_Id: null,
          demandante_Id: "cl7i2ch7k0071rf24xmmyqcva",
          beneficiario_Id: "cl7jpxbq901357o246ggxl68e",
          historico_Id: null,
          municipio_Id: "cl7i9qut50379m124un6q6hbk",
        },
      ],
    },
  ];

  console.log(
    new Array().concat(
      ...teste.map(({ vaga }) =>
        vaga.map(({ id }) => {
          id;
        })
      )
    )
  );

  res.json(etniaId);
};

const postBeneficiariosLote = async (req, res) => {
  const { entity } = req.query;

  const { numRemessa, dataRemessa, benef, fileDetails } = req.body;

  try {
    const table = `${entity}_Beneficiarios`;

    const remessaCreate = await prisma.ba_RemessaSec.create({
      data: {
        remessa: parseInt(numRemessa),
        data_remessa: DateTime.fromSQL(dataRemessa).toISO(),
        arquivo_importacao: fileDetails.id,
      },
    });

    const dataToImport = benef.map(
      ({
        demandante,
        municipioDaVaga,
        // municipioDoAluno,
        cursoDeFormacao,
        raca_cor,
        // nomeDoColegio,
        // dataDeNascimento,
        // cpfAluno,
        // sexo,
        // matricula,
        // nome,
        // telefone01,
        // telefone02,
        // dataDaConvocacao,
        // found,
        // update,
        ...rest
      }) => {
        const queries = prisma.$transaction(async (prisma) => {
          const demandanteId = (
            await prisma.ba_Demandantes.findFirst({
              where: {
                nome: {
                  contains: demandante.replace(/.*- /, ""),
                },
              },
            })
          ).id;
          const municipioVagaId = (
            await prisma.ba_Municipios.findFirst({
              where: {
                nome: {
                  contains: municipioDaVaga.toLowerCase(),
                },
              },
            })
          ).id;
          // const municipioAlunoId = (
          //   await prisma.ba_Municipios.findFirst({
          //     where: {
          //       nome: {
          //         contains: municipioDoAluno,
          //       },
          //     },
          //   })
          // ).id;
          const cursoFormacaoId = (
            await prisma.ba_Formacao.findFirst({
              where: {
                nome: {
                  contains: cursoDeFormacao,
                },
              },
            })
          ).id;
          const etniaId = (
            await prisma.ba_Etnia.findFirst({
              where: {
                etnia: {
                  contains: raca_cor,
                },
              },
            })
          ).id;

          Object.keys(rest).forEach((key) => {
            if (rest[key] === "" || rest[key] == null) {
              rest[key] = null;
            }
          });

          return {
            demandanteId,
            municipioVagaId,
            // municipioAlunoId,
            cursoFormacaoId,
            etniaId,
            ...rest,
          };
        });

        return queries;
      }
    );

    const situacaoDefault = await prisma.ba_Situacoes_Vaga.findFirst({
      where: {
        nome: "Realizar Contato",
      },
    });

    const benefsToCreate = (await Promise.all(dataToImport)).map((benef) => ({
      nome: benef.nome,
      matriculaSec: benef.matricula.toString(),
      cpf: benef.cpfAluno,
      dataNasc: DateTime.fromFormat(
        benef.dataDeNascimento,
        "dd/MM/yyyy"
      ).toISO(),
      escolaConclusao: benef.nomeDoColegio,
      sexo: maskCapitalize(benef.sexo),
      formacao_Id: benef.cursoFormacaoId,
      etnia_Id: benef.etniaId,
      municipio: benef.municipioDoAluno,
      contatos: {
        createMany: {
          data: [benef.telefone01, benef.telefone02]
            .filter((contato) => contato)
            .map((contato) => ({
              contato: celularMask(contato),
              tipoContato_Id: "celular",
            })),
        },
      },
      vaga: {
        create: {
          demandante_Id: benef.demandanteId,
          dataConvocacao: DateTime.fromFormat(
            benef.dataDaConvocacao,
            "dd/MM/yyyy"
          ).toISO(),
          situacaoVaga_Id: situacaoDefault.id,
          municipio_Id: benef.municipioVagaId,
          remessaSec_Id: remessaCreate.id,
        },
      },
    }));

    const query = await prisma.$transaction(
      benefsToCreate.map((data) =>
        prisma.ba_Beneficiarios.upsert({
          create: data,
          update: data,
          where: {
            matriculaSec: data.matriculaSec,
          },
          include: {
            vaga: true,
          },
        })
      )
    );

    const historico = await prisma.$transaction(async (prisma) => {
      const create = await prisma.ba_Historico.create({
        data: {
          descricao: `Atribuída nova vaga ao beneficiário. Remessa nº ${numRemessa}`,
          tipoHistorico_Id: (
            await prisma.ba_Historico_Tipo.findFirst({
              where: {
                nome: "Vaga",
              },
            })
          ).id,
        },
      });

      const update = await prisma.ba_Historico.update({
        data: {
          vaga: {
            set: new Array().concat(
              ...query.map(({ vaga }) =>
                vaga.map(({ id }) => ({
                  id,
                }))
              )
            ),
          },
          beneficiario: {
            set: query.map(({ id }) => ({
              id,
            })),
          },
          remessaSec: {
            connect: {
              id: remessaCreate.id,
            },
          },
        },

        where: {
          id: create.id,
        },
      });

      return { create, update };
    });

    const fileIndex = await filesAPIService.patch(
      `/indexFile`,
      { referenceObj: remessaCreate },
      {
        params: { fileId: fileDetails.id },
      }
    );

    return res.status(200).json(query, historico);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
