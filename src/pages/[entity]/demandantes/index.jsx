/**
 * Componentes de página de gerenciamento dos demandantes.
 * @module demandantes
 */

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
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Renderiza a tela de demandantes
 * @method Demandantes
 * @memberof module:demandantes
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Demandantes({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const addDemandante = useDisclosure();
  const demandanteFormSubmit = useDisclosure();
  const excluir = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Sigla",
        accessor: "sigla",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Demandante",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
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
                      addDemandante.onOpen();
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

  const formDemandante = useForm({
    mode: "onChange",
  });

  const { isValid: formDemandanteValidation } = useFormState({
    control: formDemandante.control,
  });

  const onSubmitDemandante = (formData, e) => {
    demandanteFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return axios
        .put(getBackendRoute(entity, "demandantes"), formData)
        .then((res) => {
          if (res.status === 200) {
            demandanteFormSubmit.onClose();
            addDemandante.onClose();
            setSelectedRow(null);
            formDemandante.reset({});
            toast({
              title: "Demandante aualizado com sucesso",
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
            demandanteFormSubmit.onClose();
            exception.title = "Demandante já existe";
            exception.description = "";
            exception.duration = 5000;
          }
          toast(exception);
        });
      // .catch((error) => {
      //   console.log("ERROR:", error.response.data);
      //   if (error.response.status === 409) {
      //     demandanteFormSubmit.onClose();
      //     toast({
      //       title: "Demandante já existe",
      //       status: "error",
      //       duration: 5000,
      //       isClosable: false,
      //       position,
      //     });
      //   } else {
      //     throw new Error(error.response.data);
      //   }
      // });
    }
    axios
      .post(getBackendRoute(entity, "demandantes"), formData)
      .then((res) => {
        if (res.status === 200) {
          demandanteFormSubmit.onClose();
          addDemandante.onClose();
          setSelectedRow(null);
          formDemandante.reset({});
          toast({
            title: "Demandante adicionado com sucesso",
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
          demandanteFormSubmit.onClose();
          exception.title = "Demandante já existe";
          exception.description = "";
          exception.duration = 5000;
        }
        toast(exception);
      });
    // .catch((error) => {
    //   console.log("ERROR:", error.response.data);
    //   if (error.response.status === 409) {
    //     demandanteFormSubmit.onClose();
    //     toast({
    //       title: "Demandante já existe",
    //       status: "error",
    //       duration: 5000,
    //       isClosable: false,
    //       position,
    //     });
    //   } else {
    //     throw new Error(error.response.data);
    //   }
    // });
  };

  const deleteDemandante = (formData) => {
    demandanteFormSubmit.onOpen();
    axios
      .delete(getBackendRoute(entity, "demandantes"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluir.onClose();
          demandanteFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Demandante excluído com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        toast(exceptionHandler(error));
      });
    // .catch((error) => {
    //   console.log(error.response.data);
    //   throw new Error(error.response.data);
    // });
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
      .get(getBackendRoute(entity, "demandantes"))
      .then((res) => {
        if (res.status === 200) {
          setDemandantesFromBd(res.data);
        }
      })
      .catch((error) => {
        toast(exceptionHandler(error));
      })
      // .catch((error) => {
      //   console.log(error.response.data);
      //   throw new Error(error.response.data);
      // })
      .finally(fetchTableData.onClose);
  }, [addDemandante.isOpen, excluir.isOpen]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Demandantes</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addDemandante.onOpen}
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

      {/* Adicionar demandante Overlay  */}
      <Overlay
        onClose={() => {
          addDemandante.onClose();
          formDemandante.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addDemandante.isOpen}
        header={selectedRow ? "Editar Demandante" : "Adicionar Demandante"}
        closeButton
      >
        <chakra.form
          onSubmit={formDemandante.handleSubmit(onSubmitDemandante)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="sigla"
              label="Sigla"
              formControl={formDemandante}
              defaultValue={selectedRow?.sigla}
            />
            <InputBox
              id="nome"
              label="Demandante"
              formControl={formDemandante}
              defaultValue={selectedRow?.nome}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={demandanteFormSubmit.isOpen}
              isDisabled={!formDemandanteValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir demandante Modal  */}
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
            <Box>Excluir Demandante</Box>
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
              <Heading size="md">Deseja excluir o seguinte demandante?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.sigla} - {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteDemandante(selectedRow);
                  }}
                  isLoading={demandanteFormSubmit.isOpen}
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

Demandantes.auth = true;
Demandantes.dashboard = true;
