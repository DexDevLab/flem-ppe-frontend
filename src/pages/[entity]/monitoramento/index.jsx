import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useBoolean,
  HStack,
  Icon,
  Divider,
  Tag,
  TagLabel,
  useBreakpointValue,
  useToast,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Collapse,
  FormLabel,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useCustomForm } from "hooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiEdit,
  FiFilter,
  FiMapPin,
  FiMoreHorizontal,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";
import _ from "lodash";
import {
  axios,
  bdRhService,
  filesAPIService,
  filesAPIUpload,
} from "services/apiService";
import { calcularPeriodoMonitoramentoRealizado } from "utils/monitoramento";
import { DateTime, Interval } from "luxon";
import { FormMaker } from "components/Form";
import { IndeterminateCheckbox } from "components/Table/components/IndeterminateCheckbox";
import download from "downloadjs";

export default function Monitoramento({ entity, timeFromNetwork, ...props }) {
  const router = useRouter();
  const { asPath } = router;
  const [fetchTableData, setFetchTableData] = useBoolean(true);
  const [tableData, setTableData] = useState([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null);
  const [anoPeriodoSelecionado, setAnoPeriodoSelecionado] = useState(null);
  const [benefFromBd, setBenefFromBd] = useState([]);
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const [situacoesFromBd, setSituacoesFromBd] = useState([]);
  const [formacoesFromBd, setMonitoresFromBd] = useState([]);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [monitoramentoSelecionado, setMonitoramentoSelecionado] = useState({});
  const [tableRowsCount, setTableRowsCount] = useState(null);
  const [uploadProgressAutoAvaliacao, setUploadProgressAutoAvaliacao] =
    useState();
  const [uploadProgressBenefPontoFocal, setUploadProgressBenefPontoFocal] =
    useState();
  const [uploadProgressAmbienteTrabalho, setUploadProgressAmbienteTrabalho] =
    useState();
  const [
    uploadProgressComprovacaoMonitoramento,
    setUploadProgressComprovacaoMonitoramento,
  ] = useState();
  const [uploadController, setUploadController] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useBoolean();
  const [
    buttonStateMonitoramentoComprovacao,
    setButtonStateMonitoramentoComprovacao,
  ] = useBoolean();
  const [buttonStateAutoAvaliacao, setButtonStateAutoAvaliacao] = useBoolean();
  const [buttonStateBenefPontoFocal, setButtonStateBenefPontoFocal] =
    useBoolean();
  const [buttonStateAmbienteTrabalho, setButtonStateAmbienteTrabalho] =
    useBoolean();
  const filtroAvancadoForm = useCustomForm();
  const selecionarPeriodoForm = useCustomForm();
  const monitorarBeneficiarioForm = useCustomForm();
  const anexarComprovacaoMonitoramentoForm = useCustomForm();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const toast = useToast({ duration: 5000, isClosable: false, position });

  const monitorarBeneficiarioFormInputsSection1 = [
    {
      id: "dataMonitoramento",
      label: "Data do monitoramento",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "datetime-local",
      required: "Obrigatório",
      defaultValue: !_.isEmpty(monitoramentoSelecionado)
        ? DateTime.fromISO(monitoramentoSelecionado.dataMonitoramento).toISO({
            includeOffset: false,
            suppressSeconds: true,
          })
        : "",
      validate: (v) => {
        DateTime.fromISO(v);
        if (
          DateTime.fromISO(timeFromNetwork) >=
            periodoSelecionado.trimestre.startDate &&
          DateTime.fromISO(timeFromNetwork) <=
            periodoSelecionado.trimestre.endDate
        ) {
          return (
            (DateTime.fromISO(v) >= periodoSelecionado.trimestre.startDate &&
              DateTime.fromISO(v) <= DateTime.fromISO(timeFromNetwork)) ||
            `Selecione uma data entre ${periodoSelecionado.trimestre.startDate.toFormat(
              "dd/MM/yyyy"
            )} e ${DateTime.fromISO(timeFromNetwork).toFormat("dd/MM/yyyy")}`
          );
        } else {
          return (
            (DateTime.fromISO(v) >= periodoSelecionado.trimestre.startDate &&
              DateTime.fromISO(v) <= periodoSelecionado.trimestre.endDate) ||
            `Selecione uma data entre ${periodoSelecionado.trimestre.startDate.toFormat(
              "dd/MM/yyyy"
            )} e ${periodoSelecionado.trimestre.endDate.toFormat("dd/MM/yyyy")}`
          );
        }
      },
    },
    {
      id: "presencaTecnico",
      label: `${
        !_.isEmpty(selectedRow) && selectedRow.sexo === "Feminino"
          ? "Beneficiária"
          : "Beneficiário"
      }  presente na unidade?`,
      formControl: monitorarBeneficiarioForm.control,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      defaultValue: true,
    },
    {
      id: "tipoMonitoramento",
      label: "Tipo de monitoramento",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Presencial",
          label: "Presencial",
        },
        {
          value: "Remoto",
          label: "Remoto",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "registrosVisitacao",
      label: "Principais registros do monitoramento",
      formControl: monitorarBeneficiarioForm.control,
      type: "textarea",
      rows: 10,
      required: "Obrigatório",
    },
    {
      id: "desvioFuncao",
      label: `${
        !_.isEmpty(selectedRow) && selectedRow.sexo === "Feminino"
          ? "Beneficiária"
          : "Beneficiário"
      } encontra-se em desvio de função?`,
      formControl: monitorarBeneficiarioForm.control,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      onChange: (e) => {
        if (e.target.checked === false) {
          monitorarBeneficiarioForm.control.unregister("desvioFuncaoTipo");
          monitorarBeneficiarioForm.control.unregister("desvioFuncaoDescricao");
        }
      },
    },
    {
      id: "desvioFuncaoTipo",
      label: "Tipo de desvio de função",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Total",
          label: "Total",
        },
        {
          value: "Parcial",
          label: "Parcial",
        },
      ],
      showIn: monitorarBeneficiarioForm.control.watch("desvioFuncao") === true,
      required: "Obrigatório",
    },
    {
      id: "desvioFuncaoDescricao",
      label: "Descreva o desvio de função",
      formControl: monitorarBeneficiarioForm.control,
      type: "textarea",
      showIn: monitorarBeneficiarioForm.control.watch("desvioFuncao") === true,
      required: "Obrigatório",
    },
    {
      id: "gravidez",
      label: "Beneficiária está grávida?",
      formControl: monitorarBeneficiarioForm.control,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      showIn: !_.isEmpty(selectedRow) && selectedRow.sexo === "Feminino",
    },
    {
      id: "acidenteTrabalho",
      label: `${
        !_.isEmpty(selectedRow) && selectedRow.sexo === "Feminino"
          ? "Beneficiária"
          : "Beneficiário"
      } sofreu algum acidente de trabalho?`,
      formControl: monitorarBeneficiarioForm.control,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      onChange: (e) =>
        e.target.checked === false
          ? monitorarBeneficiarioForm.control.unregister(
              "acidenteTrabalhoDescricao"
            )
          : null,
    },
    {
      id: "acidenteTrabalhoDescricao",
      label: "Descreva o acidente de trabalho",
      formControl: monitorarBeneficiarioForm.control,
      type: "textarea",
      showIn:
        monitorarBeneficiarioForm.control.watch("acidenteTrabalho") === true,
      required: "Obrigatório",
    },
    {
      id: "autoAvaliacao",
      label: "Auto Avaliação",
      formControl: monitorarBeneficiarioForm.control,
      type: "file",
      uploadProgress: uploadProgressAutoAvaliacao,
      setUploadProgress: setUploadProgressAutoAvaliacao,
      uploadController,
      disabled:
        !_.isEmpty(selectedRow) &&
        selectedRow.statusMonitoramento.metaType === "4.1",
      disabledText: "Necessário somente nas avaliações semestrais",
    },
    {
      id: "benefPontoFocal",
      label: "Beneficiário pelo Ponto Focal",
      formControl: monitorarBeneficiarioForm.control,
      type: "file",
      uploadProgress: uploadProgressBenefPontoFocal,
      setUploadProgress: setUploadProgressBenefPontoFocal,
      uploadController,
      disabled:
        !_.isEmpty(selectedRow) &&
        selectedRow.statusMonitoramento.metaType === "4.1",
      disabledText: "Necessário somente nas avaliações semestrais",
    },
    {
      id: "ambienteTrabalho",
      label: "Ambiente de Trabalho",
      formControl: monitorarBeneficiarioForm.control,
      type: "file",
      uploadProgress: uploadProgressAmbienteTrabalho,
      setUploadProgress: setUploadProgressAmbienteTrabalho,
      uploadController,
      disabled:
        !_.isEmpty(selectedRow) &&
        selectedRow.statusMonitoramento.metaType === "4.1",
      disabledText: "Necessário somente nas avaliações semestrais",
    },
  ];

  const monitorarBeneficiarioFormInputsSection2 = [
    {
      id: "impressoesConhecimento",
      label: "Conhecimento",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "impressoesHabilidade",
      label: "Habilidade",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "impressoesAutonomia",
      label: "Autonomia",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "impressoesPontualidade",
      label: "Pontualidade",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "impressoesMotivacao",
      label: "Motivação",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "impressoesExperienciaCompFormacao",
      label: "Experiência Profissional Compatível com a Formação",
      placeholder: "Selecione...",
      formControl: monitorarBeneficiarioForm.control,
      type: "select",
      options: [
        {
          value: "Boa",
          label: "Boa",
        },
        {
          value: "Regular",
          label: "Regular",
        },
        {
          value: "Ruim",
          label: "Ruim",
        },
      ],
      required: "Obrigatório",
    },
    {
      id: "observacoesEquipePpe",
      label: "Observações",
      formControl: monitorarBeneficiarioForm.control,
      type: "textarea",
      rows: 10,
    },
  ];

  const monitorarBeneficiarioFormInputsSectionHidden = [
    {
      id: "metaType",
      formControl: monitorarBeneficiarioForm.control,
      defaultValue:
        !_.isEmpty(selectedRow) && selectedRow.statusMonitoramento.metaType,
      type: "hidden",
    },
    {
      id: "beneficiario_Id",
      formControl: monitorarBeneficiarioForm.control,
      defaultValue: !_.isEmpty(selectedRow) && selectedRow.id,
      type: "hidden",
    },
  ];

  const anexarComprovacaoMonitoramentoFormInputs = [
    {
      id: "comprovacaoAnexo",
      formControl: anexarComprovacaoMonitoramentoForm.control,
      type: "file",
      uploadProgress: uploadProgressComprovacaoMonitoramento,
      setUploadProgress: setUploadProgressComprovacaoMonitoramento,
      uploadController,
      validate: (v) => (_.isArray(v) && v.length) || "Obrigatório",
      // disabled:
      //   !_.isEmpty(selectedRow) &&
      //   selectedRow.statusMonitoramento.metaType === "4.1",
      // disabledText: "Necessário somente nas avaliações semestrais",
      w: "full",
    },
  ];

  const anoPeriodoMonitoramentoOptions = useMemo(() => {
    const anoAtual = DateTime.fromISO(timeFromNetwork).year;
    const diferencaAnoInicioAnoAtual = Interval.fromDateTimes(
      DateTime.fromFormat("2022", "yyyy"),
      DateTime.fromISO(timeFromNetwork)
    )
      .toDuration("years")
      .toObject().years;
    const count = Math.trunc(diferencaAnoInicioAnoAtual);

    const options = [];
    for (let index = 0; index <= count; index++) {
      const option = {
        value: (anoAtual - index).toString(),
        label: (anoAtual - index).toString(),
      };
      options.push(option);
    }

    if (DateTime.fromISO(timeFromNetwork).month === 12) {
      const option = {
        value: (anoAtual + 1).toString(),
        label: (anoAtual + 1).toString(),
      };
      options.unshift(option);
    }

    setAnoPeriodoSelecionado(options[0]);

    return options;
  }, []);

  const periodoMonitoramento = useMemo(
    () =>
      anoPeriodoSelecionado &&
      calcularPeriodoMonitoramentoRealizado(
        timeFromNetwork,
        parseInt(anoPeriodoSelecionado?.value)
      ).filter(
        ({ startDate }) => DateTime.fromISO(timeFromNetwork) >= startDate
      ),
    [anoPeriodoSelecionado, selecionarPeriodoForm.control.watch("anoPeriodo")]
  );

  const periodoMonitoramentoOptions = useMemo(
    () =>
      !_.isEmpty(periodoMonitoramento) &&
      periodoMonitoramento
        .filter(({ metaType }) => metaType === "4.1")
        .map((periodo) => ({
          ...periodo,
          value: periodo.id,
          label: `${periodo.id}º Trimestre - ${periodo.label}`,
        })),
    [periodoSelecionado]
  );

  const columns = useMemo(
    () => [
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ toggleRowSelected, isAllPageRowsSelected, rows }) => {
          const modifiedOnChange = (event) => {
            rows.forEach((row) => {
              //check each row if it is not disabled
              row.original.statusMonitoramento.anexarComprovacao &&
                toggleRowSelected(row.id, event.target.checked);
            });
          };
          let selectableRowsInCurrentPage = 0;
          let selectedRowsInCurrentPage = 0;
          rows.forEach((row) => {
            row.isSelected && selectedRowsInCurrentPage++;
            row.original.statusMonitoramento.anexarComprovacao &&
              selectableRowsInCurrentPage++;
          });
          const disabled = selectableRowsInCurrentPage === 0;
          const checked =
            (isAllPageRowsSelected ||
              selectableRowsInCurrentPage === selectedRowsInCurrentPage) &&
            !disabled;

          return (
            <IndeterminateCheckbox
              onChange={modifiedOnChange}
              checked={checked}
              isDisabled={disabled}
              indeterminate={
                selectedRowsInCurrentPage >= 1 &&
                selectableRowsInCurrentPage !== selectedRowsInCurrentPage
              }
            />
          );
        },
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <Tooltip
            placement="right"
            label={
              row.original.statusMonitoramento.anexarComprovacao
                ? "Selecionar para anexar comprovação"
                : "Não é possível selecionar sem haver monitoramentos"
            }
          >
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                isDisabled={!row.original.statusMonitoramento.anexarComprovacao}
              />
            </div>
          </Tooltip>
        ),
        Footer: false,
      },
      {
        Header: "cpf",
        accessor: "cpf",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "beneficiário",
        accessor: "nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "unidade de lotação",
        accessor: "vaga.unidadeLotacao.nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      // {
      //   Header: "data de admissão",
      //   Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
      //   Footer: false,
      // },
      {
        Header: "início do contrato",
        accessor: ({ dataInicioAtividade }) => dataInicioAtividade,
        Cell: ({ value }) => (
          <Text noOfLines={2}>
            {DateTime.fromISO(value)
              .setLocale("pt-BR")
              .toLocaleString(DateTime.DATE_MED)}
          </Text>
        ),
        Footer: false,
      },
      {
        Header: "término do contrato",
        accessor: ({ dataInicioAtividade }) => dataInicioAtividade,
        Cell: ({ value }) => (
          <Text noOfLines={2}>
            {DateTime.fromISO(value)
              .setLocale("pt-BR")
              .plus({ months: 24, days: -2 })
              .toLocaleString(DateTime.DATE_MED)}
          </Text>
        ),
        Footer: false,
      },
      {
        Header: "status monitoramento",
        // accessor: ({ statusMonitoramento, monitoramentos }) => ({
        //   statusMonitoramento,
        //   monitoramentos,
        // }),
        accessor: "statusMonitoramento.label",
        Cell: ({
          row: {
            original: {
              statusMonitoramento: { label, tooltip, color, icon },
              monitoramentos,
            },
          },
        }) => {
          const ultimoMonitoramento = obterUltimoMonitoramento(
            monitoramentos,
            _.isEmpty(periodoSelecionado)
              ? obterPeriodoSelecionado()
              : periodoSelecionado
          );

          if (_.isEmpty(ultimoMonitoramento)) {
            return (
              <Box minW={200}>
                <Tooltip label={tooltip}>
                  <Tag colorScheme={color} borderRadius="full">
                    <Icon as={icon} ml={-0.5} mr={1} />
                    <TagLabel>{label}</TagLabel>
                  </Tag>
                </Tooltip>
              </Box>
            );
          }
          return (
            <Stack minW={202}>
              <Box>
                <Tooltip label={tooltip}>
                  <Tag colorScheme={color} borderRadius="full">
                    <Icon as={icon} ml={-0.5} mr={1} />
                    <TagLabel>{label}</TagLabel>
                  </Tag>
                </Tooltip>
              </Box>
              <Tooltip
                label={`${DateTime.fromISO(
                  ultimoMonitoramento.dataMonitoramento
                )
                  .setLocale("pt-BR")
                  .toLocaleString(DateTime.DATETIME_MED)}h`}
              >
                <Tag colorScheme={color} borderRadius="full">
                  <Icon as={FiCalendar} ml={-0.5} mr={1} />
                  <TagLabel>
                    {DateTime.fromISO(ultimoMonitoramento.dataMonitoramento)
                      .setLocale("pt-BR")
                      .toLocaleString(DateTime.DATETIME_MED)}
                    h
                  </TagLabel>
                </Tag>
              </Tooltip>
            </Stack>
          );
        },
        Footer: false,
      },
      {
        Header: "arquivos",
        // accessor: ({ statusMonitoramento, monitoramentos }) => ({
        //   statusMonitoramento,
        //   monitoramentos,
        // }),
        Cell: ({
          row: {
            original: {
              monitoramentos,
              // : {
              //   monitoramentoComprovacao_Id,
              //   autoAvaliacao_anexoId,
              //   benefPontoFocal_anexoId,
              //   ambienteTrabalho_anexoId,
              //   ...monitoramentos
              // },
            },
          },
        }) => {
          const ultimoMonitoramento = obterUltimoMonitoramento(
            monitoramentos,
            _.isEmpty(periodoSelecionado)
              ? obterPeriodoSelecionado()
              : periodoSelecionado
          );
          if (
            _.isEmpty(ultimoMonitoramento) ||
            (_.isEmpty(ultimoMonitoramento.monitoramentoComprovacao_Id) &&
              _.isEmpty(ultimoMonitoramento.autoAvaliacao_anexoId) &&
              _.isEmpty(ultimoMonitoramento.benefPontoFocal_anexoId) &&
              _.isEmpty(ultimoMonitoramento.ambienteTrabalho_anexoId))
          ) {
            return <Box minW={200}></Box>;
          }

          return (
            <Stack minW={250}>
              {!_.isEmpty(ultimoMonitoramento.monitoramentoComprovacao_Id) && (
                <Box>
                  <Tooltip label="Comprovação Monitoramento">
                    <Button
                      as={Tag}
                      h={1}
                      colorScheme="brand1"
                      borderRadius="full"
                      size="sm"
                      variant="outline"
                      isLoading={buttonStateMonitoramentoComprovacao}
                      loadingText="Aguarde..."
                      onClick={() => {
                        downloadFile(
                          {
                            referenceObjId:
                              ultimoMonitoramento.monitoramentoComprovacao_Id,
                          },
                          setButtonStateMonitoramentoComprovacao
                        );
                      }}
                    >
                      <Icon as={FiDownload} ml={-0.5} mr={1} />
                      <TagLabel>Comprovação Monitoramento</TagLabel>
                    </Button>
                  </Tooltip>
                </Box>
              )}
              {!_.isEmpty(ultimoMonitoramento.autoAvaliacao_anexoId) && (
                <Box>
                  <Tooltip label="Auto Avaliação">
                    <Button
                      as={Tag}
                      h={1}
                      colorScheme="brand1"
                      borderRadius="full"
                      size="sm"
                      variant="outline"
                      isLoading={buttonStateAutoAvaliacao}
                      loadingText="Aguarde..."
                      onClick={() =>
                        downloadFile(
                          {
                            fileId: JSON.parse(
                              ultimoMonitoramento.autoAvaliacao_anexoId
                            ).pop().id,
                          },
                          setButtonStateAutoAvaliacao
                        )
                      }
                    >
                      <Icon as={FiDownload} ml={-0.5} mr={1} />
                      <TagLabel>Auto Avaliação</TagLabel>
                    </Button>
                  </Tooltip>
                </Box>
              )}
              {!_.isEmpty(ultimoMonitoramento.benefPontoFocal_anexoId) && (
                <Box>
                  <Tooltip label="Beneficiário pelo Ponto Focal">
                    <Button
                      as={Tag}
                      h={1}
                      colorScheme="brand1"
                      borderRadius="full"
                      size="sm"
                      variant="outline"
                      isLoading={buttonStateBenefPontoFocal}
                      loadingText="Aguarde..."
                      onClick={() =>
                        downloadFile(
                          {
                            fileId: JSON.parse(
                              ultimoMonitoramento.benefPontoFocal_anexoId
                            ).pop().id,
                          },
                          setButtonStateBenefPontoFocal
                        )
                      }
                    >
                      <Icon as={FiDownload} ml={-0.5} mr={1} />
                      <TagLabel>Beneficiário pelo Ponto Focal</TagLabel>
                    </Button>
                  </Tooltip>
                </Box>
              )}
              {!_.isEmpty(ultimoMonitoramento.ambienteTrabalho_anexoId) && (
                <Box>
                  <Tooltip label="Ambiente de Trabalho">
                    <Button
                      as={Tag}
                      h={1}
                      colorScheme="brand1"
                      borderRadius="full"
                      size="sm"
                      variant="outline"
                      isLoading={buttonStateAmbienteTrabalho}
                      loadingText="Aguarde..."
                      onClick={() =>
                        downloadFile(
                          {
                            fileId: JSON.parse(
                              ultimoMonitoramento.ambienteTrabalho_anexoId
                            ).pop().id,
                          },
                          setButtonStateAmbienteTrabalho
                        )
                      }
                    >
                      <Icon as={FiDownload} ml={-0.5} mr={1} />
                      <TagLabel>Ambiente de Trabalho</TagLabel>
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Stack>
          );
        },
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: (props) => (
          <MenuIconButton
            icon={<FiMoreHorizontal />}
            menuItems={[
              {
                menuGroupLabel: null,
                menuGroupButtons: [
                  props.row.original.statusMonitoramento.label === "Realizado"
                    ? {
                        text: "Editar Monitoramento",
                        icon: <FiEdit />,
                        onClick: () => {
                          const ultimoMonitoramento = obterUltimoMonitoramento(
                            props.row.original.monitoramentos,
                            _.isEmpty(periodoSelecionado)
                              ? obterPeriodoSelecionado()
                              : periodoSelecionado
                          );
                          setSelectedRow(props.row.original);
                          setMonitoramentoSelecionado(ultimoMonitoramento);
                          monitorarBeneficiarioForm.openOverlay();
                        },
                      }
                    : null,
                  {
                    text: "Registrar Visita",
                    icon: <FiMapPin />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                    },
                    isDisabled:
                      props.row.original.statusMonitoramento.label ===
                      "Realizado",
                  },
                  {
                    text: "Monitorar",
                    icon: <FiActivity />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      monitorarBeneficiarioForm.openOverlay();
                    },
                    isDisabled:
                      props.row.original.statusMonitoramento.label ===
                      "Realizado",
                  },
                ],
              },
            ]}
            colorScheme="brand1"
          />
        ),
        Footer: false,
      },
    ],
    [
      periodoSelecionado,
      buttonStateMonitoramentoComprovacao,
      buttonStateAutoAvaliacao,
      buttonStateBenefPontoFocal,
      buttonStateAmbienteTrabalho,
    ]
  );

  const data = useMemo(() => tableData, [tableData]);

  const fileUpload = async (data, setUploadProgress) => {
    const config = {
      signal: uploadController.signal,
      onUploadProgress: (event) => {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    };
    const response = await filesAPIUpload.post(`/uploadFile`, data, config);
    return response;
  };

  const downloadFile = async (objId, buttonState) => {
    buttonState.on();
    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: objId,
    });
    const { data: file } = await filesAPIService.get(`/downloadFile`, {
      params: {
        fileId: fileDetails.id,
      },
      responseType: "blob",
    });
    download(file, fileDetails.name, fileDetails.contentType);
    buttonState.off();
  };

  const filtroAvancadoFormSubmit = async (formData, e) => {
    e.preventDefault();
    const {
      escritoriosRegionais = [],
      municipios = [],
      demandantes = [],
      situacaoBenef = [],
      formacoes = [],
    } = formData;

    const filteredRows = benefFromBd
      .filter(
        ({
          vaga: {
            municipio: { escritorio_RegionalId },
          },
        }) =>
          _.isEmpty(escritoriosRegionais)
            ? true
            : escritoriosRegionais
                .map(({ value }) => value)
                .includes(escritorio_RegionalId)
      )
      .filter(({ vaga: { municipio_Id } }) =>
        _.isEmpty(municipios)
          ? true
          : municipios.map(({ value }) => value).includes(municipio_Id)
      )
      .filter(({ vaga: { demandante_Id } }) =>
        _.isEmpty(demandantes)
          ? true
          : demandantes.map(({ value }) => value).includes(demandante_Id)
      )
      .filter(({ vaga: { situacaoVaga_Id } }) =>
        _.isEmpty(situacaoBenef)
          ? true
          : situacaoBenef.map(({ value }) => value).includes(situacaoVaga_Id)
      )
      .filter(({ formacao_Id }) =>
        _.isEmpty(formacoes)
          ? true
          : formacoes.map(({ value }) => value).includes(formacao_Id)
      );

    setTableData(filteredRows);
    if (
      _.isEmpty(escritoriosRegionais) &&
      _.isEmpty(municipios) &&
      _.isEmpty(demandantes) &&
      _.isEmpty(situacaoBenef) &&
      _.isEmpty(formacoes)
    ) {
      setFiltroAtivo.off();
    } else {
      setFiltroAtivo.on();
    }
    return filtroAvancadoForm.closeOverlay();
  };

  const selecionarPeriodoFormSubmit = async ({ anoPeriodo, idPeriodo }, e) => {
    e.preventDefault();
    selecionarPeriodoForm.setLoading();

    setPeriodoSelecionado(obterPeriodoSelecionado(idPeriodo));

    selecionarPeriodoForm.setLoaded();
    selecionarPeriodoForm.closeOverlay();
  };

  const monitorarBeneficiarioFormSubmit = async (formData, e) => {
    try {
      monitorarBeneficiarioForm.setLoading();
      e.preventDefault();
      const {
        autoAvaliacao,
        benefPontoFocal,
        ambienteTrabalho,
        ...restFormData
      } = formData;

      if (_.isArray(autoAvaliacao) && !_.isEmpty(autoAvaliacao)) {
        const anexos = new FormData();
        autoAvaliacao.map((file, idx) => anexos.append(`files`, file));
        const { data: uploadedFiles } = await fileUpload(
          anexos,
          setUploadProgressAutoAvaliacao
        );
        restFormData.autoAvaliacao = uploadedFiles;
      } else if (!_.isEmpty(monitoramentoSelecionado)) {
        restFormData.ambienteTrabalho = JSON.parse(
          monitoramentoSelecionado.autoAvaliacao_anexoId
        );
      }

      if (_.isArray(benefPontoFocal) && !_.isEmpty(benefPontoFocal)) {
        const anexos = new FormData();
        benefPontoFocal.map((file, idx) => anexos.append(`files`, file));
        const { data: uploadedFiles } = await fileUpload(
          anexos,
          setUploadProgressBenefPontoFocal
        );
        restFormData.benefPontoFocal = uploadedFiles;
      } else if (!_.isEmpty(monitoramentoSelecionado)) {
        restFormData.ambienteTrabalho = JSON.parse(
          monitoramentoSelecionado.benefPontoFocal_anexoId
        );
      }

      if (_.isArray(ambienteTrabalho) && !_.isEmpty(ambienteTrabalho)) {
        const anexos = new FormData();
        ambienteTrabalho.map((file, idx) => anexos.append(`files`, file));
        const { data: uploadedFiles } = await fileUpload(
          anexos,
          setUploadProgressAmbienteTrabalho
        );
        restFormData.ambienteTrabalho = uploadedFiles;
      } else if (!_.isEmpty(monitoramentoSelecionado)) {
        restFormData.ambienteTrabalho = JSON.parse(
          monitoramentoSelecionado.ambienteTrabalho_anexoId
        );
      }

      if (!_.isEmpty(monitoramentoSelecionado)) {
        const { status } = await axios.put(
          `/api/${entity}/monitoramento`,
          restFormData,
          {
            params: {
              id: monitoramentoSelecionado.id,
            },
          }
        );

        if (status === 200) {
          toast({
            title: "Monitoramento alterado com sucesso",
            status: "success",
          });
          monitorarBeneficiarioForm.closeOverlay();
          monitorarBeneficiarioForm.control.reset({});
        }
      } else {
        const { status } = await axios.post(
          `/api/${entity}/monitoramento`,
          restFormData
        );

        if (status === 200) {
          toast({
            title: "Monitoramento efetuado com sucesso",
            status: "success",
          });
          monitorarBeneficiarioForm.closeOverlay();
          monitorarBeneficiarioForm.control.reset({});
        }
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      monitorarBeneficiarioForm.setLoaded();
    }
  };

  const anexarComprovacaoMonitoramentoFormSubmit = async (
    { comprovacaoAnexo, ...restFormData },
    e
  ) => {
    anexarComprovacaoMonitoramentoForm.setLoading();
    e.preventDefault();
    try {
      if (_.isArray(comprovacaoAnexo) && !_.isEmpty(comprovacaoAnexo)) {
        const anexos = new FormData();
        comprovacaoAnexo.map((file, idx) => anexos.append(`files`, file));
        const { data: uploadedFiles } = await fileUpload(
          anexos,
          setUploadProgressComprovacaoMonitoramento
        );
        restFormData.comprovacaoAnexo = uploadedFiles;
      }

      restFormData.monitoramentosParaAnexarComprovacao = selectedTableRows.map(
        ({ original }) => original.statusMonitoramento.ultimoMonitoramento
      );

      const { status } = await axios.post(
        `/api/${entity}/monitoramento/anexarComprovacao`,
        restFormData
      );

      if (status === 200) {
        toast({
          title: "Comprovação anexada com sucesso",
          status: "success",
        });
        anexarComprovacaoMonitoramentoForm.closeOverlay();
        anexarComprovacaoMonitoramentoForm.control.reset({});
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      anexarComprovacaoMonitoramentoForm.setLoaded();
    }
  };

  const limparFiltroAvancado = () => {
    setTableData(benefFromBd);
    return setFiltroAtivo.off();
  };

  const checarMonitoramentos = (
    periodoSelecionado,
    dataInicioAtividade,
    monitoramentos
  ) => {
    const trimestreSelecionado = periodoSelecionado.trimestre;

    const periodoEfetivoNaContratacao = periodoMonitoramento.find(
      ({ startDate, endDate, metaType }) =>
        DateTime.fromISO(dataInicioAtividade) >=
          startDate.set({
            year: DateTime.fromISO(dataInicioAtividade).year,
          }) &&
        DateTime.fromISO(dataInicioAtividade) <=
          endDate.set({
            year: DateTime.fromISO(dataInicioAtividade).year,
          }) &&
        metaType === "4.1"
    );

    const inicioAnteriorDia10 = _.isObject(
      periodoMonitoramento.find(
        ({ startDate, cutDate, metaType }) =>
          DateTime.fromISO(dataInicioAtividade) >=
            startDate.set({
              year: DateTime.fromISO(dataInicioAtividade).year,
            }) &&
          DateTime.fromISO(dataInicioAtividade) <=
            cutDate.set({
              year: DateTime.fromISO(dataInicioAtividade).year,
            }) &&
          metaType === "4.1"
      )
    );

    if (_.isEmpty(monitoramentos)) {
      if (
        !inicioAnteriorDia10 &&
        periodoEfetivoNaContratacao === trimestreSelecionado
      ) {
        // regras de monitoramento para beneficiários contratados após o período de corte de cada trimestre
        return {
          label: "Não elegível",
          tooltip:
            "Beneficiário contratado no trimestre efetivo, fora do período de corte (dez primeiros dias no início do trimeste).",
          metaType: undefined,
          color: "orange",
          icon: FiAlertTriangle,
          anexarComprovacao: false,
        };
      }

      // se monitoramentos estiver vazio, o beneficiário ainda não teve nenhum monitoramento realizado. Logo, deve ser realizado o primeiro monitoramento trimestral (metaType 4.1), no mesmo trimestre de contratação. Caso não seja monitorado no trimestre de contratação, o próximo monitoramento DEVE ser o semestral (metaType 4.2)

      if (periodoEfetivoNaContratacao !== trimestreSelecionado) {
        return {
          label: "Pendente Avaliação",
          metaType: "4.2",
          color: "red",
          icon: FiAlertTriangle,
        };
      } else {
        return {
          label: "Pendente Monitoramento",
          metaType: "4.1",
          color: "red",
          icon: FiAlertTriangle,
        };
      }
    }

    // se monitoramentos NÃO estiver vazio, é necessário verificar se o último monitoramento foi realizado dentro do trimestre ou semestre vigente.

    const ultimoMonitoramentoPeriodoSelecionado = monitoramentos.find(
      ({ dataMonitoramento }) =>
        DateTime.fromISO(dataMonitoramento) >= trimestreSelecionado.startDate &&
        DateTime.fromISO(dataMonitoramento) <= trimestreSelecionado.endDate
    );

    const ultimoMonitoramento = monitoramentos.find(
      ({ dataMonitoramento }) =>
        DateTime.fromISO(dataMonitoramento) <= trimestreSelecionado.startDate ||
        (DateTime.fromISO(dataMonitoramento) >=
          trimestreSelecionado.startDate &&
          DateTime.fromISO(dataMonitoramento) <= trimestreSelecionado.endDate)
    );

    // se o último monitoramento foi realizado dentro do trimestre ou semestre vigente, retornar Realizado.
    if (!_.isEmpty(ultimoMonitoramentoPeriodoSelecionado)) {
      return {
        label: "Realizado",
        metaType: ultimoMonitoramento.metaType,
        color: "green",
        icon: FiCheckCircle,
        anexarComprovacao:
          _.isEmpty(ultimoMonitoramento.monitoramentoComprovacao_Id) &&
          ultimoMonitoramento.metaType === "4.2",
        ultimoMonitoramento,
      };
    }

    if (_.isEmpty(ultimoMonitoramento)) {
      return {
        label: `Pendente Monitoramento`,
        metaType: `4.1`,
        color: "red",
        icon: FiAlertTriangle,
        anexarComprovacao: false,
      };
    }
    // se o último monitoramento foi realizado fora do trimestre ou semestre vigente, e o metaType for 4.1, próximo monitoramento será semestral. Retornar Pendente Avaliação, com metaType 4.2.

    // se o último monitoramento foi realizado fora do trimestre ou semestre vigente, e o metaType for 4.1, próximo monitoramento será semestral. Retornar Pendente Avaliação, com metaType 4.2.
    return {
      label: `Pendente ${
        ultimoMonitoramento.metaType === "4.1" ? " Avaliação" : "Monitoramento"
      }`,
      metaType: `${ultimoMonitoramento.metaType === "4.1" ? "4.2" : "4.1"}`,
      color: "red",
      icon: FiAlertTriangle,
      anexarComprovacao: false,
    };
  };

  const obterUltimoMonitoramento = (monitoramentos, periodoSelecionado) => {
    const trimestreAtual = periodoSelecionado.trimestre;
    return monitoramentos.find(
      ({ dataMonitoramento }) =>
        DateTime.fromISO(dataMonitoramento) >= trimestreAtual.startDate &&
        DateTime.fromISO(dataMonitoramento) <= trimestreAtual.endDate
    );
  };

  useEffect(() => {
    setUploadController(new AbortController());
  }, []);

  const obterPeriodoSelecionado = (idPeriodo) => {
    const anoSelecionado = parseInt(anoPeriodoSelecionado.value);
    const periodosPorAnoSelecionado = calcularPeriodoMonitoramentoRealizado(
      timeFromNetwork,
      anoSelecionado
    );

    const todayDate = DateTime.fromISO(timeFromNetwork).setLocale("pt-BR");

    const trimestre = periodosPorAnoSelecionado.find(
      ({ id, startDate, endDate, metaType }) => {
        if (!_.isEmpty(idPeriodo)) {
          return id === idPeriodo;
        }
        return (
          todayDate.set({
            year: todayDate.month === 12 ? anoSelecionado - 1 : anoSelecionado,
          }) >= startDate &&
          todayDate.set({
            year: todayDate.month === 12 ? anoSelecionado - 1 : anoSelecionado,
          }) <= endDate &&
          metaType === "4.1"
        );
      }
    );

    const semestre =
      trimestre.id <= 2
        ? periodosPorAnoSelecionado.find(
            ({ startDate, endDate, metaType, id }) => id === "5"
          )
        : periodosPorAnoSelecionado.find(
            ({ startDate, endDate, metaType, id }) => id === "6"
          );

    return {
      trimestre,
      semestre,
    };
  };

  useEffect(() => {
    setPeriodoSelecionado(obterPeriodoSelecionado());
  }, [anoPeriodoSelecionado]);

  useEffect(() => {
    setFetchTableData.on();
    const preLoadPeriodo = _.isEmpty(periodoSelecionado)
      ? obterPeriodoSelecionado()
      : periodoSelecionado;
    axios
      .get(`/api/${entity}/monitoramento`)
      .then(({ data }) => {
        // bdRhService.get(`/funcionarios`);
        const rows = data
          .filter(({ dataInicioAtividade }) => {
            /**
                Implementar lógica para desbloqueio de monitoramento de beneficiários desligados, mediante autorização da gestão feita pela página de cadastro de monitores
             */
            return (
              DateTime.fromISO(timeFromNetwork) <
                DateTime.fromISO(dataInicioAtividade).plus({ years: 2 }) &&
              DateTime.fromISO(dataInicioAtividade)
                .diff(preLoadPeriodo.trimestre.endDate, "days")
                .toObject().days < 0
            );
          })
          .map(({ vaga, monitoramentos, dataInicioAtividade, ...benef }) => ({
            ...benef,
            dataInicioAtividade,
            monitoramentos,
            vaga: vaga.shift(),
            statusMonitoramento: checarMonitoramentos(
              _.isEmpty(periodoSelecionado)
                ? preLoadPeriodo
                : periodoSelecionado,
              dataInicioAtividade,
              monitoramentos
            ),
          }));
        setBenefFromBd(rows);
        setTableData(rows);
      })
      .finally(setFetchTableData.off);
  }, [monitorarBeneficiarioForm.overlayIsOpen, periodoSelecionado]);

  const escritoriosRegionais = filtroAvancadoForm.control.watch(
    "escritoriosRegionais"
  );

  const municipios = filtroAvancadoForm.control.watch("municipios");

  const demandantes = filtroAvancadoForm.control.watch("demandantes");

  const unidadesLotacao = filtroAvancadoForm.control.watch("unidadesLotacao");

  const monitores = filtroAvancadoForm.control.watch("monitores");

  const { _fields } = filtroAvancadoForm.control.control;

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
          setSituacoesFromBd(
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
    axios
      .get(
        `/api/${entity}/monitores`,
        _.isEmpty(escritoriosRegionais) && _.isEmpty(municipios)
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
              },
            }
      )
      .then((res) => {
        if (res.status === 200) {
          setMonitoresFromBd(
            res.data.map(({ id, matricula, nome }) => ({
              value: id,
              label: `${matricula} - ${nome}`,
            }))
          );
        }
      })
      .catch((error) => console.log(error));
  }, [escritoriosRegionais, municipios]);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
  }, [asPath]);

  const getAnexoDetails = useCallback(async (anexoId) => {
    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: {
        referenceObjId: anexoId,
      },
    });
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!fetchTableData}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          pb={5}
          minH="60px"
          flexWrap="wrap"
        >
          <Box order={0}>
            <Heading fontSize={{ md: "1.4rem" }}>Monitoramento</Heading>
            <Heading size="xs" color="gray.500" mt={{ md: 1 }}>
              {tableRowsCount && tableRowsCount === 0
                ? `Nenhum registro encontrado`
                : tableRowsCount === 1
                ? `${tableRowsCount} registro encontrado`
                : `${tableRowsCount} registros encontrados`}
            </Heading>
          </Box>
          <HStack
            order={{ base: 3, md: 2 }}
            justifyContent={{ base: "space-between", sm: "center" }}
            flex="1"
            pt={{ base: 4, sm: 0 }}
          >
            <Box p={1} bg="gray.200" rounded="md" shadow="sm">
              <HStack justifyContent="space-between">
                <Heading size="xs">Trimestre Efetivo</Heading>
                <Icon as={FiCalendar} />
              </HStack>
              <Heading fontSize="xs" color="gray.500" mt={0.5}>
                {!_.isEmpty(periodoSelecionado) &&
                  periodoSelecionado.trimestre.label}
              </Heading>
            </Box>
            <Box p={1} bg="gray.200" rounded="md" shadow="sm">
              <HStack justifyContent="space-between">
                <Heading size="xs">Semestre Efetivo</Heading>
                <Icon as={FiCalendar} />
              </HStack>
              <Heading fontSize="xs" color="gray.500" mt={0.5}>
                {!_.isEmpty(periodoSelecionado) &&
                  periodoSelecionado.semestre.label}
              </Heading>
            </Box>
            <Tooltip label="Alterar período">
              <Button
                position="relative"
                colorScheme="brand1"
                variant="outline"
                onClick={selecionarPeriodoForm.openOverlay}
              >
                <Icon as={FiCalendar} position="absolute" boxSize={6} />
                <Icon
                  as={FiRefreshCw}
                  position="absolute"
                  bottom="2px"
                  right="2px"
                  boxSize={4}
                  bg="gray.300"
                  p={0.5}
                  rounded="full"
                />
              </Button>
            </Tooltip>
          </HStack>
          <ButtonGroup
            isAttached={filtroAtivo}
            size={{ base: "sm", sm: "md" }}
            order={2}
          >
            <Button
              colorScheme="brand1"
              shadow="md"
              leftIcon={
                <FiFilter fill={filtroAtivo ? "currentColor" : "none"} />
              }
              onClick={filtroAvancadoForm.openOverlay}
              variant={filtroAtivo ? "solid" : "outline"}
            >
              Filtro Avançado {filtroAtivo && "Ativo"}
            </Button>
            <Tooltip label="Limpar Filtro" hidden={!filtroAtivo}>
              <IconButton
                variant="solid"
                colorScheme="red"
                hidden={!filtroAtivo}
                icon={<FiTrash2 />}
                onClick={limparFiltroAvancado}
              />
            </Tooltip>
          </ButtonGroup>
        </Flex>
        <Flex as={Collapse} in={selectedTableRows.length >= 1}>
          <Stack
            as={chakra.form}
            flex="1"
            p={2}
            bg="brand1.50"
            rounded="md"
            onSubmit={anexarComprovacaoMonitoramentoForm.handleSubmit(
              anexarComprovacaoMonitoramentoFormSubmit
            )}
          >
            <FormLabel>Anexar comprovação</FormLabel>
            <FormMaker>{anexarComprovacaoMonitoramentoFormInputs}</FormMaker>
            <Flex justifyContent="center" py={2}>
              <Button
                colorScheme="brand1"
                variant="outline"
                type="submit"
                isDisabled={!anexarComprovacaoMonitoramentoForm.validation}
                isLoading={anexarComprovacaoMonitoramentoForm.isLoading}
              >
                Importar Comprovação
              </Button>
            </Flex>
          </Stack>
        </Flex>
        <Table
          data={data}
          columns={columns}
          setRowsCount={setTableRowsCount}
          setSelectedRows={setSelectedTableRows}
        />
      </AnimatePresenceWrapper>

      {/* Filtro Avançado Overlay */}
      <Overlay
        closeOnOverlayClick={true}
        isOpen={filtroAvancadoForm.overlayIsOpen}
        onClose={filtroAvancadoForm.closeOverlay}
        header="Filtro Avançado"
        closeButton
      >
        <Heading size="md" mb={4}>
          Selecionar filtros:
        </Heading>
        <Stack
          as={chakra.form}
          onSubmit={filtroAvancadoForm.handleSubmit(filtroAvancadoFormSubmit)}
        >
          <SelectInputBox
            id="escritoriosRegionais"
            label="Escritórios Regionais"
            formControl={filtroAvancadoForm.control}
            options={escritoriosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="municipios"
            label="Municípios"
            formControl={filtroAvancadoForm.control}
            options={municipiosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="demandantes"
            label="Demandantes"
            formControl={filtroAvancadoForm.control}
            options={demandantesFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="unidadesLotacao"
            label="Unidades de Lotação"
            formControl={filtroAvancadoForm.control}
            options={situacoesFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="monitores"
            label="Monitores"
            formControl={filtroAvancadoForm.control}
            options={formacoesFromBd}
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

      {/* Monitorar Beneficiário Overlay */}
      <Overlay
        closeOnOverlayClick={true}
        isOpen={monitorarBeneficiarioForm.overlayIsOpen}
        onClose={monitorarBeneficiarioForm.closeOverlay}
        header={
          _.isEmpty(monitoramentoSelecionado)
            ? `Monitorar Beneficiári${
                selectedRow.sexo === "Feminino" ? "a" : "o"
              }: ${selectedRow.nome}`
            : `Editar Monitoramento - ${selectedRow.nome}`
        }
        closeButton
        onCloseComplete={() => {
          setSelectedRow({});
          setMonitoramentoSelecionado({});
        }}
        size="lg"
      >
        <Heading size="md" pb={4}>
          Dados da Vaga
        </Heading>

        <Stack
          as={chakra.form}
          onSubmit={monitorarBeneficiarioForm.handleSubmit(
            monitorarBeneficiarioFormSubmit
          )}
        >
          <Stack bg="gray.200" p={4} rounded="lg">
            <Heading as={Flex} flexDir="column" fontSize="sm" color="gray.500">
              Município da Vaga:
              <chakra.span fontSize="md" color="gray.700">
                {!_.isEmpty(selectedRow) && selectedRow.vaga.municipio.nome}
              </chakra.span>
            </Heading>
            <Heading as={Flex} flexDir="column" fontSize="sm" color="gray.500">
              Demandante:
              <chakra.span fontSize="md" color="gray.700">
                {`${
                  !_.isEmpty(selectedRow) && selectedRow.vaga.demandante.sigla
                } - ${
                  !_.isEmpty(selectedRow) && selectedRow.vaga.demandante.nome
                }`}
              </chakra.span>
            </Heading>
            <Heading as={Flex} flexDir="column" fontSize="sm" color="gray.500">
              Unidade:
              <chakra.span fontSize="md" color="gray.700">
                {!_.isEmpty(selectedRow) &&
                  selectedRow.vaga.unidadeLotacao.nome}
              </chakra.span>
            </Heading>
            <Heading as={Flex} flexDir="column" fontSize="sm" color="gray.500">
              Formação:
              <chakra.span fontSize="md" color="gray.700">
                {!_.isEmpty(selectedRow) && selectedRow.formacao.nome}
              </chakra.span>
            </Heading>
          </Stack>
          <Divider pt={4} />

          <Heading size="md" pt={4}>
            Informações Gerais
          </Heading>
          <FormMaker data={monitoramentoSelecionado}>
            {monitorarBeneficiarioFormInputsSection1}
          </FormMaker>
          <Divider />
          <Heading size="md" pt={4}>
            Impressões da Equipe PPE sobre
            {`${
              !_.isEmpty(selectedRow) && selectedRow.sexo === "Feminino"
                ? " a Beneficiária"
                : " o Beneficiário"
            }`}
          </Heading>
          <FormMaker data={monitoramentoSelecionado}>
            {monitorarBeneficiarioFormInputsSection2}
          </FormMaker>
          <FormMaker data={monitoramentoSelecionado}>
            {monitorarBeneficiarioFormInputsSectionHidden}
          </FormMaker>
          <HStack justifyContent="flex-end" py={4}>
            <Button
              type="submit"
              colorScheme="brand1"
              isDisabled={!monitorarBeneficiarioForm.validation}
              isLoading={monitorarBeneficiarioForm.isLoading}
            >
              Salvar
            </Button>
          </HStack>
        </Stack>
      </Overlay>

      <Modal
        isOpen={selecionarPeriodoForm.overlayIsOpen}
        onClose={selecionarPeriodoForm.closeOverlay}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          as={chakra.form}
          onSubmit={selecionarPeriodoForm.handleSubmit(
            selecionarPeriodoFormSubmit
          )}
        >
          <ModalHeader>Selecionar período</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <HStack w="100%" spacing={4} alignItems="flex-start">
              <Box w="300px">
                <SelectInputBox
                  id="anoPeriodo"
                  label="Ano"
                  formControl={selecionarPeriodoForm.control}
                  options={anoPeriodoMonitoramentoOptions}
                  onChange={(value) => {
                    selecionarPeriodoForm.control.control._fields.idPeriodo?._f.ref.setValue(
                      ""
                    );
                    setAnoPeriodoSelecionado(value);
                  }}
                  defaultValue={
                    !_.isEmpty(anoPeriodoSelecionado) &&
                    anoPeriodoMonitoramentoOptions.find(
                      ({ value }) => anoPeriodoSelecionado.value === value
                    )
                  }
                />
              </Box>
              <Box w="full">
                <SelectInputBox
                  id="idPeriodo"
                  label="Período"
                  formControl={selecionarPeriodoForm.control}
                  options={periodoMonitoramentoOptions}
                  defaultValue={
                    !_.isEmpty(periodoMonitoramentoOptions) &&
                    periodoMonitoramentoOptions.find(
                      ({ value }) => periodoSelecionado.trimestre.id === value
                    )
                  }
                />
              </Box>
            </HStack>
          </ModalBody>
          <ModalFooter as={HStack}>
            <Button
              colorScheme="brand1"
              variant="outline"
              onClick={selecionarPeriodoForm.closeOverlay}
            >
              Cancelar
            </Button>
            <Button
              colorScheme="brand1"
              variant="solid"
              type="submit"
              // isDisabled={!selecionarPeriodoForm.validation}
              isLoading={selecionarPeriodoForm.isLoading}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  const { data: timeFromNetwork } = await axios.get(
    `/api/${entity}/network-time`
  );

  return {
    props: {
      entity: entityCheck || null,
      timeFromNetwork,
    },
  };
}

Monitoramento.auth = true;
Monitoramento.dashboard = true;
