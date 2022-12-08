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

export default function SituacoesDeVaga({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [situacoesFromBd, setSituacoesFromBd] = useState([]);
  const [tiposSituacoesFromBd, setTiposSituacoesFromBd] = useState([]);
  const addSituacao = useDisclosure();
  const addTipoSituacao = useDisclosure();
  const situacaoFormSubmit = useDisclosure();
  const tipoSituacaoFormSubmit = useDisclosure();
  const excluir = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Situação",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Tipo",
        accessor: "tipoSituacao.nome",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: (props) => (
          // <IconButton
          //   icon={<FiMoreHorizontal />}
          //   onClick={() => setSelectedRow(props?.row?.original)}
          //   variant="outline"
          //   colorScheme="brand1"
          // />

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
                      addSituacao.onOpen();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const data = useMemo(() => situacoesFromBd, [situacoesFromBd]);

  const formSituacaoVaga = useForm({
    mode: "onChange",
  });

  const formTipoSituacaoVaga = useForm({
    mode: "onChange",
  });

  const { isValid: formSituacaoVagaValidation } = useFormState({
    control: formSituacaoVaga.control,
  });

  const { isValid: formTipoSituacaoVagaValidation } = useFormState({
    control: formTipoSituacaoVaga.control,
  });

  const onSubmitSituacao = (formData, e) => {
    situacaoFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/situacoes-vaga`, formData)
          .put(getBackendRoute(entity, "situacoes-vaga"), formData)
          .then((res) => {
            if (res.status === 200) {
              situacaoFormSubmit.onClose();
              addSituacao.onClose();
              setSelectedRow(null);
              formSituacaoVaga.reset({});
              toast({
                title: "Situação de vaga atualizada com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 409) {
              situacaoFormSubmit.onClose();
              toast({
                title: "Situação de vaga já existe",
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
      //.post(`/api/${entity}/situacoes-vaga`, formData)
      .post(getBackendRoute(entity, "situacoes-vaga"), formData)
      .then((res) => {
        if (res.status === 200) {
          situacaoFormSubmit.onClose();
          addSituacao.onClose();
          setSelectedRow(null);
          formSituacaoVaga.reset({});
          toast({
            title: "Situação de vaga adicionada com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          situacaoFormSubmit.onClose();
          toast({
            title: "Situação de vaga já existe",
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

  const onSubmitTipoSituacao = (formData, e) => {
    e.preventDefault();
    tipoSituacaoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/situacoes-vaga/tipos`, formData)
      .post(getBackendRoute(entity, "situacoes-vaga/tipos"), formData)
      .then((res) => {
        if (res.status === 200) {
          tipoSituacaoFormSubmit.onClose();
          addTipoSituacao.onClose();
          setSelectedRow(null);
          formTipoSituacaoVaga.reset({});
          toast({
            title: "Tipo de situação adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          tipoSituacaoFormSubmit.onClose();
          toast({
            title: "Tipo de situação já existe",
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

  const deleteSituacaoVaga = (formData) => {
    situacaoFormSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/situacoes-vaga`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "situacoes-vaga"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluir.onClose();
          situacaoFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Situação excluída com sucesso",
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
      //.get(`/api/${entity}/situacoes-vaga`)
      .get(getBackendRoute(entity, "situacoes-vaga"))
      .then((res) => {
        if (res.status === 200) {
          setSituacoesFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addSituacao.isOpen, addSituacao.isOpen, excluir.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/situacoes-vaga/tipos`)
      .get(getBackendRoute(entity, "situacoes-vaga/tipos"))
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setTiposSituacoesFromBd(
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
  }, [addSituacao.isOpen, addTipoSituacao.isOpen]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Situações de Vaga</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addSituacao.onOpen}
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

      {/* Adicionar situação de vaga Overlay  */}
      <Overlay
        onClose={() => {
          addSituacao.onClose();
          formSituacaoVaga.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addSituacao.isOpen && !addTipoSituacao.isOpen}
        header={
          selectedRow ? "Editar Situação de Vaga" : "Adicionar Situação de Vaga"
        }
        closeButton
      >
        <chakra.form
          onSubmit={formSituacaoVaga.handleSubmit(onSubmitSituacao)}
          w="100%"
        >
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  formControl={formSituacaoVaga}
                  label="Tipo de Situação"
                  colorScheme="brand1"
                  options={tiposSituacoesFromBd}
                  placeholder="Selecione..."
                  defaultValue={
                    selectedRow &&
                    tiposSituacoesFromBd.filter(
                      (tipo) => tipo.value === selectedRow.tipoSituacao.id
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
                  onClick={addTipoSituacao.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputBox
              id="situacao"
              label="Situação"
              formControl={formSituacaoVaga}
              defaultValue={selectedRow?.nome}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={situacaoFormSubmit.isOpen}
              isDisabled={!formSituacaoVagaValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar tipo de situação de vaga Overlay  */}
      <Overlay
        isOpen={addTipoSituacao.isOpen}
        onClose={() => {
          addTipoSituacao.onClose();
          formTipoSituacaoVaga.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Situação"
      >
        <chakra.form
          onSubmit={formTipoSituacaoVaga.handleSubmit(onSubmitTipoSituacao)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formTipoSituacaoVaga}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoSituacaoFormSubmit.isOpen}
              isDisabled={!formTipoSituacaoVagaValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir situação de vaga Modal  */}
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
            <Box>Excluir Situação</Box>{" "}
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
              <Heading size="md">Deseja excluir a seguinte situação?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteSituacaoVaga(selectedRow);
                    setSelectedRow(null);
                  }}
                  isLoading={situacaoFormSubmit.isOpen}
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

SituacoesDeVaga.auth = true;
SituacoesDeVaga.dashboard = true;
