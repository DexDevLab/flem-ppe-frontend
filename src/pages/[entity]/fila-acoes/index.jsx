import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  ProgressLabel,
  ScaleFade,
  Spinner,
  Stack,
  Tag,
  TagLabel,
  Text,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { CheckboxInput } from "components/Inputs/CheckboxInput";
import { InputTextBox } from "components/Inputs/InputTextBox";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiCheck, FiMenu, FiMinusCircle, FiPhoneCall } from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { maskCapitalize } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Renderiza a Fila de Ações da CR para os beneficiários da CR
 * @memberof module:fila-acoes
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function FilaAcoesCR({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedBenef, setSelectedBenef] = useState(null);
  const [acoesFromBd, setAcoesCRFromBd] = useState([]);
  const [selectedAcaoFromBd, setSelectedAcaoFromBd] = useState([]);
  const addAcao = useDisclosure();
  const contatoAcaoFormSubmit = useDisclosure();
  const getAcaoDetails = useDisclosure();
  const fetchTableData = useDisclosure();
  const excluir = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
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
          const status =
            (100 / benefAssoc.length) * contatosConcluidos.length || 0;
          return (
            <Box w={150}>
              <Progress
                isAnimated={status !== 100}
                hasStripe={status !== 100}
                colorScheme={status !== 100 ? "brand1" : "green"}
                value={status >= 0 ? status : 0}
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
                  {status >= 0 ? status : 0}%
                </ProgressLabel>
              </Progress>
            </Box>
          );
        },
        Footer: false,
      },
      {
        Header: "Detalhes",
        Cell: (props) => (
          <Center>
            <IconButton
              icon={<FiMenu />}
              onClick={() => {
                setSelectedRow(props?.row?.original);
                addAcao.onOpen();
              }}
              variant="outline"
              colorScheme="brand1"
            />
          </Center>
        ),
        Footer: false,
      },
    ],

    []
  );

  const columnsOverlay = useMemo(
    () => [
      {
        Header: "Matrícula",
        accessor: "matriculaFlem",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Beneficiário",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{maskCapitalize(value)}</Box>,
        Footer: false,
      },
      {
        Header: "Contato efetuado",
        accessor: "contatosAcoes",
        Cell: ({ value }) => {
          const contatoEfetuado =
            value.find((acao) => acao.acaoCr_id === selectedRow.id)
              ?.concluido || false;
          return (
            <Tag
              borderRadius="full"
              variant="subtle"
              colorScheme={contatoEfetuado === true ? "green" : "orange"}
              shadow="inner"
            >
              <Icon
                as={contatoEfetuado === true ? FiCheck : FiMinusCircle}
                boxSize={4}
              />
              <TagLabel ms={1}>
                {contatoEfetuado === true ? "Sim" : "Não"}
              </TagLabel>
            </Tag>
          );
        },
        Footer: false,
      },
      {
        Header: "Detalhes",
        Cell: (props) => (
          <Flex ps={[3.5]}>
            <IconButton
              icon={<FiMenu />}
              onClick={() => {
                setSelectedBenef(props?.row?.original);
              }}
              variant="outline"
              colorScheme="brand1"
            />
          </Flex>
        ),
        Footer: false,
      },
    ],
    [selectedAcaoFromBd]
  );

  const data = useMemo(() => acoesFromBd, [acoesFromBd]);

  const formContatoAcao = useForm({
    mode: "onChange",
  });

  const { isValid: formContatoAcaoValidation } = useFormState({
    control: formContatoAcao.control,
  });

  const onSubmitContatoAcao = (formData, e) => {
    contatoAcaoFormSubmit.onOpen();
    e.preventDefault();

    const contatoAcao = selectedBenef.contatosAcoes.find(
      (acao) => acao.acaoCr_id === selectedRow.id
    );
    formData.acaoCR = selectedRow;
    formData.benef = selectedBenef;

    if (contatoAcao) {
      formData.contatoAcao = contatoAcao;
      return (
        axios
          //.put(`/api/${entity}/fila-acoes`, formData)
          .put(getBackendRoute(entity, "fila-acoes"), formData)
          .then((res) => {
            if (res.status === 200) {
              contatoAcaoFormSubmit.onClose();
              setSelectedBenef(null);
              formContatoAcao.reset({});
              toast({
                title: "Ação aualizada com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          })
          .catch((error) => {
            const exception = exceptionHandler(error);
            if (exception.code == 409) {
              contatoAcaoFormSubmit.onClose();
              exception.title = "Ação já existe";
              exception.description = "";
              exception.duration = 5000;
            }
            toast(exception);
            // if (error.response.status === 409) {
            //   contatoAcaoFormSubmit.onClose();
            //   toast({
            //     title: "Ação já existe",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: false,
            //     position,
            //   });
            // } else {
            //   throw new Error(error.response.data);
            // }
          })
      );
    }
    axios
      //.post(`/api/${entity}/fila-acoes`, formData)
      .post(getBackendRoute(entity, "fila-acoes"), formData)
      .then((res) => {
        if (res.status === 200) {
          contatoAcaoFormSubmit.onClose();
          setSelectedBenef(null);
          formContatoAcao.reset({});
          toast({
            title: "Informação inserida com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
        contatoAcaoFormSubmit.onClose();
      })
      .catch((error) => {
        const exception = exceptionHandler(error);
        if (exception.code == 409) {
          contatoAcaoFormSubmit.onClose();
          exception.title = "Informação já existe";
          exception.description = "";
          exception.duration = 5000;
        }
        toast(exception);
        // if (error.response.status === 409) {
        //   contatoAcaoFormSubmit.onClose();
        //   toast({
        //     title: "Informação já existe",
        //     status: "error",
        //     duration: 5000,
        //     isClosable: false,
        //     position,
        //   });
        // } else {
        //   throw new Error(error.response.data);
        // }
      });
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
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
        toast(exceptionHandler(error));
      })
      .finally(fetchTableData.onClose);
  }, [addAcao.isOpen, excluir.isOpen]);

  useEffect(() => {
    if (selectedRow) {
      getAcaoDetails.onOpen();
      axios
        //.get(`/api/${entity}/acoes-cr`, { params: { id: selectedRow.id } })
        .get(getBackendRoute(entity, "acoes-cr"), {
          params: {
            id: selectedRow.id,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setSelectedAcaoFromBd(res.data[0].benefAssoc);
          }
        })
        .catch((error) => {
          toast(exceptionHandler(error));
        })
        .finally(getAcaoDetails.onClose);
    }
  }, [selectedRow, selectedBenef]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          pb={5}
          minH="60px"
        >
          <Heading fontSize="1.4rem">Fila de Ações CR</Heading>
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

      {/* Listar beneficiarios da ação Overlay  */}
      <Overlay
        onClose={() => {
          addAcao.onClose();
          formContatoAcao.reset({});
          if (selectedRow) {
            setSelectedRow(null);
            setSelectedAcaoFromBd([]);
          }
        }}
        isOpen={addAcao.isOpen}
        header="Detalhes da Ação"
        closeButton
        size="xl"
      >
        <ScaleFade in={getAcaoDetails.isOpen} initialScale={0.9} unmountOnExit>
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
        <ScaleFade in={!getAcaoDetails.isOpen} initialScale={0.9}>
          <Table
            data={selectedAcaoFromBd && selectedAcaoFromBd}
            columns={columnsOverlay}
          />
        </ScaleFade>
        <Modal
          closeOnOverlayClick={false}
          closeOnEsc={false}
          isOpen={selectedBenef}
          isCentered
          size="2xl"
          trapFocus={false}
          onCloseComplete={() => formContatoAcao.reset({})}
        >
          <ModalOverlay bg="blackAlpha.400" />
          <ModalContent>
            <chakra.form
              onSubmit={formContatoAcao.handleSubmit(onSubmitContatoAcao)}
            >
              <ModalHeader
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Text>
                    Contatar Beneficiário:
                    {selectedBenef &&
                      ` ${selectedBenef.matriculaFlem} - ${maskCapitalize(
                        selectedBenef.nome
                      )}`}
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    Ação #{selectedRow && selectedRow.codAcao} -{" "}
                    {selectedRow && selectedRow.nome}
                  </Text>
                </Box>
                <Icon
                  as={FiPhoneCall}
                  color="white"
                  bg="brand1.500"
                  rounded="lg"
                  shadow="lg"
                  boxSize={10}
                  p={2}
                />
              </ModalHeader>
              <Divider />
              <ModalBody m={4} p={0}>
                <Stack spacing={4}>
                  <HStack justifyContent="space-between">
                    <Stack w="50%">
                      <Heading size="sm" alignSelf="start">
                        Informações do Beneficiário
                      </Heading>
                      <Box>
                        <Box>
                          <Text as="span" fontWeight="bold">
                            Nome:
                          </Text>{" "}
                          {maskCapitalize(selectedBenef?.nome)}
                        </Box>
                        <Box>
                          <Text as="span" fontWeight="bold">
                            Matrícula:
                          </Text>{" "}
                          {selectedBenef?.matriculaFlem}
                        </Box>
                        <Box>
                          <Text as="span" fontWeight="bold">
                            Telefone:
                          </Text>{" "}
                          (71) 98765-4321
                        </Box>
                      </Box>
                    </Stack>
                    <Stack w="50%" alignSelf="flex-start">
                      <Heading size="sm" alignSelf="start">
                        Informações da Ação
                      </Heading>
                      <Box>
                        <Box>
                          <Text as="span" fontWeight="bold">
                            Nome:
                          </Text>{" "}
                          {maskCapitalize(selectedRow?.nome)}
                        </Box>
                        <Box>
                          <Text as="span" fontWeight="bold">
                            Descrição:
                          </Text>{" "}
                          {selectedRow?.descricao}
                        </Box>
                      </Box>
                    </Stack>
                  </HStack>
                  <Divider pt={3} />
                  <Box w="50%">
                    <CheckboxInput
                      id="contatoRealizado"
                      label="Contato efetuado com sucesso?"
                      w="25%"
                      formControl={formContatoAcao}
                      options={[
                        { id: "true", label: "Sim" },
                        { id: "false", label: "Não" },
                      ]}
                    />{" "}
                  </Box>
                  <InputTextBox
                    id="descricao"
                    label="Descrição"
                    formControl={formContatoAcao}
                  />
                </Stack>
              </ModalBody>
              <ModalFooter>
                <HStack>
                  <Button
                    colorScheme="brand1"
                    type="submit"
                    isLoading={contatoAcaoFormSubmit.isOpen}
                    loadingText="Aguarde"
                    isDisabled={!formContatoAcaoValidation}
                  >
                    Salvar
                  </Button>
                  <Button
                    colorScheme="brand1"
                    variant="outline"
                    onClick={() => {
                      setSelectedBenef(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </HStack>
              </ModalFooter>{" "}
            </chakra.form>
          </ModalContent>
        </Modal>
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

  return {
    props: {
      entity: entityCheck || null,
    },
  };
}

FilaAcoesCR.auth = true;
FilaAcoesCR.dashboard = true;
