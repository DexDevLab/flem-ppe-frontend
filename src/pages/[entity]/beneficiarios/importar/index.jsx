import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Tooltip,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FormMaker } from "components/Form";
import { Table } from "components/Table";
import { CellInput } from "components/Table/components/CellInput";
import { MaskedCellInput } from "components/Table/components/MaskedCellInput";
import { SelectCellInput } from "components/Table/components/SelectCellInput";
import { useCustomForm } from "hooks";
import { DateTime } from "luxon";
import { celularMask, cpfMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiInfo,
} from "react-icons/fi";
import { axios, getBackendRoute } from "services";

export default function Importar({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure(false);
  const remessaModal = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const { fileId } = router.query;
  const session = useSession();
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [rowsDataUpdate, setRowsDataUpdate] = useState([]);
  const [rowsDataIgnore, setRowsDataIgnore] = useState([]);
  const [listaDemandantes, setListaDemandantes] = useState([]);
  const [listaMunicipios, setListaMunicipios] = useState([]);
  const [listaEtnias, setListaEtnias] = useState([]);
  const [listaCursoFormacao, setListaCursoFormacao] = useState([]);
  const [sheet, setSheet] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
  const [tableError, setTableError] = useState();
  const [checkingTableErrors, setCheckingTableErrors] = useBoolean(false);
  const [sendingData, setSendingData] = useBoolean(false);
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const formRemessaInfo = useCustomForm();

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
  }, [asPath]);

  useEffect(() => {
    axios
      .get(getBackendRoute(entity, "upload-sheets"), {
        params: {
          fileId,
        },
      })
      .then(({ status, data }) => {
        setSheet(data.output2);
        console.log(data.output2);
        setFileDetails(data.fileDetails);
      })
      .catch((err) => console.log(err.response))
      .finally(setTimeout(onLoad, 3000));

    axios
      .get(getBackendRoute(entity, "populate/options"))
      .then(({ data }) => {
        setListaDemandantes(
          data.query.demandantes.map(({ id, sigla, nome }) => ({
            value: id,
            label: `${sigla} - ${nome}`,
          }))
        );
        setListaMunicipios(
          data.query.municipios.map(({ id, nome }) => ({
            value: id,
            label: nome,
          }))
        );
        setListaEtnias(
          data.query.etnias.map(({ id, etnia }) => ({
            value: id,
            label: etnia,
          }))
        );
        setListaCursoFormacao(
          data.query.formacoes.map(({ id, nome }) => ({
            value: id,
            label: nome,
          }))
        );
      })
      .catch((err) => console.log(err));
    // axios
    //   //.get(getBackendRoute("demandantes")
    //   .get(`/api/${entity}/demandantes`)
    //   .then(({ status, data }) => {
    //     setListaDemandantes(
    //       data.map(({ id, sigla, nome }) => ({
    //         value: id,
    //         label: `${sigla} - ${nome}`,
    //       }))
    //     );
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   //.get(getBackendRoute("municipios")
    //   .get(`/api/${entity}/municipios`)
    //   .then(({ status, data }) => {
    //     setListaMunicipios(
    //       data.map(({ id, nome }) => ({ value: id, label: nome }))
    //     );
    //   })
    //   .catch((err) => console.log(err));
    // axios
    // //.get(getBackendRoute("etnias")
    //   .get(`/api/${entity}/etnias`)
    //   .then(({ status, data }) => {
    //     setListaEtnias(
    //       data.map(({ id, etnia }) => ({ value: id, label: etnia }))
    //     );
    //   })
    //   .catch((err) => console.log(err));
    // axios
    // //.get(getBackendRoute("formacoes")
    //   .get(`/api/${entity}/formacoes`)
    //   .then(({ status, data }) => {
    //     setListaCursoFormacao(
    //       data.map(({ id, nome }) => ({ value: id, label: nome }))
    //     );
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //console.log(sheet);
    const headers = sheet.length && Object.keys(sheet[0]);
    setColumnHeaders(
      headers &&
        headers
          .filter(
            (header) =>
              header !== "n_Vaga" &&
              header !== "found" &&
              header !== "update" &&
              header !== "eixoDeFormacao"
          )
          .map((header) => {
            const result = header.replace(/([A-Z])/g, " $1");
            const finalResult =
              result.charAt(0).toUpperCase() + result.slice(1);
            return {
              Header: finalResult.replace(/_/g, " "),
              accessor: header,
              Footer: false,
            };
          })
    );
    const rows =
      sheet &&
      sheet.map((row) => ({
        ...row,
        dataDaConvocacao: DateTime.fromISO(row.dataDaConvocacao.toString())
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        dataDeNascimento: DateTime.fromISO(row.dataDeNascimento.toString())
          .setLocale("pt-BR")
          .toFormat("dd/MM/yyyy"),
        telefone01: row.telefone01.formatted,
        telefone02: row.telefone02.formatted,
        raca_cor: row.raca_cor,
        cpfAluno: cpfMask(row.cpfAluno),
      }));
    setRowsData(rows.filter(({ update, found }) => !found && !update));
    setRowsDataUpdate(rows.filter(({ update, found }) => found && update));
    setRowsDataIgnore(rows.filter(({ found, update }) => found && !update));
  }, [sheet]);

  const columns = useMemo(() => {
    const demandante =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "demandante")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => (
            <>
              <Popover returnFocusOnClose={false} trigger="click">
                {({ isOpen, onClose }) => (
                  <>
                    {props.value.includes("*") || props.value === "" ? (
                      <PopoverTrigger>
                        <Box bg="red.200" p={2} rounded="lg">
                          {props.value.replace("*", "")}
                        </Box>
                      </PopoverTrigger>
                    ) : (
                      <Box>{props.value}</Box>
                    )}
                    <PopoverContent w="full">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Demandante não encontrado!</PopoverHeader>
                      <PopoverBody m={2}>
                        <Stack spacing={4}>
                          <Box>
                            Valor informado: {props.value.replace("*", "")}
                          </Box>
                          <HStack justifyContent="space-between">
                            <Text>Alterar para:</Text>
                            <Box w="75%">
                              <SelectCellInput
                                {...props}
                                defaultValue={props.value}
                                placeholder="Selecione..."
                              >
                                {Array.isArray(listaDemandantes) &&
                                  listaDemandantes.map(({ value, label }) => (
                                    <option key={value} value={label}>
                                      {`${label.slice(0, 30)}${
                                        label.length >= 30 ? "..." : ""
                                      }`}
                                    </option>
                                  ))}
                              </SelectCellInput>
                            </Box>
                          </HStack>
                          <Box alignSelf="flex-end">
                            <Button
                              isDisabled={props.value === ""}
                              onClick={onClose}
                            >
                              Confirmar
                            </Button>
                          </Box>
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </>
          ),
        }));

    const cpfAluno =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "cpfAluno")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => <CellInput {...props} mask={cpfMask} />,
        }));

    const nome =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "nome")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => <CellInput {...props} />,
        }));

    const municipioDaVaga =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "municipioDaVaga")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => (
            <Popover returnFocusOnClose={false} trigger="click">
              {({ isOpen, onClose }) => (
                <>
                  {props.value.includes("*") || props.value === "" ? (
                    <PopoverTrigger>
                      <Box bg="red.200" p={2} rounded="lg">
                        {props.value.replace("*", "")}
                      </Box>
                    </PopoverTrigger>
                  ) : (
                    <Box>{props.value}</Box>
                  )}
                  <PopoverContent w="full">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Município não encontrado!</PopoverHeader>
                    <PopoverBody m={2}>
                      <Stack spacing={4}>
                        <Box>
                          Valor informado: {props.value.replace("*", "")}
                        </Box>
                        <HStack justifyContent="space-between">
                          <Text>Alterar para:</Text>
                          <Box w="75%">
                            <SelectCellInput
                              {...props}
                              defaultValue={props.value}
                              placeholder="Selecione..."
                            >
                              {Array.isArray(listaMunicipios) &&
                                listaMunicipios.map(({ value, label }) => (
                                  <option
                                    key={`mun-vaga-${value}`}
                                    value={label}
                                  >
                                    {`${label.slice(0, 30)}${
                                      label.length >= 30 ? "..." : ""
                                    }`}
                                  </option>
                                ))}
                            </SelectCellInput>
                          </Box>
                        </HStack>
                        <Box alignSelf="flex-end">
                          <Button
                            isDisabled={props.value === ""}
                            onClick={onClose}
                          >
                            Confirmar
                          </Button>
                        </Box>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          ),
        }));

    const municipioDoAluno =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "municipioDoAluno")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => (
            <Popover returnFocusOnClose={false} trigger="click">
              {({ isOpen, onClose }) => (
                <>
                  {props.value.includes("*") || props.value === "" ? (
                    <PopoverTrigger>
                      <Box bg="red.200" p={2} rounded="lg">
                        {props.value.replace("*", "")}
                      </Box>
                    </PopoverTrigger>
                  ) : (
                    <Box>{props.value}</Box>
                  )}
                  <PopoverContent w="full">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Município não encontrado!</PopoverHeader>
                    <PopoverBody m={2}>
                      <Stack spacing={4}>
                        <Box>
                          Valor informado: {props.value.replace("*", "")}
                        </Box>
                        <HStack justifyContent="space-between">
                          <Text>Alterar para:</Text>
                          <Box w="75%">
                            <SelectCellInput
                              {...props}
                              defaultValue={props.value}
                              placeholder="Selecione..."
                            >
                              {Array.isArray(listaMunicipios) &&
                                listaMunicipios.map(({ value, label }) => (
                                  <option
                                    key={`mun-alun-${value}`}
                                    value={label}
                                  >
                                    {`${label.slice(0, 30)}${
                                      label.length >= 30 ? "..." : ""
                                    }`}
                                  </option>
                                ))}
                            </SelectCellInput>
                          </Box>
                        </HStack>
                        <Box alignSelf="flex-end">
                          <Button
                            isDisabled={props.value === ""}
                            onClick={onClose}
                          >
                            Confirmar
                          </Button>
                        </Box>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          ),
        }));

    const cursoDeFormacao =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "cursoDeFormacao")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => (
            <Popover returnFocusOnClose={false} trigger="click">
              {({ isOpen, onClose }) => (
                <>
                  {props.value.includes("*") || props.value === "" ? (
                    <PopoverTrigger>
                      <Box bg="red.200" p={2} rounded="lg">
                        {props.value.replace("*", "")}
                      </Box>
                    </PopoverTrigger>
                  ) : (
                    <Box>{props.value}</Box>
                  )}
                  <PopoverContent w="full">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Curso não encontrado!</PopoverHeader>
                    <PopoverBody m={2}>
                      <Stack spacing={4}>
                        <Box>
                          Valor informado: {props.value.replace("*", "")}
                        </Box>
                        <HStack justifyContent="space-between">
                          <Text>Alterar para:</Text>
                          <Box w="75%">
                            <SelectCellInput
                              {...props}
                              defaultValue={props.value}
                              placeholder="Selecione..."
                            >
                              {Array.isArray(listaCursoFormacao) &&
                                listaCursoFormacao.map(({ value, label }) => (
                                  <option
                                    key={`curso-id-${value}`}
                                    value={label}
                                  >
                                    {`${label.slice(0, 30)}${
                                      label.length >= 30 ? "..." : ""
                                    }`}
                                  </option>
                                ))}
                            </SelectCellInput>
                          </Box>
                        </HStack>
                        <Box alignSelf="flex-end">
                          <Button
                            isDisabled={props.value === ""}
                            onClick={onClose}
                          >
                            Confirmar
                          </Button>
                        </Box>
                      </Stack>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          ),
        }));

    const raca_cor =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "raca_cor")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Etnia",
          Cell: ({ value, ...props }) => {
            return (
              <SelectCellInput
                {...props}
                value={
                  (listaEtnias &&
                    listaEtnias.find(({ label }) => label === value)?.label) ||
                  value
                    ? value
                    : ""
                }
                placeholder="Selecione..."
              >
                {Array.isArray(listaEtnias) &&
                  listaEtnias.map(({ value, label }) => (
                    <option key={`etnia-id-${value}`} value={label}>
                      {label}
                    </option>
                  ))}
              </SelectCellInput>
            );
          },
        }));

    const telefone01 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone01")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 01",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />,
        }));

    const telefone02 =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "telefone02")
        .map((columnHeader) => ({
          ...columnHeader,
          Header: "Telefone 02",
          Cell: (props) => <MaskedCellInput {...props} mask={celularMask} />,
        }));

    const matriculaSec =
      columnHeaders &&
      columnHeaders
        .filter((columnHeader) => columnHeader.accessor === "matricula")
        .map((columnHeader) => ({
          ...columnHeader,
          Cell: (props) => <CellInput {...props} />,
        }));

    const columnHeadersCustomCell = demandante &&
      cursoDeFormacao &&
      cpfAluno &&
      nome &&
      telefone01 &&
      telefone02 &&
      municipioDaVaga &&
      municipioDoAluno &&
      raca_cor &&
      matriculaSec && [
        ...demandante,
        ...cursoDeFormacao,
        ...cpfAluno,
        ...nome,
        ...telefone01,
        ...telefone02,
        ...municipioDaVaga,
        ...municipioDoAluno,
        ...raca_cor,
        ...matriculaSec,
      ];

    const newColumnHeaders =
      columnHeaders &&
      columnHeaders.map(
        (obj) =>
          (columnHeadersCustomCell &&
            columnHeadersCustomCell.find((p) => p.accessor === obj.accessor)) ||
          obj
      );
    return newColumnHeaders && [...newColumnHeaders];
  }, [columnHeaders]);

  const tableData = useMemo(
    () => (rowsData.length && rowsData) || [],
    [rowsData]
  );

  const tableDataUpdate = useMemo(
    () => (rowsDataUpdate.length && rowsDataUpdate) || [],
    [rowsDataUpdate]
  );

  const tableDataIgnore = useMemo(
    () => (rowsDataIgnore.length && rowsDataIgnore) || [],
    [rowsDataIgnore]
  );

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setRowsData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const updateDataUpdateTable = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setRowsDataUpdate((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const checkTableErrors = () => {
    setCheckingTableErrors.on();
    axios
      .patch(getBackendRoute(entity, "validar-pendencias"), [
        ...tableData,
        ...tableDataUpdate,
        ...tableDataIgnore,
      ])
      .then(({ data }) => {
        setRowsData(data.filter(({ update, found }) => !found && !update));
        setRowsDataUpdate(data.filter(({ update, found }) => found && update));
        setRowsDataIgnore(data.filter(({ found, update }) => found && !update));
        setTableError(
          JSON.stringify(
            !data.filter(({ found, update }) => found && !update)
          ).includes("*") ||
            data
              .filter(({ found, update }) => found && !update)
              .filter(({ matricula }) => matricula === "").length
        );
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setCheckingTableErrors.off();
      });
  };

  const importarBenef = async (formData, e) => {
    e.preventDefault();
    remessaModal.onClose();
    setSendingData.on();

    formData.benef = [...tableData, ...tableDataUpdate];
    formData.fileDetails = fileDetails;

    try {
      const response = await axios.post(
        getBackendRoute(entity, "beneficiarios/importar"),
        formData
      );
      if (response.status === 200) {
        toast({
          title: "Importação realizada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: false,
          position,
        });
        router.push(`/${entity}/beneficiarios`);
      }
    } catch (error) {
      toast({
        title: (
          <Stack spacing={0} alignItems="flex-end">
            <Text>Ocorreu um erro na importação</Text>
            <Text fontSize="sm">Tente novamente mais tarde</Text>
          </Stack>
        ),
        status: "error",
        duration: 5000,
        isClosable: false,
        position,
      });
    } finally {
      setSendingData.off();
    }
  };

  useEffect(() => {
    if (!tableError) {
      setTableError(
        JSON.stringify(tableData).includes("*") ||
          JSON.stringify(tableDataUpdate).includes("*")
      );
    }
  }, [tableData]);

  const formRemessaInfoInputs = [
    {
      id: "numRemessa",
      label: "Número da Remessa",
      formControl: formRemessaInfo.control,
      type: "number",
      required: "Obrigatório",
    },
    {
      id: "dataRemessa",
      label: "Data da Remessa",
      formControl: formRemessaInfo.control,
      type: "date",
      defaultValue: DateTime.now().toFormat("yyyy-MM-dd"),
    },
  ];

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Importar Beneficiários</Heading>
          <HStack spacing={2}>
            <Button
              colorScheme="brand1"
              shadow="md"
              leftIcon={<FiFileText />}
              as={Box}
              _focus={{ boxShadow: "none" }}
              _hover={{ boxShadow: "none" }}
              _active={{ boxShadow: "none" }}
            >
              {fileDetails.originalName}
            </Button>
            <Button
              colorScheme={tableError ? "red" : "brand1"}
              leftIcon={tableError ? <FiAlertCircle /> : <FiCheckCircle />}
              onClick={() => {
                if (tableError) {
                  checkTableErrors();
                } else {
                  remessaModal.onOpen();
                }
              }}
              isLoading={sendingData || checkingTableErrors}
              loadingText="Aguarde..."
              transition="all .2s ease-in-out"
              isDisabled={!tableData.length && !tableDataUpdate.length}
              hidden={!columns.length}
            >
              {tableError ? "Verificar Pendências" : "Importar"}
            </Button>
          </HStack>
        </Flex>
        <Stack spacing={8}>
          {columns.length && tableData.length && (
            <Stack spacing={4}>
              <HStack spacing={2}>
                <Heading size="md">A importar</Heading>
                <Tooltip
                  label="Beneficiários não encontrados no sistema, cujos dados serão importados. Certifique-se de validar os campos se necessário."
                  placement="right"
                >
                  <Flex>
                    <Icon as={FiInfo} />
                  </Flex>
                </Tooltip>
              </HStack>
              <Table
                columns={columns}
                data={tableData}
                updateMyData={updateMyData}
              />
            </Stack>
          )}
          {columns.length && tableDataUpdate.length && (
            <Stack spacing={4}>
              <HStack spacing={2}>
                <Heading size="md">A atualizar</Heading>
                <Tooltip
                  label="Beneficiários encontrados no sistema, cujos dados serão
                  atualizados pelas informações abaixo."
                  placement="right"
                >
                  <Flex>
                    <Icon as={FiInfo} />
                  </Flex>
                </Tooltip>
              </HStack>

              <Table
                columns={columns}
                data={tableDataUpdate}
                updateMyData={updateDataUpdateTable}
              />
            </Stack>
          )}
          {columns.length && tableDataIgnore.length && (
            <Stack spacing={4}>
              <HStack spacing={2}>
                <Heading size="md">A ignorar</Heading>
                <Tooltip
                  label="Beneficiários encontrados no sistema, os quais não serão importados. As informações abaixo não serão incluídas no sistema."
                  placement="right"
                >
                  <Flex>
                    <Icon as={FiInfo} />
                  </Flex>
                </Tooltip>
              </HStack>
              <Table
                columns={columns}
                data={tableDataIgnore}
                updateMyData={updateMyData}
              />
            </Stack>
          )}
        </Stack>
        {!columns.length &&
          "Não identificamos os campos necessários no arquivo para realizar a importação. Por favor, verifique o arquivo e tente novamente."}
      </AnimatePresenceWrapper>

      {/* Informações da remessa Modal */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={remessaModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={remessaModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Informações da Remessa</Box>
            <Icon
              as={FiInfo}
              color="white"
              bg="brand1.500"
              rounded="lg"
              shadow="lg"
              boxSize={10}
              p={2}
            />
          </ModalHeader>
          <Divider />
          <ModalBody pb={6}>
            <Stack
              as={chakra.form}
              onSubmit={formRemessaInfo.handleSubmit(importarBenef)}
            >
              <FormMaker>{formRemessaInfoInputs}</FormMaker>
              <HStack justifyContent="flex-end" pt={3}>
                <Button
                  colorScheme="brand1"
                  type="submit"
                  isDisabled={!formRemessaInfo.validation}
                  isLoading={sendingData}
                  loadingText="Aguarde..."
                >
                  Importar
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={remessaModal.onClose}
                >
                  Cancelar
                </Button>
              </HStack>
            </Stack>
          </ModalBody>
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

  const entityCheck = entities.find((ent) => ent === entity || undefined);

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

Importar.auth = true;
Importar.dashboard = true;
