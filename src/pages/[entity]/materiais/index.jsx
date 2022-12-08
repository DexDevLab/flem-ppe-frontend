/**
 * Página de Materiais
 * @module materiais
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
import { InputTextBox } from "components/Inputs/InputTextBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";

/**
 * Renderiza o cadastro de materiais
 * @method Cadastro
 * @memberof module:materiais
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns página renderizada
 */
export default function Cadastro({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [materiaisFromBd, setMateriaisFromBd] = useState([]);
  const addMaterial = useDisclosure();
  const excluirMaterial = useDisclosure();
  const formSubmit = useDisclosure();
  const fetchTableData = useDisclosure();
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });

  const columns = useMemo(
    () => [
      {
        Header: "Material",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
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
                      addMaterial.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirMaterial.onOpen();
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

  const data = useMemo(() => materiaisFromBd, [materiaisFromBd]);

  const formAddMaterial = useForm({
    mode: "onChange",
  });

  const { isValid: formAddMaterialValidation } = useFormState({
    control: formAddMaterial.control,
  });

  const onSubmitMaterial = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/materiais`, formData)
          .put(getBackendRoute(entity, "materiais"), formData)
          .then((res) => {
            if (res.status === 200) {
              formSubmit.onClose();
              addMaterial.onClose();
              setSelectedRow(null);
              formAddMaterial.reset({});
              toast({
                title: "Material atualizado com sucesso",
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
                title: "Material já existe",
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
      //.post(`/api/${entity}/materiais`, formData)
      .post(getBackendRoute(entity, "materiais"), formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addMaterial.onClose();
          setSelectedRow(null);
          formAddMaterial.reset({});
          toast({
            title: "Material adicionado com sucesso",
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
            title: "Material já existe",
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

  const deleteMaterial = (formData) => {
    formSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/materiais`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "materiais"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirMaterial.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Material excluído com sucesso",
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
      //.get(`/api/${entity}/materiais`)
      .get(getBackendRoute(entity, "materiais"))
      .then((res) => {
        if (res.status === 200) {
          setMateriaisFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMaterial.isOpen, excluirMaterial.isOpen]);

  return (
    <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
      <Flex justifyContent="space-between" alignItems="center" pb={5}>
        <Heading fontSize="1.4rem">Materiais</Heading>
        <Button
          colorScheme="brand1"
          shadow="md"
          leftIcon={<FiPlus />}
          onClick={addMaterial.onOpen}
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

      {/* Adicionar/editar material Overlay  */}
      <Overlay
        onClose={() => {
          addMaterial.onClose();
          if (selectedRow) {
            setSelectedRow(null);
          }
          formAddMaterial.reset({});
        }}
        isOpen={addMaterial.isOpen}
        header={selectedRow ? "Editar Material" : "Adicionar Material"}
        closeButton
      >
        <chakra.form onSubmit={formAddMaterial.handleSubmit(onSubmitMaterial)}>
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome do Material"
              formControl={formAddMaterial}
              defaultValue={selectedRow?.nome}
            />
            <InputTextBox
              id="descricao"
              label="Descrição"
              formControl={formAddMaterial}
              required={false}
              defaultValue={selectedRow?.descricao}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddMaterialValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir material Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirMaterial.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirMaterial.onClose}
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
              <Heading size="md">Deseja excluir o seguinte template?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteMaterial(selectedRow);
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
                    excluirMaterial.onClose();
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
    </AnimatePresenceWrapper>
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

Cadastro.auth = true;
Cadastro.dashboard = true;
