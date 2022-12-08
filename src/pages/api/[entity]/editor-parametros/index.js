import { allowCors, prisma } from "services";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getEditorParametros(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getEditorParametros = async (req, res) => {
  const { entity } = req.query;
  try {
    const table = `${entity}_Unidade_Lotacao`;

    // const query = await prisma.ba_Editor_Parametros.createMany({
    //   data: [
    //     {
    //       rotulo: "Nome do Beneficiário",
    //       nomeTabela: "ba_Beneficiario",
    //       nomeColuna: "nome",
    //     },
    //     {
    //       rotulo: "Formação do Beneficiário",
    //       nomeTabela: "ba_Beneficiario",
    //       nomeColuna: "formacao_Id",
    //     },
    //     {
    //       rotulo: "Código do Ofício",
    //       nomeTabela: "ba_Oficios",
    //       nomeColuna: "codOficio",
    //     },
    //     {
    //       rotulo: "Unidade de Lotação",
    //       nomeTabela: "ba_Unidade_Lotacao",
    //       nomeColuna: "nome",
    //     },
    //     {
    //       rotulo: "Logradouro da Unidade de Lotação",
    //       nomeTabela: "ba_Unidade_Lotacao",
    //       nomeColuna: "logradouro",
    //     },
    //     {
    //       rotulo: "Bairro Unidade de Lotação",
    //       nomeTabela: "ba_Unidade_Lotacao",
    //       nomeColuna: "bairro",
    //     },
    //     {
    //       rotulo: "Ponto Focal da Unidade de Lotação",
    //       nomeTabela: "ba_Unidade_Lotacao_Ponto_Focal",
    //       nomeColuna: "nome",
    //     },
    //     {
    //       rotulo: "Município da Vaga",
    //       nomeTabela: "ba_Vaga",
    //       nomeColuna: "municipio_Id",
    //     },
    //     {
    //       rotulo: "Demandante",
    //       nomeTabela: "ba_Demandantes",
    //       nomeColuna: "nome",
    //     },
    //     {
    //       rotulo: "Sigla do Demandante",
    //       nomeTabela: "ba_Demandantes",
    //       nomeColuna: "sigla",
    //     },
    //   ],
    // });
    const query = await prisma.ba_Editor_Parametros.findMany({
      where: {
        excluido: false,
      },
      orderBy: {
        rotulo: "asc",
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
