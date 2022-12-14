import {
  Box,
  Center,
  chakra,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
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
import { axios, filesAPIService } from "services/apiService";
import _ from "lodash";
import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

export default function MonitoramentoPorBeneficiario({
  entity,
  monitoramentosFromBd,
  demandInfo,
  dataInicio,
  dataFim,
  ...props
}) {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const router = useRouter();
  const { asPath } = router;
  const [monitoramentosComAnexos, setMonitoramentosComAnexos] = useState(null);

  const getAnexos = async (param) => {
    try {
      const { data } = await filesAPIService.get(`/downloadFile`, {
        params: {
          ...param,
        },
        responseType: "arraybuffer",
      });
      const { data: fileDetails } = await filesAPIService.get(`/getFile`, {
        params: {
          ...param,
        },
      });

      return { ...fileDetails, data: Buffer.from(data) };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    Promise.all(
      monitoramentosFromBd.map(
        async ({
          autoAvaliacao_anexoId,
          monitoramentoComprovacao_Id,
          ambienteTrabalho_anexoId,
          benefPontoFocal_anexoId,
          ...monit
        }) => ({
          ...monit,
          file_monitoramentoComprovacao: _.isEmpty(monitoramentoComprovacao_Id)
            ? null
            : await getAnexos({
                referenceObjId: monitoramentoComprovacao_Id,
              }).then((res) => res),
          file_autoAvaliacao: _.isEmpty(autoAvaliacao_anexoId)
            ? null
            : await getAnexos({
                fileId: JSON.parse(autoAvaliacao_anexoId)[0].id,
              }).then((res) => res),
          file_ambienteTrabalho: _.isEmpty(ambienteTrabalho_anexoId)
            ? null
            : await getAnexos({
                fileId: JSON.parse(ambienteTrabalho_anexoId)[0].id,
              }).then((res) => res),
          file_benefPontoFocal: _.isEmpty(benefPontoFocal_anexoId)
            ? null
            : await getAnexos({
                fileId: JSON.parse(benefPontoFocal_anexoId)[0].id,
              }).then((res) => res),
        })
      )
    ).then((res) => setMonitoramentosComAnexos(res));
  }, []);

  return (
    <>
      <Head>
        <title>{`PPE_RELATORIO_SINTESE_${
          monitoramentosFromBd[0].beneficiario.vaga.demandante.sigla
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
              {monitoramentosComAnexos &&
                !_.isEmpty(
                  monitoramentosComAnexos.filter(
                    ({ metaType }) => metaType === "4.1"
                  )
                ) && (
                  <>
                    {/* Capa Meta 4.1 */}
                    <chakra.div className="page">
                      <Box pt={20}>
                      
                          <Heading
                            size="2xl"
                            color="gray.700"
                            textAlign="center"
                          >
                            Projeto Primeiro Emprego
                          </Heading>
                          <Heading
                            size="xl"
                            color="gray.700"
                            py={12}
                            textAlign="center"
                          >
                            Relatório de Monitoramento - Submeta 4.1
                          </Heading>
                          <Heading
                            size="xl"
                            color="gray.700"
                            textAlign="center"
                          >
                            {`${demandInfo.sigla} - ${demandInfo.nome}`}
                          </Heading>{" "}
                    
                      </Box>
                    </chakra.div>

                    <div
                      className="page"
                      id="landscape"
                      // px={14}
                    >
                      <Box py={4} direction="column">
                        <Heading
                          size="sm"
                          color="gray.700"
                          pb={4}
                          textAlign="center"
                        >
                          Serviço de Apoio à Primeira Experiência Profissional
                          do Egresso do Ensino Técnico da Rede Estadual de
                          Educação Profissional no âmbito do Projeto primeiro
                          emprego
                        </Heading>
                        <Heading
                          size="xs"
                          color="gray.700"
                          pb={4}
                          textAlign="center"
                        >
                          Síntese de Visitas de Monitoramento e Avaliações -
                          Quanto às Funções Desenvolvidas:
                          {` ${DateTime.fromISO(dataInicio).toFormat(
                            "dd/MM/yyyy"
                          )} à ${DateTime.fromISO(dataFim).toFormat(
                            "dd/MM/yyyy"
                          )}`}
                        </Heading>
                      </Box>

                      {/* <TableContainer> */}
                      <Table
                        w="full"
                        style={{ tableLayout: "fixed" }}
                        variant="striped"
                        size="sm"
                      >
                        <chakra.thead>
                          <Tr>
                            <Th
                              paddingInline={0}
                              p={1}
                              fontSize="xx-small"
                              w="8%"
                            >
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
                          {monitoramentosComAnexos
                            .filter(({ metaType }) => metaType === "4.1")
                            .map(
                              (
                                {
                                  dataMonitoramento,
                                  beneficiario: {
                                    cpf,
                                    dataInicioAtividade,
                                    matriculaFlem,
                                    nome,
                                    vaga: {
                                      demandante,
                                      unidadeLotacao,
                                      municipio,
                                    },
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
                                    {DateTime.fromISO(
                                      dataMonitoramento
                                    ).toLocaleString(DateTime.DATETIME_MED)}
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
                    </div>

                    <div className="page">
                      <Box h="100vh" pt={40}>
                        <Flex flexDir="column" h="full" justifyContent="center">
                          <Box>
                            <Heading
                              size="2xl"
                              color="gray.700"
                              pb={6}
                              textAlign="center"
                            >
                              Rede de Monitoramento
                            </Heading>
                            <Heading
                              size="xl"
                              color="gray.700"
                              pb={4}
                              textAlign="center"
                            >
                              {`${DateTime.fromISO(dataInicio).toFormat(
                                "dd/MM/yyyy"
                              )} à ${DateTime.fromISO(dataFim).toFormat(
                                "dd/MM/yyyy"
                              )}`}
                            </Heading>
                            {[
                              ...new Set(
                                monitoramentosComAnexos
                                  .filter(({ metaType }) => metaType === "4.1")
                                  .map(
                                    ({
                                      beneficiario: {
                                        vaga: {
                                          municipio: { nome },
                                        },
                                      },
                                    }) => nome
                                  )
                              ),
                            ].map((nome) => (
                              <Heading
                                size="lg"
                                color="gray.700"
                                pb={2}
                                textAlign="center"
                                key={nome + "_municip_4.1"}
                              >
                                {nome}
                              </Heading>
                            ))}
                          </Box>
                        </Flex>
                      </Box>
                    </div>

                    {[
                      ...new Set(
                        monitoramentosComAnexos
                          .filter(({ metaType }) => metaType === "4.1")
                          .map(
                            ({
                              beneficiario: {
                                vaga: {
                                  municipio: { nome },
                                },
                              },
                            }) => nome
                          )
                      ),
                    ].map((nome) => (
                      <Fragment key={nome + "_municip_4.1_capa"}>
                        <div className="page">
                          <Box h="100vh" pt={40}>
                            <Flex
                              flexDir="column"
                              h="full"
                              justifyContent="center"
                            >
                              <Heading
                                size="xl"
                                color="gray.700"
                                pb={2}
                                textAlign="center"
                                key={nome + "_municip_4.1_monitoramentos"}
                              >
                                {nome}
                              </Heading>
                            </Flex>
                          </Box>
                        </div>

                        {monitoramentosComAnexos &&
                          monitoramentosComAnexos
                            .filter(
                              ({
                                beneficiario: {
                                  vaga: {
                                    municipio: { nome: municipNome },
                                  },
                                },
                                metaType,
                              }) => metaType === "4.1" && municipNome === nome
                            )
                            .map(
                              ({
                                monitoramentoComprovacao_Id,
                                file_monitoramentoComprovacao,
                                file_autoAvaliacao,
                                file_ambienteTrabalho,
                                file_benefPontoFocal,
                                ...monitoramento
                              }) => (
                                <Fragment key={`monit_id_${monitoramento.id}`}>
                                  <div className="page">
                                    <Box h="90vh" pt={4} direction="column">
                                      <Heading
                                        size="md"
                                        color="gray.700"
                                        pb={4}
                                        textAlign="center"
                                      >
                                        Projeto Primeiro Emprego - Registro de
                                        Monitoramento
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Nome do beneficiário:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.beneficiario.nome}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario
                                                .formacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Data do monitoramento:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            ).toLocaleString(
                                              DateTime.DATETIME_MED
                                            )}
                                            h
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Município:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .municipio.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Demandante:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {`${monitoramento.beneficiario.vaga.demandante.sigla} - ${monitoramento.beneficiario.vaga.demandante.nome}`}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Unidade de lotação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .unidadeLotacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Meta executada:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.metaType === "4.1"
                                              ? "Submeta 4.1 (4.500 profissionais técnicos trimestralmente acompanhados e monitorados no desenvolvimento das suas funções)"
                                              : "Submeta 4.2 (4.500 profissionais técnicos avaliados semestralmente)"}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Meios de comprovação das metas e
                                            submetas produzidas/entregues:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {!_.isEmpty(
                                              monitoramento.monitoramentoComprovacao_Id
                                            ) && "Lista de Presença"}
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Principais Registros da Visitação ao
                                            local de trabalho:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="justify"
                                          >
                                            {monitoramento.registrosVisitacao}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            O Técnico encontra-se em desvio de
                                            função?
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.desvioFuncao === true
                                              ? `Sim. ${monitoramento.desvioFuncaoDescricao}`
                                              : "Não"}
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                      {monitoramento.metaType === "4.1" &&
                                        (!_.isEmpty(
                                          monitoramento.autoAvaliacao_anexoId
                                        ) ||
                                          !_.isEmpty(
                                            monitoramento.benefPontoFocal_anexoId
                                          ) ||
                                          !_.isEmpty(
                                            monitoramento.ambienteTrabalho_anexoId
                                          )) && (
                                          <SimpleGrid
                                            spacing={4}
                                            columns={1}
                                            bg="gray.100"
                                            px={2}
                                            py={4}
                                            rounded="md"
                                            my={2}
                                          >
                                            <Box>
                                              <Heading
                                                fontSize="xs"
                                                color="gray.500"
                                                pb={1}
                                                textAlign="start"
                                              >
                                                Avaliações Realizadas:
                                              </Heading>
                                              {!_.isEmpty(
                                                monitoramento.autoAvaliacao_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Auto Avaliação
                                                </Heading>
                                              )}
                                              {!_.isEmpty(
                                                monitoramento.benefPontoFocal_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Beneficiário pelo Ponto Focal
                                                </Heading>
                                              )}
                                              {!_.isEmpty(
                                                monitoramento.ambienteTrabalho_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Ambiente de Trabalho
                                                </Heading>
                                              )}
                                            </Box>
                                          </SimpleGrid>
                                        )}
                                    </Box>
                                  </div>

                                  <chakra.div
                                    className="page"
                                    // pt={8}
                                  >
                                    <Box h="90vh">
                                      <Heading
                                        size="md"
                                        color="gray.700"
                                        py={4}
                                        textAlign="center"
                                      >
                                        Projeto Primeiro Emprego - Registro de
                                        Monitoramento
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Nome do beneficiário:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.beneficiario.nome}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario
                                                .formacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Data do monitoramento:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            ).toLocaleString(
                                              DateTime.DATETIME_MED
                                            )}
                                            h
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Município:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .municipio.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Demandante:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {`${monitoramento.beneficiario.vaga.demandante.sigla} - ${monitoramento.beneficiario.vaga.demandante.nome}`}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Unidade de lotação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .unidadeLotacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <Heading
                                        size="sm"
                                        color="gray.700"
                                        textAlign="center"
                                        pt={6}
                                      >
                                        Impressões da Equipe Técnica Primeiro
                                        Emprego
                                      </Heading>
                                      <Heading
                                        size="xs"
                                        color="gray.700"
                                        textAlign="center"
                                      >
                                        Conceito: Boa, Regular ou Ruim
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Conhecimento
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesConhecimento
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Pontualidade
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesPontualidade
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Habilidade
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesHabilidade}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Motivação
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesMotivacao}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Autonomia
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesAutonomia}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Experiência Profssional compatível
                                            com a formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesExperienciaCompFormacao
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={4}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Observações
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.observacoesEquipePpe}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Previsão de Visitas e Próximos
                                            Monitoramentos
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            )
                                              .plus({ months: 3 })
                                              .toLocaleString(
                                                DateTime.DATETIME_MED
                                              )}
                                            h
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                    </Box>
                                  </chakra.div>

                                  {!_.isEmpty(
                                    file_monitoramentoComprovacao
                                  ) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_monitoramentoComprovacao.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_monitoramentoComprovacao.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_monitoramentoComprovacao.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_monitoramentoComprovacao
                                                .fileDetails.contentType
                                            };base64,${file_monitoramentoComprovacao.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_autoAvaliacao) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_autoAvaliacao.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_autoAvaliacao.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_autoAvaliacao.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_autoAvaliacao.fileDetails
                                                .contentType
                                            };base64,${file_autoAvaliacao.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_ambienteTrabalho) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_ambienteTrabalho.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_ambienteTrabalho.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_ambienteTrabalho.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_ambienteTrabalho.fileDetails
                                                .contentType
                                            };base64,${file_ambienteTrabalho.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_benefPontoFocal) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_benefPontoFocal.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_benefPontoFocal.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_benefPontoFocal.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_benefPontoFocal.fileDetails
                                                .contentType
                                            };base64,${file_benefPontoFocal.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}
                                </Fragment>
                              )
                            )}
                      </Fragment>
                    ))}
                  </>
                )}

              {monitoramentosComAnexos &&
                !_.isEmpty(
                  monitoramentosComAnexos.filter(
                    ({ metaType }) => metaType === "4.2"
                  )
                ) && (
                  <>
                    {/* Capa Meta 4.1 */}
                    <chakra.div className="page">
                      <Box pt={20}>
                          <Heading
                            size="2xl"
                            color="gray.700"
                            textAlign="center"
                          >
                            Projeto Primeiro Emprego
                          </Heading>
                          <Heading
                            size="xl"
                            color="gray.700"
                            textAlign="center"
                            py={12}
                          >
                            Relatório de Monitoramento - Submeta 4.2
                          </Heading>
                          <Heading
                            size="xl"
                            color="gray.700"
                            textAlign="center"
                          >
                            {`${demandInfo.sigla} - ${demandInfo.nome}`}
                          </Heading>
                      </Box>
                    </chakra.div>

                    <div
                      className="page"
                      id="landscape"
                      // px={14}
                    >
                      <Box py={4} direction="column">
                        <Heading
                          size="sm"
                          color="gray.700"
                          pb={4}
                          textAlign="center"
                        >
                          Serviço de Apoio à Primeira Experiência Profissional
                          do Egresso do Ensino Técnico da Rede Estadual de
                          Educação Profissional no âmbito do Projeto primeiro
                          emprego
                        </Heading>
                        <Heading
                          size="xs"
                          color="gray.700"
                          pb={4}
                          textAlign="center"
                        >
                          Síntese de Visitas de Monitoramento e Avaliações -
                          Quanto às Funções Desenvolvidas:
                          {` ${DateTime.fromISO(dataInicio).toFormat(
                            "dd/MM/yyyy"
                          )} à ${DateTime.fromISO(dataFim).toFormat(
                            "dd/MM/yyyy"
                          )}`}
                        </Heading>
                      </Box>

                      {/* <TableContainer> */}
                      <Table
                        w="full"
                        style={{ tableLayout: "fixed" }}
                        variant="striped"
                        size="sm"
                      >
                        <chakra.thead>
                          <Tr>
                            <Th
                              paddingInline={0}
                              p={1}
                              fontSize="xx-small"
                              w="8%"
                            >
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
                          {monitoramentosComAnexos
                            .filter(({ metaType }) => metaType === "4.2")
                            .map(
                              (
                                {
                                  dataMonitoramento,
                                  beneficiario: {
                                    cpf,
                                    dataInicioAtividade,
                                    matriculaFlem,
                                    nome,
                                    vaga: {
                                      demandante,
                                      unidadeLotacao,
                                      municipio,
                                    },
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
                                    {DateTime.fromISO(
                                      dataMonitoramento
                                    ).toLocaleString(DateTime.DATETIME_MED)}
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
                    </div>

                    <div className="page">
                      <Box h="100vh" pt={40}>
                        <Flex flexDir="column" h="full" justifyContent="center">
                          <Box>
                            <Heading
                              size="2xl"
                              color="gray.700"
                              pb={6}
                              textAlign="center"
                            >
                              Rede de Monitoramento
                            </Heading>
                            <Heading
                              size="xl"
                              color="gray.700"
                              pb={4}
                              textAlign="center"
                            >
                              {`${DateTime.fromISO(dataInicio).toFormat(
                                "dd/MM/yyyy"
                              )} à ${DateTime.fromISO(dataFim).toFormat(
                                "dd/MM/yyyy"
                              )}`}
                            </Heading>
                            {[
                              ...new Set(
                                monitoramentosComAnexos
                                  .filter(({ metaType }) => metaType === "4.2")
                                  .map(
                                    ({
                                      beneficiario: {
                                        vaga: {
                                          municipio: { nome },
                                        },
                                      },
                                    }) => nome
                                  )
                              ),
                            ].map((nome) => (
                              <Heading
                                size="lg"
                                color="gray.700"
                                pb={2}
                                textAlign="center"
                                key={nome + "_municip_4.2"}
                              >
                                {nome}
                              </Heading>
                            ))}
                          </Box>
                        </Flex>
                      </Box>
                    </div>

                    {[
                      ...new Set(
                        monitoramentosComAnexos
                          .filter(({ metaType }) => metaType === "4.2")
                          .map(
                            ({
                              beneficiario: {
                                vaga: {
                                  municipio: { nome },
                                },
                              },
                            }) => nome
                          )
                      ),
                    ].map((nome) => (
                      <Fragment key={nome + "_municip_4.2_capa"}>
                        <div className="page">
                          <Box h="100vh" pt={40}>
                            <Flex
                              flexDir="column"
                              h="full"
                              justifyContent="center"
                            >
                              <Heading
                                size="xl"
                                color="gray.700"
                                pb={2}
                                textAlign="center"
                                key={nome + "_municip_4.2_monitoramentos"}
                              >
                                {nome}
                              </Heading>
                            </Flex>
                          </Box>
                        </div>

                        {monitoramentosComAnexos &&
                          monitoramentosComAnexos
                            .filter(
                              ({
                                beneficiario: {
                                  vaga: {
                                    municipio: { nome: municipNome },
                                  },
                                },
                                metaType,
                              }) => metaType === "4.2" && municipNome === nome
                            )
                            .map(
                              ({
                                monitoramentoComprovacao_Id,
                                file_monitoramentoComprovacao,
                                file_autoAvaliacao,
                                file_ambienteTrabalho,
                                file_benefPontoFocal,
                                ...monitoramento
                              }) => (
                                <Fragment key={`monit_id_${monitoramento.id}`}>
                                  <div className="page">
                                    <Box h="90vh" pt={4} direction="column">
                                      <Heading
                                        size="md"
                                        color="gray.700"
                                        pb={4}
                                        textAlign="center"
                                      >
                                        Projeto Primeiro Emprego - Registro de
                                        Monitoramento
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Nome do beneficiário:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.beneficiario.nome}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario
                                                .formacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Data do monitoramento:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            ).toLocaleString(
                                              DateTime.DATETIME_MED
                                            )}
                                            h
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Município:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .municipio.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Demandante:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {`${monitoramento.beneficiario.vaga.demandante.sigla} - ${monitoramento.beneficiario.vaga.demandante.nome}`}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Unidade de lotação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .unidadeLotacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Meta executada:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.metaType === "4.1"
                                              ? "Submeta 4.1 (4.500 profissionais técnicos trimestralmente acompanhados e monitorados no desenvolvimento das suas funções)"
                                              : "Submeta 4.2 (4.500 profissionais técnicos avaliados semestralmente)"}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Meios de comprovação das metas e
                                            submetas produzidas/entregues:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {!_.isEmpty(
                                              monitoramento.monitoramentoComprovacao_Id
                                            ) && "Lista de Presença"}
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Principais Registros da Visitação ao
                                            local de trabalho:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="justify"
                                          >
                                            {monitoramento.registrosVisitacao}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            O Técnico encontra-se em desvio de
                                            função?
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.desvioFuncao === true
                                              ? `Sim. ${monitoramento.desvioFuncaoDescricao}`
                                              : "Não"}
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                      {monitoramento.metaType === "4.2" &&
                                        (!_.isEmpty(
                                          monitoramento.autoAvaliacao_anexoId
                                        ) ||
                                          !_.isEmpty(
                                            monitoramento.benefPontoFocal_anexoId
                                          ) ||
                                          !_.isEmpty(
                                            monitoramento.ambienteTrabalho_anexoId
                                          )) && (
                                          <SimpleGrid
                                            spacing={4}
                                            columns={1}
                                            bg="gray.100"
                                            px={2}
                                            py={4}
                                            rounded="md"
                                            my={2}
                                          >
                                            <Box>
                                              <Heading
                                                fontSize="xs"
                                                color="gray.500"
                                                pb={1}
                                                textAlign="start"
                                              >
                                                Avaliações Realizadas:
                                              </Heading>
                                              {!_.isEmpty(
                                                monitoramento.autoAvaliacao_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Auto Avaliação
                                                </Heading>
                                              )}
                                              {!_.isEmpty(
                                                monitoramento.benefPontoFocal_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Beneficiário pelo Ponto Focal
                                                </Heading>
                                              )}
                                              {!_.isEmpty(
                                                monitoramento.ambienteTrabalho_anexoId
                                              ) && (
                                                <Heading
                                                  size="xs"
                                                  color="gray.600"
                                                  textAlign="start"
                                                >
                                                  Ambiente de Trabalho
                                                </Heading>
                                              )}
                                            </Box>
                                          </SimpleGrid>
                                        )}
                                    </Box>
                                  </div>

                                  <chakra.div
                                    className="page"
                                    // pt={8}
                                  >
                                    <Box h="90vh">
                                      <Heading
                                        size="md"
                                        color="gray.700"
                                        py={4}
                                        textAlign="center"
                                      >
                                        Projeto Primeiro Emprego - Registro de
                                        Monitoramento
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Nome do beneficiário:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.beneficiario.nome}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario
                                                .formacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Data do monitoramento:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            ).toLocaleString(
                                              DateTime.DATETIME_MED
                                            )}
                                            h
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Município:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .municipio.nome
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Demandante:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {`${monitoramento.beneficiario.vaga.demandante.sigla} - ${monitoramento.beneficiario.vaga.demandante.nome}`}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Unidade de lotação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.beneficiario.vaga
                                                .unidadeLotacao.nome
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>

                                      <Heading
                                        size="sm"
                                        color="gray.700"
                                        textAlign="center"
                                        pt={6}
                                      >
                                        Impressões da Equipe Técnica Primeiro
                                        Emprego
                                      </Heading>
                                      <Heading
                                        size="xs"
                                        color="gray.700"
                                        textAlign="center"
                                      >
                                        Conceito: Boa, Regular ou Ruim
                                      </Heading>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={2}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={2}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Conhecimento
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesConhecimento
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Pontualidade
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesPontualidade
                                            }
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Habilidade
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesHabilidade}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Motivação
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesMotivacao}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Autonomia
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.impressoesAutonomia}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Experiência Profssional compatível
                                            com a formação:
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {
                                              monitoramento.impressoesExperienciaCompFormacao
                                            }
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                      <SimpleGrid
                                        spacing={4}
                                        columns={1}
                                        bg="gray.100"
                                        px={2}
                                        py={4}
                                        rounded="md"
                                        my={4}
                                      >
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Observações
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {monitoramento.observacoesEquipePpe}
                                          </Heading>
                                        </Box>
                                        <Box>
                                          <Heading
                                            fontSize="xs"
                                            color="gray.500"
                                            pb={1}
                                            textAlign="start"
                                          >
                                            Previsão de Visitas e Próximos
                                            Monitoramentos
                                          </Heading>
                                          <Heading
                                            size="xs"
                                            color="gray.600"
                                            textAlign="start"
                                          >
                                            {DateTime.fromISO(
                                              monitoramento.dataMonitoramento
                                            )
                                              .plus({ months: 3 })
                                              .toLocaleString(
                                                DateTime.DATETIME_MED
                                              )}
                                            h
                                          </Heading>
                                        </Box>
                                      </SimpleGrid>
                                    </Box>
                                  </chakra.div>

                                  {!_.isEmpty(
                                    file_monitoramentoComprovacao
                                  ) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_monitoramentoComprovacao.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_monitoramentoComprovacao.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_monitoramentoComprovacao.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_monitoramentoComprovacao
                                                .fileDetails.contentType
                                            };base64,${file_monitoramentoComprovacao.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_autoAvaliacao) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_autoAvaliacao.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_autoAvaliacao.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_autoAvaliacao.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_autoAvaliacao.fileDetails
                                                .contentType
                                            };base64,${file_autoAvaliacao.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_ambienteTrabalho) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_ambienteTrabalho.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_ambienteTrabalho.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_ambienteTrabalho.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_ambienteTrabalho.fileDetails
                                                .contentType
                                            };base64,${file_ambienteTrabalho.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}

                                  {!_.isEmpty(file_benefPontoFocal) && (
                                    <chakra.div
                                      className="page"
                                      // px={14}
                                    >
                                      {file_benefPontoFocal.fileDetails.contentType.includes(
                                        "pdf"
                                      ) && (
                                        <Document
                                          file={`data:application/pdf;base64,${file_benefPontoFocal.data.toString(
                                            "base64"
                                          )}`}
                                        >
                                          <Center
                                            as={Page}
                                            pageNumber={1}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            // height="920"
                                            // margin={0}
                                            pt={36}
                                            // display="flex"
                                            // justifyContent="center"
                                            // alignSelf="center"
                                            // height="100%"
                                            // flex="1 1 0%"
                                            // scale="1.2"
                                            sx={{ zoom: 1.1 }}
                                          />
                                        </Document>
                                      )}
                                      {file_benefPontoFocal.fileDetails.contentType.includes(
                                        "image"
                                      ) && (
                                        <Center pt={28}>
                                          <Image
                                            src={`data:${
                                              file_benefPontoFocal.fileDetails
                                                .contentType
                                            };base64,${file_benefPontoFocal.data.toString(
                                              "base64"
                                            )}`}
                                            h="full"
                                          />
                                        </Center>
                                      )}
                                    </chakra.div>
                                  )}
                                </Fragment>
                              )
                            )}
                      </Fragment>
                    ))}
                  </>
                )}
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
    const { data: demandInfo } = await axios.get(
      `/api/${entity}/demandantes/${demandanteId}`
    );

    const monitoramentosFromBd = data.map(({ beneficiario, ...rest }) => ({
      ...rest,
      beneficiario: {
        ...beneficiario,
        vaga: beneficiario.vaga.shift(),
      },
    }));

    // monitoramentosFromBd?.beneficiario.vaga = data.beneficiario.vaga.shift();

    return {
      props: {
        entity: entityCheck || null,
        monitoramentosFromBd,
        demandInfo,
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
