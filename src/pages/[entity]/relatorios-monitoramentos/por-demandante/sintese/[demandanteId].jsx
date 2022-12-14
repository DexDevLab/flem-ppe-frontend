import {
  chakra,
  Flex,
  Heading,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import { Logo } from "components/Logo";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { axios } from "services/apiService";
import _ from "lodash";
import Head from "next/head";

export default function MonitoramentoPorBeneficiario({
  entity,
  monitoramento,
  dataInicio,
  dataFim,
  ...props
}) {
  const router = useRouter();
  const { asPath } = router;

  return (
    <>
      <Head>
        <title>{`PPE_RELATORIO_SINTESE_${
          monitoramento[0].beneficiario.vaga.demandante.sigla
        }_${DateTime.fromISO(dataInicio).toFormat(
          "dd.MM.yyyy"
        )}_${DateTime.fromISO(dataFim).toFormat("dd.MM.yyyy")}`}</title>
      </Head>

      <chakra.div
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="page-header"
        style={{ textAlign: "center" }}
        // px={14}
        // pt={14}
      >
        <Logo h={30} my={12} />
        <br />
        <button
          type="button"
          onClick={() => window.print()}
          style={{ background: "pink" }}
        >
          PRINT ME!
        </button>
        <Image
          src="https://www.planserv.ba.gov.br/wp-content/uploads/2022/07/Brasa%E2%95%A0ao-Horizontal_Cor.png"
          h={50}
        />
      </chakra.div>
      <chakra.div className="page-footer">
        {/* <Flex px={14}>
          <Box>
            <Text fontSize={9} pt={2}>
              <chakra.span fontWeight="bold">Endereço: </chakra.span> Rua
              Visconde de Itaborahy, 845, Amaralina, Salvador - BA 41900-000
            </Text>
            <Text fontSize={9}>
              <chakra.span fontWeight="bold">Contato: </chakra.span> (71)
              3103-7500
            </Text>
          </Box>
        </Flex> */}
      </chakra.div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <td>
              {/* <!--place holder for the fixed-position header--> */}
              <div className="page-header-space"></div>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              {/* <!--*** CONTENT GOES HERE ***--> */}
              <chakra.div
                className="page"
                // px={14}
              >
                <Flex py={4} direction="column">
                  <Heading size="sm" color="gray.700" pb={4} textAlign="center">
                    Serviço de Apoio à Primeira Experiência Profissional do
                    Egresso do Ensino Técnico da Rede Estadual de Educação
                    Profissional no âmbito do Projeto primeiro emprego
                  </Heading>
                  <Heading size="xs" color="gray.700" pb={4} textAlign="center">
                    Síntese de Visitas de Monitoramento e Avaliações - Quanto às
                    Funções Desenvolvidas:{" "}
                    {`${DateTime.fromISO(dataInicio).toFormat(
                      "dd/MM/yyyy"
                    )} à ${DateTime.fromISO(dataFim).toFormat("dd/MM/yyyy")}`}
                  </Heading>
                </Flex>

                {/* <TableContainer> */}
                <Table
                  w="full"
                  style={{ tableLayout: "fixed" }}
                  variant="striped"
                  size="sm"
                >
                  <chakra.thead>
                    <Tr>
                      <Th paddingInline={0} p={1} fontSize="xx-small" w="8%">
                        Matrícula
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Admissão
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Nome
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        CPF
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Demandante
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Unidade de Lotação
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Data do Monitoramento
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Município
                      </Th>
                      <Th paddingInline={0} p={1} fontSize="xx-small">
                        Monitor
                      </Th>
                    </Tr>
                  </chakra.thead>
                  <Tbody>
                    {monitoramento.map(
                      (
                        {
                          dataMonitoramento,
                          beneficiario: {
                            cpf,
                            dataInicioAtividade,
                            matriculaFlem,
                            nome,
                            vaga: { demandante, unidadeLotacao, municipio },
                          },
                          monitor,
                        },
                        idx
                      ) => (
                        <Tr key={`table-row-${idx}`}>
                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {matriculaFlem}
                          </Td>
                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {DateTime.fromISO(
                              dataInicioAtividade
                            ).toLocaleString(DateTime.DATE_MED)}
                          </Td>
                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {nome}
                          </Td>
                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {cpf}
                          </Td>
                          <Td p={2} fontSize="xs" width="100%">
                            <Text noOfLines={2}>
                              {`${demandante.sigla} - ${demandante.nome}`}{" "}
                            </Text>
                          </Td>

                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {unidadeLotacao.nome}
                          </Td>
                          <Td
                            p={2}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {DateTime.fromISO(dataMonitoramento).toLocaleString(
                              DateTime.DATETIME_MED
                            )}
                            h
                          </Td>
                          <Td
                            p={1}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {municipio.nome}
                          </Td>
                          <Td
                            p={1}
                            style={{ wordBreak: "break-word" }}
                            fontSize="xs"
                          >
                            {monitor.nome}
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
                {/* </TableContainer> */}
              </chakra.div>
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td>
              {/* <!--place holder for the fixed-position footer--> */}
              <div className="page-footer-space"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    query: { entity, demandanteId, dataInicio = null, dataFim = null },
  } = context;
  const entities = ["ba", "to", "rj"];

  // const posts = await api.getContentList({
  //   referenceName: "posts",
  //   languageCode: "en-us"
  // });
  // const page = posts.items.find((post) => {
  //   return post.fields.slug === ctx.params.slug.join("/");
  // });

  const entityCheck = entities.find((ent) => ent === entity || undefined);
  try {
    const { data } = await axios.get(
      `/api/${entity}/monitoramento/realizados`,
      {
        params: {
          demandanteId,
          dataInicio,
          dataFim,
        },
      }
    );

    const monitoramento = data.map(({ beneficiario, ...rest }) => ({
      ...rest,
      beneficiario: {
        ...beneficiario,
        vaga: beneficiario.vaga.shift(),
      },
    }));

    // monitoramento?.beneficiario.vaga = data.beneficiario.vaga.shift();

    return {
      props: {
        entity: entityCheck || null,
        monitoramento,
        dataInicio,
        dataFim,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

MonitoramentoPorBeneficiario.auth = false;
MonitoramentoPorBeneficiario.dashboard = false;
