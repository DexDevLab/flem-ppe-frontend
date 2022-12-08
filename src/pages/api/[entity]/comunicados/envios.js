import { convertDeltaToHtml } from "node-quill-converter";
import { mailService, prisma } from "services";
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
  const { id } = req.body;

  try {
    const table = `${entity}_Comunicados_Enviados`;
    const tableComunicados = `${entity}_Comunicados`;

    const getComunicado = await prisma.ba_Comunicados.findFirst({
      // const getComunicado = await prisma[tableComunicados].findFirst({
      where: {
        id,
      },
      include: {
        benefAssoc: {
          include: {
            contatos: true,
          },
        },
        remetenteComunicado: true,
      },
    });

    const conteudoEmail = JSON.parse(getComunicado.conteudoEmail);

    const enviosToCreate = getComunicado.benefAssoc.map((benef) => {
      const conteudoPopulado = conteudoEmail.ops.map((obj, idx) => {
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
        comunicado_Id: getComunicado.id,
        conteudoEmail: JSON.stringify({ ops: conteudoPopulado }),
        mailDetails: {
          remetente: getComunicado.remetenteComunicado,
          contatos: benef.contatos.filter(
            ({ tipoContato_Id }) => tipoContato_Id === "email"
          ),
          assunto: getComunicado.assunto,
          html: convertDeltaToHtml({ ops: conteudoPopulado }),
          anexosId: getComunicado.anexosId,
        },
      };
    });

    const query = await prisma.$transaction(
      enviosToCreate.map(({ mailDetails, ...rest }) =>
        prisma[table].create({ data: rest })
      )
    );

    await prisma.ba_Historico.create({
      data: {
        // categoria: "Envio de Comunicado",
        descricao: `Envio do comunicado: ${getComunicado.assunto}`,
        beneficiario: {
          connect: getComunicado.benefAssoc.map(({ id }) => ({ id })),
        },
        comunicados: {
          connect: {
            id: getComunicado.id,
          },
        },
        tipoHistorico_Id: (
          await prisma.ba_Historico_Tipo.findFirst({
            where: {
              nome: "Envio de Comunicado",
            },
          })
        ).id,
      },
    });

    const mailsToSend = query.map((env) => ({
      ...env,
      ...enviosToCreate.find(
        ({ beneficiario_Id }) => beneficiario_Id === env.beneficiario_Id
      ).mailDetails,
    }));

    mailService
      .post(`/sendMail`, mailsToSend)
      .then((res) => console.log(res.data))
      .catch((res) => console.log(res.data));

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

export default allowCors(handler);
