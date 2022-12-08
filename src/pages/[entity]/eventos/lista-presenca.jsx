import {
  Box,
  chakra,
  Flex,
  Heading,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Logo } from "components/Logo";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { axios, getBackendRoute } from "services";
import { maskCapitalize } from "utils";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [eventoData, setEventoData] = useState([]);
  const { idEvento } = router.query;

  useEffect(() => {
    if (idEvento) {
      axios
        //.get(`/api/${entity}/eventos`, { params: { idEvento } })
        .get(getBackendRoute(entity, "eventos"), {
          params: {
            id: idEvento,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setEventoData(res.data[0]);
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          throw new Error(error.response.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEvento]);

  return (
    <>
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
                <TableContainer>
                  <Table
                    w="full"
                    sx={{ tableLayout: "auto" }}
                    variant="simple"
                    size="sm"
                  >
                    <chakra.thead>
                      <tr>
                        <th colSpan="100%">
                          <Flex py={4} direction="column">
                            <Heading size="md" color="gray.700" pb={2}>
                              Projeto Primeiro Emprego
                            </Heading>
                            <Stack
                              spacing={1.5}
                              bg="gray.100"
                              px={2}
                              py={4}
                              rounded="md"
                              my={2}
                            >
                              <Heading size="xs" color="gray.600">
                                Lista de Presença: {eventoData.nome}
                              </Heading>
                              <Heading size="xs" color="gray.600">
                                Modalidade:{" "}
                                {maskCapitalize(eventoData.modalidade)}
                              </Heading>
                              {eventoData.modalidade === "presencial" && (
                                <Heading size="xs" color="gray.600">
                                  {` Local: ${eventoData.localEvento.nome} - ${
                                    eventoData.localEvento.logradouro
                                  }, ${
                                    eventoData.localEvento.complemento !== "" &&
                                    eventoData.localEvento.complemento !== null
                                      ? `${eventoData.localEvento.complemento}, `
                                      : null
                                  } ${eventoData.localEvento.bairro}, ${
                                    eventoData.localEvento.cidade
                                  } - ${eventoData.localEvento.uf} ${
                                    eventoData.localEvento.cep
                                  }`}
                                </Heading>
                              )}
                              <Heading size="xs" color="gray.600">
                                Data:{" "}
                                {DateTime.fromISO(
                                  eventoData.data
                                ).toLocaleString(DateTime.DATETIME_SHORT)}
                              </Heading>
                            </Stack>
                          </Flex>
                        </th>
                      </tr>
                      <Tr>
                        <Th>Matrícula</Th>
                        <Th>Nome / Demandante</Th>
                        <Th>Formação</Th>
                        <Th>Assinatura</Th>
                      </Tr>
                    </chakra.thead>
                    <Tbody>
                      {Array.isArray(eventoData.benefAssoc) &&
                        eventoData.benefAssoc.map((benef) => (
                          <Tr key={JSON.stringify(benef)}>
                            <Td>{benef.matriculaFlem}</Td>
                            <Td>
                              <Box>{maskCapitalize(benef.nome)}</Box>
                              <Text fontSize={12} pt={1}>
                                {benef.vaga?.demandante} /{" "}
                                {benef.vaga?.municipio}
                              </Text>
                            </Td>
                            <Td>{maskCapitalize(benef.formacao)}</Td>
                            <Td minW={300} borderColor="gray.400" />
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </TableContainer>
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
    params: { entity },
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

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

TemplateOficios.auth = false;
TemplateOficios.dashboard = false;
