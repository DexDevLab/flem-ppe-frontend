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
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";

export default function Formacoes({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [formacoesFromBd, setFormacoesFromBd] = useState();
  const [eixosFromBd, setEixosFromBd] = useState();
  const addFormacao = useDisclosure();
  const formSubmit = useDisclosure();
  const eixoFormacaoFormSubmit = useDisclosure();
  const addEixoFormacao = useDisclosure();
  const excluirFormacao = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Formação",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "eixo",
        accessor: "eixo.nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
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
                      addFormacao.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirFormacao.onOpen();
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

  const data = useMemo(() => formacoesFromBd, [formacoesFromBd]);

  const formAddFormacao = useForm({
    mode: "onChange",
  });

  const formAddEixoFormacao = useForm({
    mode: "onChange",
  });

  const { isValid: formAddFormacaoValidation } = useFormState({
    control: formAddFormacao.control,
  });

  const { isValid: formAddEixoFormacaoValidation } = useFormState({
    control: formAddEixoFormacao.control,
  });

  const onSubmitFormacao = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/formacoes`, formData)
          .put(getBackendRoute(entity, "formacoes"), formData)
          .then((res) => {
            if (res.status === 200) {
              formSubmit.onClose();
              addFormacao.onClose();
              setSelectedRow(null);
              formAddFormacao.reset({});
              toast({
                title: "Formação atualizada com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 409) {
              formSubmit.onClose();
              toast({
                title: "Formação já existe",
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
      //.post(`/api/${entity}/formacoes`, formData)
      .post(getBackendRoute(entity, "formacoes"), formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addFormacao.onClose();
          setSelectedRow(null);
          formAddFormacao.reset({});
          toast({
            title: "Formação adicionada com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          formSubmit.onClose();
          toast({
            title: "Formação já existe",
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

  const onSubmitEixoFormacao = (formData, e) => {
    e.preventDefault();
    eixoFormacaoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/formacoes/eixos`, formData)
      .post(getBackendRoute(entity, "formacoes/eixos"), formData)
      .then((res) => {
        if (res.status === 200) {
          eixoFormacaoFormSubmit.onClose();
          addEixoFormacao.onClose();
          setSelectedRow(null);
          formAddEixoFormacao.reset({});
          toast({
            title: "Eixo de formação adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          eixoFormacaoFormSubmit.onClose();
          toast({
            title: "Eixo já existe",
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

  const deleteFormacao = (formData) => {
    formSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/formacoes`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "formacoes"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirFormacao.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Formação excluída com sucesso",
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
      //.get(`/api/${entity}/formacoes`)
      .get(getBackendRoute(entity, "formacoes"))
      .then((res) => {
        if (res.status === 200) {
          setFormacoesFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFormacao.isOpen, addFormacao.isOpen, excluirFormacao.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/formacoes/eixos`)
      .get(getBackendRoute(entity, "formacoes/eixos"))
      .then((res) => {
        if (res.status === 200) {
          setEixosFromBd(
            res.data.map((eixo) => ({
              id: eixo.id,
              value: eixo.id,
              label: eixo.nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addFormacao.isOpen, addEixoFormacao.isOpen]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Formações</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addFormacao.onOpen}
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

      {/* Adicionar formação Overlay  */}
      <Overlay
        onClose={() => {
          addFormacao.onClose();
          formAddFormacao.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addFormacao.isOpen && !addEixoFormacao.isOpen}
        header={selectedRow ? "Editar Formação" : "Adicionar Formação"}
        closeButton
      >
        <chakra.form
          onSubmit={formAddFormacao.handleSubmit(onSubmitFormacao)}
          w="100%"
        >
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="eixo"
                  formControl={formAddFormacao}
                  label="Eixo de Formação"
                  colorScheme="brand1"
                  options={eixosFromBd}
                  placeholder="Selecione..."
                  defaultValue={
                    selectedRow
                      ? eixosFromBd &&
                        eixosFromBd.filter(
                          (eixo) => eixo.id === selectedRow.eixo.id
                        )
                      : null
                  }
                />
              </Box>
              <Box alignSelf="flex-start">
                <Button
                  p={2}
                  mt={8}
                  shadow="md"
                  colorScheme="brand1"
                  onClick={addEixoFormacao.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputBox
              id="formacao"
              label="Nome da Formação"
              formControl={formAddFormacao}
              defaultValue={selectedRow?.nome}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddFormacaoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar eixo de formação Overlay  */}
      <Overlay
        isOpen={addEixoFormacao.isOpen}
        onClose={() => {
          addEixoFormacao.onClose();
          formAddEixoFormacao.reset({});
        }}
        closeButton
        header="Adicionar Eixo de Formação"
      >
        <chakra.form
          onSubmit={formAddEixoFormacao.handleSubmit(onSubmitEixoFormacao)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="eixo"
              label="Nome"
              formControl={formAddEixoFormacao}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={eixoFormacaoFormSubmit.isOpen}
              isDisabled={!formAddEixoFormacaoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir formaçãO Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirFormacao.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirFormacao.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Formação</Box>{" "}
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
              <Heading size="md">Deseja excluir a seguinte formação?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteFormacao(selectedRow);
                    setSelectedRow(null);
                  }}
                  isLoading={formSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluirFormacao.onClose();
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

Formacoes.auth = true;
Formacoes.dashboard = true;
