import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useBoolean,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { Overlay } from "components/Overlay";
import { useCustomForm } from "hooks";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiFilter, FiTrash2 } from "react-icons/fi";
import { axios } from "services/apiService";
import _ from "lodash";
import download from "downloadjs";

import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { DateTime } from "luxon";
import { Table } from "components/Table";
import { InputBox } from "components/Inputs/InputBox";

export default function MonitoramentoPorBeneficiario({ entity, ...props }) {
  const router = useRouter();
  const { asPath } = router;
  const [fetchTableMonitPorBenefData, setFetchTableMonitPorBenefData] =
    useBoolean(true);
  const [filtroMonitPorBenefAtivo, setFiltroMonitPorBenefAtivo] =
    useBoolean(false);
  const [filtroMonitPorDemandAtivo, setFiltroMonitPorDemandAtivo] =
    useBoolean(false);
  const [tableRowsCount, setTableRowsCount] = useState(null);
  const [tableRowsMonitPorDemandCount, setTableRowsMonitPorDemandCount] =
    useState(null);
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const [unidadesLotacaoFromBd, setUnidadesLotacaoFromBd] = useState([]);
  const [monitoramentosFromBd, setMonitoramentosFromBd] = useState([]);
  const [periodoRelatorioMonitoramento, setPeriodoRelatorioMonitoramento] =
    useState({
      dataInicio: DateTime.now().set({ day: 1 }).toISO(),
      dataFim: DateTime.now().set({ day: 31 }).toISO(),
    });
  const [tableMonitPorBenefData, setTableMonitPorBenefData] = useState([]);
  const [tableMonitPorDemandRawData, setTableMonitPorDemandRawData] = useState(
    []
  );
  const [tableMonitPorDemandData, setTableMonitPorDemandData] = useState([]);

  const tableMonitBenefColumns = useMemo(
    () => [
      {
        Header: "beneficiário",
        accessor: "beneficiario.nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "cpf",
        accessor: "beneficiario.cpf",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "matricula",
        accessor: "beneficiario.matriculaFlem",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "data de admissão",
        accessor: "beneficiario.dataInicioAtividade",
        Cell: ({ value }) => (
          <Text noOfLines={2}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        ),
        Footer: false,
      },
      {
        Header: "data do monitoramento",
        accessor: "dataMonitoramento",
        Cell: ({ value }) => (
          <Text noOfLines={2}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}
          </Text>
        ),
        Footer: false,
      },
      {
        Header: "unidade de lotação",
        accessor: "beneficiario.vaga.unidadeLotacao.nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: ({
          row: {
            original: {
              id,
              metaType4_1,
              metaType4_2,
              ambienteTrabalho_anexoId,
              autoAvaliacao_anexoId,
              benefPontoFocal_anexoId,
              monitoramentoComprovacao,
              ...rest
            },
          },
        }) => (
          <Tooltip label="Baixar Relatório">
            <IconButton
              variant="outline"
              colorScheme="brand1"
              icon={<FiDownload />}
              onClick={() => {
                downloadRelatorio({
                  reportUrl: `/relatorios-monitoramentos/por-beneficiario/${id}`,
                  landscape: false,
                  anexosId: {
                    ambienteTrabalho_anexoId,
                    autoAvaliacao_anexoId,
                    benefPontoFocal_anexoId,
                    monitoramentoComprovacao_anexoId:
                      monitoramentoComprovacao?.anexoId,
                  },
                });
              }}
            />
          </Tooltip>
        ),
        Footer: false,
      },
    ],
    []
  );

  const tableMonitBenefData = useMemo(
    () => tableMonitPorBenefData,
    [tableMonitPorBenefData]
  );

  const tableMonitDemandColumns = useMemo(
    () => [
      {
        Header: "Demandante",
        accessor: ({ sigla, nome }) => `${sigla} - ${nome}`,
        Cell: ({ value }) => (
          <Text maxW={400} noOfLines={2}>
            {value}
          </Text>
        ),
        Footer: false,
      },
      {
        Header: "qtd meta 4.1",
        Cell: ({
          row: {
            original: { metaType4_1 },
          },
        }) => <Box minW={110}>{metaType4_1.length}</Box>,

        Footer: false,
      },
      {
        Header: "qtd meta 4.2",
        Cell: ({
          row: {
            original: { metaType4_2 },
          },
        }) => <Box minW={110}>{metaType4_2.length}</Box>,

        Footer: false,
      },

      {
        Header: "Ações",
        Cell: ({
          row: {
            original: { id, metaType4_1, metaType4_2 },
          },
        }) => (
          <HStack>
            <Tooltip label="Baixar Relatório de Síntese">
              <IconButton
                variant="outline"
                colorScheme="brand1"
                icon={<FiDownload />}
                onClick={() =>
                  downloadRelatorio({
                    reportUrl: `/relatorios-monitoramentos/por-demandante/sintese/${id}`,
                    ...periodoRelatorioMonitoramento,
                    landscape: true,
                  })
                }
                isDisabled={!metaType4_1.length && !metaType4_2.length}
              />
            </Tooltip>
            <Tooltip label="Baixar Relatório Geral Por Demandante">
              <IconButton
                variant="outline"
                colorScheme="brand1"
                icon={<FiDownload />}
                onClick={() =>
                  downloadRelatorio({
                    reportUrl: `/relatorios-monitoramentos/por-demandante/geral/${id}`,
                    ...periodoRelatorioMonitoramento,
                    landscape: "custom",
                  })
                }
                isDisabled={!metaType4_1.length && !metaType4_2.length}
              />
            </Tooltip>
          </HStack>
        ),
        Footer: false,
      },
    ],
    [tableMonitPorDemandRawData, tableMonitPorDemandData]
  );

  const tableMonitDemandData = useMemo(
    () => tableMonitPorDemandData,
    [tableMonitPorDemandData]
  );

  const filtroAvancadoMonitPorBenefForm = useCustomForm();

  const filtroAvancadoMonitPorDemandForm = useCustomForm();

  const { _fields } = filtroAvancadoMonitPorBenefForm.control.control;

  const escritoriosRegionais = filtroAvancadoMonitPorBenefForm.control.watch(
    "escritoriosRegionais"
  );

  const municipios =
    filtroAvancadoMonitPorBenefForm.control.watch("municipios");

  const demandantes =
    filtroAvancadoMonitPorBenefForm.control.watch("demandantes");

  const filtroAvancadoMonitPorBenefFormSubmit = async (formData, e) => {
    e.preventDefault();
    const {
      dataInicio,
      dataFim,
      escritoriosRegionais,
      municipios,
      demandantes,
      situacaoBenef,
      unidadesLotacao,
    } = formData;

    setPeriodoRelatorioMonitoramento({
      dataInicio,
      dataFim,
    });

    const filteredRows = monitoramentosFromBd
      .filter(({ dataMonitoramento }) =>
        _.isEmpty(dataInicio)
          ? true
          : DateTime.fromISO(dataMonitoramento) >= DateTime.fromISO(dataInicio)
      )
      .filter(({ dataMonitoramento }) =>
        _.isEmpty(dataFim)
          ? true
          : DateTime.fromISO(dataMonitoramento) <= DateTime.fromISO(dataFim)
      )
      .filter(
        ({
          beneficiario: {
            vaga: {
              municipio: { escritorio_RegionalId },
            },
          },
        }) =>
          _.isEmpty(escritoriosRegionais)
            ? true
            : escritoriosRegionais
                .map(({ value }) => value)
                .includes(escritorio_RegionalId)
      )
      .filter(
        ({
          beneficiario: {
            vaga: { municipio_Id },
          },
        }) =>
          _.isEmpty(municipios)
            ? true
            : municipios.map(({ value }) => value).includes(municipio_Id)
      )
      .filter(
        ({
          beneficiario: {
            vaga: { demandante_Id },
          },
        }) =>
          _.isEmpty(demandantes)
            ? true
            : demandantes.map(({ value }) => value).includes(demandante_Id)
      )
      .filter(
        ({
          beneficiario: {
            vaga: { unidadeLotacao_Id },
          },
        }) =>
          _.isEmpty(unidadesLotacao)
            ? true
            : unidadesLotacao
                .map(({ value }) => value)
                .includes(unidadeLotacao_Id)
      );

    setTableMonitPorBenefData(filteredRows);
    if (
      _.isEmpty(dataInicio) &&
      _.isEmpty(dataFim) &&
      _.isEmpty(escritoriosRegionais) &&
      _.isEmpty(municipios) &&
      _.isEmpty(demandantes) &&
      _.isEmpty(situacaoBenef)
    ) {
      setFiltroMonitPorBenefAtivo.off();
    } else {
      setFiltroMonitPorBenefAtivo.on();
    }
    return filtroAvancadoMonitPorBenefForm.closeOverlay();
  };

  const filtroAvancadoMonitPorDemandFormSubmit = async (formData, e) => {
    e.preventDefault();
    const { dataInicio, dataFim } = formData;

    const filteredRows = tableMonitPorDemandRawData.map(
      ({ metaType4_1, metaType4_2, ...row }) => ({
        ...row,
        metaType4_1: metaType4_1.filter(
          ({ dataMonitoramento }) =>
            DateTime.fromISO(dataMonitoramento) >=
              DateTime.fromISO(dataInicio) &&
            DateTime.fromISO(dataMonitoramento) <= DateTime.fromISO(dataFim)
        ),
        metaType4_2: metaType4_2.filter(
          ({ dataMonitoramento }) =>
            DateTime.fromISO(dataMonitoramento) >=
              DateTime.fromISO(dataInicio) &&
            DateTime.fromISO(dataMonitoramento) <= DateTime.fromISO(dataFim)
        ),
      })
    );

    setPeriodoRelatorioMonitoramento({
      dataInicio,
      dataFim,
    });

    setTableMonitPorDemandData(filteredRows);
    setTableRowsMonitPorDemandCount(
      filteredRows
        .map(({ metaType4_1 }) => metaType4_1.length)
        .reduce((acc, v) => acc + v) +
        filteredRows
          .map(({ metaType4_2 }) => metaType4_2.length)
          .reduce((acc, v) => acc + v)
    );
    if (_.isEmpty(dataInicio) && _.isEmpty(dataFim)) {
      setFiltroMonitPorDemandAtivo.off();
    } else {
      setFiltroMonitPorDemandAtivo.on();
    }
    return filtroAvancadoMonitPorDemandForm.closeOverlay();
  };

  const limparFiltroMonitPorBenef = () => {
    setTableMonitPorBenefData(monitoramentosFromBd);
    setPeriodoRelatorioMonitoramento({
      dataInicio: DateTime.now().set({ day: 1 }).toISO(),
      dataFim: DateTime.now().set({ day: 31 }).toISO(),
    });
    return setFiltroMonitPorBenefAtivo.off();
  };

  const limparFiltroMonitPorDemand = () => {
    setTableMonitPorDemandData(tableMonitPorDemandRawData);
    setTableRowsMonitPorDemandCount(monitoramentosFromBd.length);
    setPeriodoRelatorioMonitoramento({
      dataInicio: DateTime.now().set({ day: 1 }).toISO(),
      dataFim: DateTime.now().set({ day: 31 }).toISO(),
    });

    return setFiltroMonitPorDemandAtivo.off();
  };

  const downloadRelatorio = ({ reportUrl, ...params }) => {
    // downloadingFile.onOpen();
    axios
      .get(`/api/${entity}/reports`, {
        params: {
          reportUrl,
          ...params,
        },
        responseType: "blob",
      })
      .then((res) => {
        if (res.status === 200) {
          const content = res.headers["content-type"];
          const filename =
            res.headers["content-disposition"].split("filename=")[1];

          // toast({
          //   title: "Lista gerada com sucesso",
          //   status: "success",
          //   duration: 5000,
          //   isClosable: false,
          // });

          download(res.data, `${filename}.pdf`, content);

          // downloadingFile.onClose();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
    setFetchTableMonitPorBenefData.off();
  }, [asPath]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/escritorios-regionais`)
      .then((res) => {
        if (res.status === 200) {
          setEscritoriosFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    _fields.municipios?._f.ref.clearValue();
    _fields.demandantes?._f.ref.clearValue();
    _fields.unidadesLotacao?._f.ref.clearValue();
    _fields.monitores?._f.ref.clearValue();
  }, [escritoriosRegionais]);

  useEffect(() => {
    axios
      .get(
        `/api/${entity}/municipios`,
        _.isEmpty(escritoriosRegionais)
          ? {}
          : {
              params: {
                escritorioRegional_Id: JSON.stringify(
                  escritoriosRegionais?.map(({ value }) => value)
                ),
              },
            }
      )
      .then((res) => {
        if (res.status === 200) {
          setMunicipiosFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    _fields.demandantes?._f.ref.clearValue();
    _fields.unidadesLotacao?._f.ref.clearValue();
  }, [escritoriosRegionais, municipios]);

  useEffect(() => {
    axios
      .get(`/api/${entity}/demandantes`, {
        params: {
          municipio_Id: _.isEmpty(municipios)
            ? null
            : JSON.stringify(municipios?.map(({ value }) => value)),
          escritorioRegional_Id: _.isEmpty(escritoriosRegionais)
            ? null
            : JSON.stringify(escritoriosRegionais?.map(({ value }) => value)),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setDemandantesFromBd(
            res.data.map(({ id, nome, sigla }) => ({
              value: id,
              label: `${sigla} - ${nome}`,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
    _fields.demandantes?._f.ref.clearValue();
  }, [municipios]);

  useEffect(() => {
    axios
      .get(
        `/api/${entity}/unidades-lotacao`,
        _.isEmpty(escritoriosRegionais) &&
          _.isEmpty(municipios) &&
          _.isEmpty(demandantes)
          ? {}
          : {
              params: {
                escritorioRegional_Id: _.isEmpty(escritoriosRegionais)
                  ? null
                  : JSON.stringify(
                      escritoriosRegionais?.map(({ value }) => value)
                    ),
                municipio_Id: _.isEmpty(municipios)
                  ? null
                  : JSON.stringify(municipios?.map(({ value }) => value)),
                demandante_Id: _.isEmpty(demandantes)
                  ? null
                  : JSON.stringify(demandantes?.map(({ value }) => value)),
              },
            }
      )
      .then((res) => {
        if (res.status === 200) {
          setUnidadesLotacaoFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
  }, [demandantes, escritoriosRegionais, municipios]);

  useEffect(() => {
    setFetchTableMonitPorBenefData.on();
    axios
      .get(`/api/${entity}/monitoramento/realizados`, {
        params: {
          ...periodoRelatorioMonitoramento,
        },
      })
      .then(({ data }) => {
        // bdRhService.get(`/funcionarios`);
        const monitoramentosPorBenef = data.map((data) => ({
          ...data,
          beneficiario: {
            ...data.beneficiario,
            vaga: data.beneficiario.vaga.shift(),
          },
        }));
        setMonitoramentosFromBd(monitoramentosPorBenef);
        setTableMonitPorBenefData(monitoramentosPorBenef);
        setTableRowsMonitPorDemandCount(monitoramentosPorBenef.length);

        axios.get(`/api/${entity}/demandantes`).then((res) => {
          if (res.status === 200) {
            const rows = res.data.map((demand) => ({
              ...demand,
              metaType4_1: monitoramentosPorBenef.filter(
                ({
                  metaType,
                  beneficiario: {
                    vaga: { demandante_Id },
                  },
                }) => demandante_Id === demand.id && metaType === "4.1"
              ),
              metaType4_2: monitoramentosPorBenef.filter(
                ({
                  metaType,
                  beneficiario: {
                    vaga: { demandante_Id },
                  },
                }) => demandante_Id === demand.id && metaType === "4.2"
              ),
            }));
            setTableMonitPorDemandRawData(rows);
            setTableMonitPorDemandData(rows);
          }
        });
      })
      .finally(setFetchTableMonitPorBenefData.off);
  }, [periodoRelatorioMonitoramento]);

  return (
    <>
      <AnimatePresenceWrapper
        router={router}
        isLoaded={!fetchTableMonitPorBenefData}
      >
        <Stack spacing={6}>
          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pb={5}
              minH="60px"
              flexWrap="wrap"
            >
              <Box order={0}>
                <Heading fontSize={{ md: "1.4rem" }}>
                  Monitoramentos por beneficiário
                </Heading>
                <Heading size="xs" color="gray.500" mt={{ md: 1 }}>
                  {tableRowsCount && tableRowsCount === 0
                    ? `Nenhum registro encontrado`
                    : tableRowsCount === 1
                    ? `${tableRowsCount} registro encontrado`
                    : `${tableRowsCount} registros encontrados`}
                </Heading>
              </Box>
              <ButtonGroup
                isAttached={filtroMonitPorBenefAtivo}
                size={{ base: "sm", sm: "md" }}
                order={2}
              >
                <Button
                  colorScheme="brand1"
                  shadow="md"
                  leftIcon={
                    <FiFilter
                      fill={filtroMonitPorBenefAtivo ? "currentColor" : "none"}
                    />
                  }
                  onClick={filtroAvancadoMonitPorBenefForm.openOverlay}
                  variant={filtroMonitPorBenefAtivo ? "solid" : "outline"}
                >
                  Filtro Avançado {filtroMonitPorBenefAtivo && "Ativo"}
                </Button>
                <Tooltip
                  label="Limpar Filtro"
                  hidden={!filtroMonitPorBenefAtivo}
                >
                  <IconButton
                    variant="solid"
                    colorScheme="red"
                    hidden={!filtroMonitPorBenefAtivo}
                    icon={<FiTrash2 />}
                    onClick={limparFiltroMonitPorBenef}
                  />
                </Tooltip>
              </ButtonGroup>
            </Flex>
            <Table
              data={tableMonitBenefData}
              columns={tableMonitBenefColumns}
              setRowsCount={setTableRowsCount}
              // setSelectedRows={setSelectedTableRows}
            />
          </Box>

          <Box>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pb={5}
              minH="60px"
              flexWrap="wrap"
            >
              <Box order={0}>
                <Heading fontSize={{ md: "1.4rem" }}>
                  Monitoramentos por demandante
                </Heading>
                <Heading size="xs" color="gray.500" mt={{ md: 1 }}>
                  {tableRowsMonitPorDemandCount &&
                  tableRowsMonitPorDemandCount === 0
                    ? `Nenhum registro encontrado`
                    : tableRowsMonitPorDemandCount === 1
                    ? `${tableRowsMonitPorDemandCount} registro encontrado`
                    : `${tableRowsMonitPorDemandCount} registros encontrados`}
                </Heading>
              </Box>
              <ButtonGroup
                isAttached={filtroMonitPorDemandAtivo}
                size={{ base: "sm", sm: "md" }}
                order={2}
              >
                <Button
                  colorScheme="brand1"
                  shadow="md"
                  leftIcon={
                    <FiFilter
                      fill={filtroMonitPorDemandAtivo ? "currentColor" : "none"}
                    />
                  }
                  onClick={filtroAvancadoMonitPorDemandForm.openOverlay}
                  variant={filtroMonitPorDemandAtivo ? "solid" : "outline"}
                >
                  Filtro de Período {filtroMonitPorDemandAtivo && "Ativo"}
                </Button>
                <Tooltip
                  label="Limpar Filtro"
                  hidden={!filtroMonitPorDemandAtivo}
                >
                  <IconButton
                    variant="solid"
                    colorScheme="red"
                    hidden={!filtroMonitPorDemandAtivo}
                    icon={<FiTrash2 />}
                    onClick={limparFiltroMonitPorDemand}
                  />
                </Tooltip>
              </ButtonGroup>
            </Flex>
            <Table
              data={tableMonitDemandData}
              columns={tableMonitDemandColumns}
              // setRowsCount={setTableRowsMonitPorDemandCount}
              // setSelectedRows={setSelectedTableRows}
            />
          </Box>
        </Stack>
      </AnimatePresenceWrapper>

      {/* Filtro Avançado Monitoramentos por Beneficiário Overlay */}
      <Overlay
        closeOnOverlayClick={true}
        isOpen={filtroAvancadoMonitPorBenefForm.overlayIsOpen}
        onClose={filtroAvancadoMonitPorBenefForm.closeOverlay}
        header="Filtro Avançado"
        closeButton
      >
        <Heading size="md" mb={4}>
          Selecionar filtros:
        </Heading>
        <Stack
          as={chakra.form}
          onSubmit={filtroAvancadoMonitPorBenefForm.handleSubmit(
            filtroAvancadoMonitPorBenefFormSubmit
          )}
        >
          <InputBox
            id="dataInicio"
            label="Data Início"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            type="date"
            required={false}
            defaultValue={DateTime.fromISO(
              periodoRelatorioMonitoramento.dataInicio
            ).toFormat("yyyy-MM-dd")}
          />
          <InputBox
            id="dataFim"
            label="Data Fim"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            type="date"
            required={false}
            defaultValue={DateTime.fromISO(
              periodoRelatorioMonitoramento.dataFim
            ).toFormat("yyyy-MM-dd")}
          />
          <SelectInputBox
            id="escritoriosRegionais"
            label="Escritórios Regionais"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            options={escritoriosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="municipios"
            label="Municípios"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            options={municipiosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="demandantes"
            label="Demandantes"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            options={demandantesFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="unidadesLotacao"
            label="Unidades de Lotação"
            formControl={filtroAvancadoMonitPorBenefForm.control}
            options={unidadesLotacaoFromBd}
            isMulti
            required={false}
          />
          <HStack justifyContent="flex-end" pt={4}>
            <Button type="submit" colorScheme="brand1">
              Filtrar
            </Button>
          </HStack>
        </Stack>
      </Overlay>

      {/* Filtro de Período Monitoramentos por Demandante Overlay */}
      <Overlay
        closeOnOverlayClick={true}
        isOpen={filtroAvancadoMonitPorDemandForm.overlayIsOpen}
        onClose={filtroAvancadoMonitPorDemandForm.closeOverlay}
        header="Filtro de Período"
        closeButton
      >
        <Heading size="md" mb={4}>
          Selecionar período:
        </Heading>
        <Stack
          as={chakra.form}
          onSubmit={filtroAvancadoMonitPorDemandForm.handleSubmit(
            filtroAvancadoMonitPorDemandFormSubmit
          )}
        >
          <InputBox
            id="dataInicio"
            label="Data Início"
            formControl={filtroAvancadoMonitPorDemandForm.control}
            type="date"
            required={true}
            defaultValue={DateTime.fromISO(
              periodoRelatorioMonitoramento.dataInicio
            ).toFormat("yyyy-MM-dd")}
          />
          <InputBox
            id="dataFim"
            label="Data Fim"
            formControl={filtroAvancadoMonitPorDemandForm.control}
            type="date"
            required={true}
            defaultValue={DateTime.fromISO(
              periodoRelatorioMonitoramento.dataFim
            ).toFormat("yyyy-MM-dd")}
          />

          <HStack justifyContent="flex-end" pt={4}>
            <Button
              type="submit"
              colorScheme="brand1"
              disabled={!filtroAvancadoMonitPorDemandForm.validation}
            >
              Filtrar
            </Button>
          </HStack>
        </Stack>
      </Overlay>
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
  // const { data: timeFromNetwork } = await axios.get(
  //   `/api/${entity}/network-time`
  // );

  return {
    props: {
      entity: entityCheck || null,
      // timeFromNetwork,
    },
  };
}

MonitoramentoPorBeneficiario.auth = true;
MonitoramentoPorBeneficiario.dashboard = true;
