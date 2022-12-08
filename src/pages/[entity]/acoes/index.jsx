import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  ProgressLabel,
  ScaleFade,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { SwitchButton } from "components/Buttons/SwitchButton";
import { InputBox } from "components/Inputs/InputBox";
import { InputTextBox } from "components/Inputs/InputTextBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import ChakraTagInput from "components/Inputs/TagInput";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { cpfMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { maskCapitalize } from "utils";

export default function AcoesCR({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [demandantesFromBd, setAcoesCRFromBd] = useState([]);
  const [tipoAcoesFromBd, setTipoAcoesFromBd] = useState([]);
  const [benefLoteInvalid, setBenefLoteInvalid] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromBd] = useState([]);
  const [beneficiariosFromRh, setBeneficiariosFromBd] = useState([]);
  const [benefLote, setBenefLote] = useState(false);
  const addAcao = useDisclosure();
  const addTipoAcao = useDisclosure();
  const acaoFormSubmit = useDisclosure();
  const tipoAcaoFormSubmit = useDisclosure();
  const excluir = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "codAcao",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Ação",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Atribuído a",
        accessor: "colabCr",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map((colab, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id}>
                    {maskCapitalize(colab.nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id} as="i">
                    e outros {arr.length - idx}...
                  </Text>
                );
              }
            })}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "Beneficiários associados",
        accessor: "benefAssoc",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map((benef, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={benef.id}>
                    {maskCapitalize(benef.nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={benef.id} as="i">
                    e outros {arr.length - idx}...
                  </Text>
                );
              }
            })}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "Status conclusão",
        accessor: "contatos",
        Cell: ({
          value,
          row: {
            original: { benefAssoc },
          },
        }) => {
          const contatosConcluidos = value.filter(
            (contato) => contato.concluido === true
          );
          const status = (100 / benefAssoc.length) * contatosConcluidos.length;
          return (
            <Box w={150}>
              <Progress
                isAnimated={status !== 100}
                hasStripe={status !== 100}
                colorScheme={status !== 100 ? "brand1" : "green"}
                value={status >=0 ? status : 0}
                shadow="inner"
                rounded="md"
                h={6}
              >
                <ProgressLabel
                  fontSize="md"
                  color={
                    (status < 40 && "gray.400") || (status <= 100 && "gray.100")
                  }
                >
                  {status >=0 ? status : 0}%
                  {/* {status}% */}
                </ProgressLabel>
              </Progress>
            </Box>
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
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      addAcao.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluir.onOpen();
                    },
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
    []
  );

  const data = useMemo(() => demandantesFromBd, [demandantesFromBd]);

  const formAcao = useForm({
    mode: "onChange",
  });
  const formTipoAcao = useForm({
    mode: "onChange",
  });

  const { isValid: formAcaoValidation } = useFormState({
    control: formAcao.control,
  });

  const { isValid: formTipoAcaoValidation } = useFormState({
    control: formTipoAcao.control,
  });

  const onSubmitAddAcao = (formData, e) => {
    acaoFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/acoes-cr`, formData)
          .put(getBackendRoute(entity, "acoes-cr"), formData)
          .then((res) => {
            if (res.status === 200) {
              acaoFormSubmit.onClose();
              addAcao.onClose();
              setSelectedRow(null);
              formAcao.reset({});
              toast({
                title: "Ação atualizada com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 409) {
              acaoFormSubmit.onClose();
              toast({
                title: "Ação já existe",
                status: "error",
                duration: 5000,
                isClosable: false,
                position,
              });
            } else {
              throw new Error(error.response.data);
            }
          })
      );
    }
    axios
      //.post(`/api/${entity}/acoes-cr`, formData)
      .post(getBackendRoute(entity, "acoes-cr"), formData)
      .then((res) => {
        if (res.status === 200) {
          acaoFormSubmit.onClose();
          addAcao.onClose();
          setSelectedRow(null);
          formAcao.reset({});
          toast({
            title: "Ação adicionada com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
        acaoFormSubmit.onClose();
      })
      .catch((error) => {
        if (error.response.status === 409) {
          acaoFormSubmit.onClose();
          toast({
            title: "Ação já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          throw new Error(error.response.data);
        }
      });
  };

  const onSubmitTipoAcao = (formData, e) => {
    e.preventDefault();
    tipoAcaoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/acoes-cr/tipos`, formData)
      .post(getBackendRoute(entity, "acoes-cr/tipos"), formData)
      .then((res) => {
        if (res.status === 200) {
          tipoAcaoFormSubmit.onClose();
          addTipoAcao.onClose();
          formTipoAcao.reset({});
          toast({
            title: "Tipo de ação adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          console.log(error.response.data);
          tipoAcaoFormSubmit.onClose();
          toast({
            title: `Tipo de ação já existe`,
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          throw new Error(error.response.data);
        }
      });
  };

  const deleteAcao = (formData) => {
    acaoFormSubmit.onOpen();
    axios
      .delete(getBackendRoute(entity, "acoes-cr"), {
        params: {
          id: formData.id,
        },
      })
      // .delete(`/api/${entity}/acoes-cr`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .then((res) => {
        if (res.status === 200) {
          excluir.onClose();
          acaoFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Ação excluída com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/acoes-cr`)
      .get(getBackendRoute(entity, "acoes-cr"))
      .then((res) => {
        if (res.status === 200) {
          setAcoesCRFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addAcao.isOpen, excluir.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/acoes-cr/tipos`)
      .get(getBackendRoute(entity, "acoes-cr/tipos"))
      .then((res) => {
        if (res.status === 200) {
          setTipoAcoesFromBd(
            res.data.map((tipo) => ({
              id: tipo.id,
              value: tipo.id,
              label: tipo.nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addAcao.isOpen, addTipoAcao.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/colaboradores-cr`)
      .get(getBackendRoute(entity, "colaboradores-cr"))
      .then((res) => {
        if (res.status === 200) {
          setColaboradoresFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: maskCapitalize(nome),
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/beneficiarios`)
      .get(getBackendRoute(entity, "beneficiarios"))
      .then((res) => {
        if (res.status === 200) {
          setBeneficiariosFromBd(
            res.data.map(({ matriculaFlem, nome, cpf }) => ({
              value: matriculaFlem,
              label: `${matriculaFlem} - ` + maskCapitalize(nome),
              cpf: cpf,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const benefLoteInput = formAcao.watch("benefType");

  useEffect(() => {
    setBenefLote(benefLoteInput);
  }, [benefLoteInput]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Ações CR</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addAcao.onOpen}
          >
            Adicionar
          </Button>
        </Flex>
        <ScaleFade in={fetchTableData.isOpen} initialScale={0.9} unmountOnExit>
          <Center h="90vh">
            <Spinner
              boxSize={20}
              color="brand1.500"
              thickness="4px"
              speed=".5s"
              emptyColor="gray.200"
            />
          </Center>
        </ScaleFade>
        <ScaleFade in={!fetchTableData.isOpen} initialScale={0.9} unmountOnExit>
          <Table data={data} columns={columns} />
        </ScaleFade>
      </AnimatePresenceWrapper>

      {/* Adicionar ação Overlay  */}
      <Overlay
        onClose={() => {
          addAcao.onClose();
          formAcao.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addAcao.isOpen && !addTipoAcao.isOpen}
        header={selectedRow ? "Editar Ação" : "Adicionar Ação"}
        closeButton
      >
        <chakra.form onSubmit={formAcao.handleSubmit(onSubmitAddAcao)} w="100%">
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAcao}
              defaultValue={selectedRow?.nome}
            />
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  formControl={formAcao}
                  label="Tipo"
                  colorScheme="brand1"
                  options={tipoAcoesFromBd}
                  placeholder="Selecione..."
                  defaultValue={
                    selectedRow &&
                    tipoAcoesFromBd.filter(
                      (tipo) => tipo.id === selectedRow.tipoAcaoCr_Id
                    )
                  }
                />
              </Box>
              <Box alignSelf="flex-start">
                <Button
                  p={2}
                  mt={8}
                  shadow="md"
                  colorScheme="brand1"
                  onClick={addTipoAcao.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputTextBox
              id="descricao"
              label="Descrição da Ação"
              formControl={formAcao}
              defaultValue={selectedRow?.descricao}
            />
            <SelectInputBox
              id="colabAcaoCR"
              label="Atribuir ação a"
              formControl={formAcao}
              options={colaboradoresFromRh}
              defaultValue={
                selectedRow &&
                colaboradoresFromRh.filter((benef) =>
                  selectedRow.colabCr.find((selec) => selec.cpf === benef.cpf)
                )
              }
              isMulti
            />
            <Box>
              <Flex justifyContent="space-between" flex="0 0 1%" mb={2}>
                <FormLabel ps={0.5} m={0}>
                  Beneficiários Associados
                </FormLabel>
                <Box alignSelf="center">
                  <SwitchButton
                    id="benefType"
                    formControl={formAcao}
                    label="Selecionar em Lote"
                    size="sm"
                  />
                </Box>
              </Flex>
              {!benefLote && (
                <SelectInputBox
                  id="benefAssoc"
                  formControl={formAcao}
                  options={beneficiariosFromRh}
                  isMulti
                  defaultValue={
                    selectedRow &&
                    beneficiariosFromRh.filter((benef) =>
                      selectedRow.benefAssoc.find(
                        (selec) => selec.cpf === benef.cpf
                      )
                    )
                  }
                />
              )}
              {benefLote && (
                <ChakraTagInput
                  id="benefAssoc"
                  formControl={formAcao}
                  placeholder="Matrículas ou CPFs separados por vírgula"
                  mask={cpfMask}
                  defaultValues={benefLoteInvalid}
                />
              )}
            </Box>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={acaoFormSubmit.isOpen}
              isDisabled={!formAcaoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar tipo de ação Overlay  */}
      <Overlay
        isOpen={addTipoAcao.isOpen}
        onClose={() => {
          addTipoAcao.onClose();
          formTipoAcao.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Ação"
      >
        <chakra.form
          onSubmit={formTipoAcao.handleSubmit(onSubmitTipoAcao)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formTipoAcao} />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoAcaoFormSubmit.isOpen}
              isDisabled={!formTipoAcaoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              Cadastrar
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir ação Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluir.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluir.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Ação</Box>
            <Icon
              as={FiTrash2}
              color="white"
              bg="red.500"
              rounded="lg"
              shadow="lg"
              boxSize={10}
              p={2}
            />
          </ModalHeader>
          <Divider />
          <ModalBody pb={6}>
            <VStack my={3} spacing={6}>
              <Heading size="md">Deseja excluir a seguinte ação?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome} - {selectedRow?.descricao}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteAcao(selectedRow);
                  }}
                  isLoading={acaoFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluir.onClose();
                    setSelectedRow(null);
                  }}
                >
                  Cancelar
                </Button>
              </HStack>
            </VStack>
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

AcoesCR.auth = true;
AcoesCR.dashboard = true;
