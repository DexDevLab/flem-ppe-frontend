/**
 * Componentes de tela de gerenciamento de colaboradores da CR
 * @module colaboradores-cr
 */

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
  Stack,
  Text,
  useBoolean,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FormMaker } from "components/Form";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useCustomForm } from "hooks";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Renderiza a tela contendo a lista de colaboradores da Central de Ações
 * @method ColaboradoresCR
 * @memberof module:colaboradores-cr
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function ColaboradoresCR({ entity }) {
  const router = useRouter();
  const { asPath } = router;
  const [loadingPageData, setLoadingPageData] = useBoolean(true);
  const [colaboradoresFromBd, setColaboradoresFromBd] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const toast = useToast({
    duration: 5000,
    isClosable: false,
    position,
  });

  const formAddColabCr = useCustomForm();

  const formDeleteColabCr = useCustomForm();

  const tableColabCrColumns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Login",
        accessor: "login_usuario",
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
                      formAddColabCr.openOverlay();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      formDeleteColabCr.openOverlay();
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

  const tableColabCrData = useMemo(
    () => colaboradoresFromBd,
    [colaboradoresFromBd]
  );

  const onSubmitColabCr = async (formData, e) => {
    e.preventDefault();
    formAddColabCr.setLoading();
    try {
      const { status } = _.isEmpty(selectedRow)
        ? // ? await axios.post(`/api/${entity}/colaboradores-cr`, formData)
          // : await axios.put(`/api/${entity}/colaboradores-cr`, formData, {
          //     params: {
          //       id: selectedRow.id,
          //     },
          //   });
          await axios.post(
            getBackendRoute(entity, "colaboradores-cr"),
            formData
          )
        : await axios.put(
            getBackendRoute(entity, "colaboradores-cr"),
            formData,
            {
              params: {
                id: selectedRow.id,
              },
            }
          );
      if (status === 200) {
        toast({
          title: _.isEmpty(selectedRow)
            ? "Colaborador adicionado com sucesso"
            : "Colaborador atualizado com sucesso",
          status: "success",
        });
        formAddColabCr.closeOverlay();
      }
    } catch (error) {
      // if (err.response.status === 409) {
      //   toast({
      //     title: "Colaborador já existe",
      //     status: "error",
      //   });
      // } else {
      //   throw new Error(err.response.data);
      // }
      const exception = exceptionHandler(error);
      if (exception.code == 409) {
        exception.title = "Colaborador já existe";
        exception.description = "";
        exception.duration = 5000;
      }
      toast(exception);
    } finally {
      formAddColabCr.setLoaded();
    }
  };

  const deleteColabCr = async (formData, e) => {
    e.preventDefault();
    formDeleteColabCr.setLoading();
    try {
      // const { status } = await axios.delete(`/api/${entity}/colaboradores-cr`, {
      //   params: {
      //     id: selectedRow.id,
      //   },
      // });
      const { status } = await axios.delete(
        getBackendRoute(entity, "colaboradores-cr"),
        {
          params: {
            id: selectedRow.id,
          },
        }
      );
      if (status === 200) {
        toast({
          title: "Colaborador excluído com sucesso",
          status: "success",
        });
        formDeleteColabCr.closeOverlay();
      }
    } catch (error) {
      // throw new Error(error.response.data);
      toast(exceptionHandler(error));
    } finally {
      formDeleteColabCr.setLoaded();
    }
  };

  const formAddColabCrInputs = [
    {
      id: "nome",
      label: "Nome",
      formControl: formAddColabCr.control,
      required: "Obrigatório",
    },
    {
      id: "login_usuario",
      label: "Login de Usuário",
      formControl: formAddColabCr.control,
      required: "Obrigatório",
    },
  ];

  useEffect(() => {
    setLoadingPageData.on();
    axios
      //.get(`/api/${entity}/colaboradores-cr`)
      .get(getBackendRoute(entity, "colaboradores-cr"))
      .then((res) => {
        if (res.status === 200) {
          setColaboradoresFromBd(res.data);
        }
      })
      // .catch((error) => {
      //   console.log(error.response.data);
      //   throw new Error(error.response.data);
      // })
      .catch((error) => {
        toast(exceptionHandler(error));
      })
      .finally(setLoadingPageData.off);
  }, [formAddColabCr.overlayIsOpen, formDeleteColabCr.overlayIsOpen]);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
    }
  }, [asPath]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!loadingPageData}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Colaboradores CR</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={formAddColabCr.openOverlay}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={tableColabCrData} columns={tableColabCrColumns} />
      </AnimatePresenceWrapper>

      {/* Adicionar colaborador CR Overlay  */}
      <Overlay
        onClose={formAddColabCr.closeOverlay}
        onCloseComplete={() => {
          formAddColabCr.control.reset({});
          if (selectedRow) {
            setSelectedRow([]);
          }
        }}
        isOpen={formAddColabCr.overlayIsOpen}
        header={
          _.isEmpty(selectedRow)
            ? "Adicionar Colaborador CR"
            : "Editar Colaborador CR"
        }
        closeButton
      >
        <Stack
          as={chakra.form}
          onSubmit={formAddColabCr.handleSubmit(onSubmitColabCr)}
          w="100%"
        >
          <FormMaker data={selectedRow}>{formAddColabCrInputs}</FormMaker>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formAddColabCr.isLoading}
              isDisabled={!formAddColabCr.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </Stack>
      </Overlay>

      {/* Excluir colaborador CR  Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={formDeleteColabCr.overlayIsOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={formDeleteColabCr.closeOverlay}
        onCloseComplete={() => setSelectedRow({})}
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
              <Heading size="md">
                Deseja excluir o seguinte colaborador?
              </Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack
                as={chakra.form}
                onSubmit={formDeleteColabCr.handleSubmit(deleteColabCr)}
              >
                <Button
                  colorScheme="red"
                  variant="outline"
                  type="submit"
                  isLoading={formDeleteColabCr.isLoading}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    formDeleteColabCr.closeOverlay();
                    setSelectedRow({});
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

ColaboradoresCR.auth = true;
ColaboradoresCR.dashboard = true;
