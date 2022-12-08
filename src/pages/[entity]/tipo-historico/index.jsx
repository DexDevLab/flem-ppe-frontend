/**
 * Página de Tipos de Histórico
 * @module tipos-historico
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
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FormMaker } from "components/Form";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useCustomForm } from "hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";

/**
 * Renderiza o cadastro de tipos de histórico
 * @method TipoHistorico
 * @memberof module:tipo-historico
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns página renderizada
 */
export default function TipoHistorico({ entity, ...props }) {
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [tiposHistoricoFromBd, setTiposHistoricoFromBd] = useState([]);
  const fetchTableData = useDisclosure();
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const formTipoHistorico = useCustomForm();
  const formDeleteTipoHistorico = useCustomForm();

  const columns = useMemo(
    () => [
      {
        Header: "descrição",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "sigiloso",
        accessor: "sigiloso",
        Cell: ({ value }) => <Box minW={200}>{value ? "Sim" : "Não"}</Box>,
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
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      formDeleteTipoHistorico.openOverlay();
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

  const data = useMemo(() => tiposHistoricoFromBd, [tiposHistoricoFromBd]);

  const formTipoHistoricoInputs = [
    {
      id: "nome",
      label: "Nome",
      formControl: formTipoHistorico.control,
    },
    {
      id: "tipoHist",
      label: "Tipo de Histórico Sigiloso?",
      formControl: formTipoHistorico.control,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
    },
  ];

  const onSubmitTipoHistorico = (formData, e) => {
    formTipoHistorico.setLoading();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/tipo-historico`, formData)
          .put(getBackendRoute(entity, "tipo-historico"), formData)
          .then((res) => {
            if (res.status === 200) {
              formTipoHistorico.closeOverlay();
              setSelectedRow(null);
              toast({
                title: "Tipo atualizado com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.status === 409) {
              formSubmit.onClose();
              toast({
                title: "Tipo já existe",
                status: "error",
                duration: 5000,
                isClosable: false,
                position,
              });
            } else {
              formTipoHistorico.setLoaded();
              throw new Error(error.response.data);
            }
          })
      );
    }
    axios
      //.post(`/api/${entity}/tipo-historico`, formData)
      .post(getBackendRoute(entity, "tipos-historico"), formData)
      .then((res) => {
        if (res.status === 200) {
          formTipoHistorico.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Tipo de Histórico adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 409) {
          toast({
            title: "Tipo de Histórico já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          throw new Error(error.response.data);
        }
      })
      .finally(formTipoHistorico.setLoaded);
  };

  const deleteTipoHistorico = (formData) => {
    formDeleteTipoHistorico.setLoading();
    axios
      // .delete(`/api/${entity}/tipo-historico`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "tipos-historico"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          formDeleteTipoHistorico.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Tipo de histórico excluído com sucesso",
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
      })
      .finally(formDeleteTipoHistorico.setLoaded);
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/tipo-historico`)
      .get(getBackendRoute(entity, "tipos-historico"))
      .then((res) => {
        if (res.status === 200) {
          setTiposHistoricoFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
  }, [formTipoHistorico.overlayIsOpen, formDeleteTipoHistorico.overlayIsOpen]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!fetchTableData.isOpen}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Tipos de Histórico</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={formTipoHistorico.openOverlay}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={data} columns={columns} />
      </AnimatePresenceWrapper>

      {/* Adicionar tipo de histórico Overlay  */}
      <Overlay
        onClose={formTipoHistorico.closeOverlay}
        isOpen={formTipoHistorico.overlayIsOpen}
        header="Adicionar Tipo de Histórico"
        closeButton
      >
        <chakra.form
          onSubmit={formTipoHistorico.handleSubmit(onSubmitTipoHistorico)}
        >
          <Stack spacing={2}>
            <FormMaker>{formTipoHistoricoInputs}</FormMaker>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formTipoHistorico.isLoading}
              isDisabled={!formTipoHistorico.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir tipo de histórico Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={formDeleteTipoHistorico.overlayIsOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={formDeleteTipoHistorico.closeOverlay}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Tipo de Histórico</Box>
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
                Deseja excluir o seguinte tipo de histórico?
              </Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteTipoHistorico(selectedRow);
                    setSelectedRow(null);
                  }}
                  isLoading={formDeleteTipoHistorico.isLoading}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    formDeleteTipoHistorico.closeOverlay();
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

/**
 * @method getServerSideProps
 * @param {*} context
 * @returns
 */
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

TipoHistorico.auth = true;
TipoHistorico.dashboard = true;
