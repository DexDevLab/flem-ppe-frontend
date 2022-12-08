import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Fade,
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
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { TextEditor } from "components/TextEditor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, getBackendRoute } from "services";

export default function TemplateOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [templatesFromBd, setTemplatesFromBd] = useState([]);
  const [tiposFromBd, setTiposFromBd] = useState([]);
  const [parametrosFromBd, setParametrosFromBd] = useState([]);
  const [tituloTemplate, setTituloTemplate] = useState("");
  const addTemplateOficio = useDisclosure();
  const formSubmit = useDisclosure();
  const tipoOficioFormSubmit = useDisclosure();
  const addTipoOficio = useDisclosure();
  const excluirTemplateOficio = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Título do Ofício",
        accessor: "titulo",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "tipo",
        accessor: "tipo.sigla",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
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
                      addTemplateOficio.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirTemplateOficio.onOpen();
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

  const data = useMemo(() => templatesFromBd, [templatesFromBd]);

  const formTemplateOficio = useForm({
    mode: "onChange",
  });

  const formTipoOficio = useForm({
    mode: "onChange",
  });

  const { isValid: formTipoOficioValidation } = useFormState({
    control: formTipoOficio.control,
  });

  const onSubmit = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/oficios`, formData)
          .put(getBackendRoute(entity, "oficios"), formData)
          .then((res) => {
            if (res.status === 200) {
              formSubmit.onClose();
              addTemplateOficio.onClose();
              setSelectedRow(null);
              formTemplateOficio.reset({});
              toast({
                title: "Ofício atualizado com sucesso",
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
                title: "Título já existe",
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
      //.post(`/api/${entity}/oficios`, formData)
      .post(getBackendRoute(entity, "oficios"), formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addTemplateOficio.onClose();
          setSelectedRow(null);
          formTemplateOficio.reset({});
          toast({
            title: "Ofício adicionado com sucesso",
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
            title: "Título já existe",
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

  const onSubmitTipoOficio = (formData, e) => {
    e.preventDefault();
    tipoOficioFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/oficios/tipos`, formData)
      .post(getBackendRoute(entity, "oficios/tipos"), formData)
      .then((res) => {
        if (res.status === 200) {
          tipoOficioFormSubmit.onClose();
          addTipoOficio.onClose();
          setSelectedRow(null);
          formTipoOficio.reset({});
          toast({
            title: "Tipo de ofício adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          tipoOficioFormSubmit.onClose();
          toast({
            title: `Tipo de ofício já existe`,
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

  const deleteTemplateOficio = (formData) => {
    formSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/oficios`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "oficios"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirTemplateOficio.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Ofício excluído com sucesso",
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
  }, [asPath]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/oficios`)
      .get(getBackendRoute(entity, "oficios"))
      .then((res) => {
        if (res.status === 200) {
          setTemplatesFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });

    axios
      //.get(`/api/${entity}/editor-parametros`)
      .get(getBackendRoute(entity, "editor-parametros"))
      .then(({ data, status }) => {
        if (status === 200) {
          setParametrosFromBd(
            data.map(({ id, rotulo }) => ({
              id,
              value: rotulo,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addTemplateOficio.isOpen,
    addTemplateOficio.isOpen,
    excluirTemplateOficio.isOpen,
  ]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/oficios/tipos`)
      .get(getBackendRoute(entity, "oficios/tipos"))
      .then((res) => {
        if (res.status === 200) {
          setTiposFromBd(
            res.data.map((tipo) => ({
              id: tipo.id,
              value: tipo.id,
              label: `${tipo.sigla} - ${tipo.descricao}`,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  }, [addTemplateOficio.isOpen, addTipoOficio.isOpen]);

  useEffect(() => {
    setTituloTemplate(formTemplateOficio.watch("titulo"));
  }, [formTemplateOficio.watch("titulo")]);
  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Templates de Ofícios</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addTemplateOficio.onOpen}
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

      {/* Adicionar template de oficio Overlay  */}
      <Overlay
        onClose={() => {
          addTemplateOficio.onClose();
          formTemplateOficio.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addTemplateOficio.isOpen && !addTipoOficio.isOpen}
        header={
          selectedRow
            ? "Editar Template de Ofício"
            : "Adicionar Template de Ofício"
        }
        closeButton
        size="full"
      >
        <chakra.form
          onSubmit={formTemplateOficio.handleSubmit(onSubmit)}
          w="100%"
        >
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  formControl={formTemplateOficio}
                  label="Tipo do Template"
                  colorScheme="brand1"
                  options={tiposFromBd}
                  placeholder="Selecione..."
                  defaultValue={
                    selectedRow &&
                    tiposFromBd.filter(
                      (tipo) => tipo.id === selectedRow.tipo.id
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
                  onClick={addTipoOficio.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputBox
              id="titulo"
              label="Título do Template"
              formControl={formTemplateOficio}
              defaultValue={selectedRow?.titulo}
            />
            <InputTextBox
              id="descricao"
              label="Descrição"
              formControl={formTemplateOficio}
              defaultValue={selectedRow?.descricao}
              required={false}
            />
            <Fade
              in={tituloTemplate && tituloTemplate.length > 1}
              unmountOnExit
            >
              <Box>
                <TextEditor
                  id="conteudo"
                  label="Template"
                  formControl={formTemplateOficio}
                  loadOnEditor={selectedRow && selectedRow.conteudo}
                  parametros={parametrosFromBd}
                />
              </Box>
            </Fade>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar tipo de oficio Overlay  */}
      <Overlay
        isOpen={addTipoOficio.isOpen}
        onClose={() => {
          addTipoOficio.onClose();
          formTipoOficio.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Ofício"
      >
        <chakra.form
          onSubmit={formTipoOficio.handleSubmit(onSubmitTipoOficio)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="sigla"
              label="Sigla"
              formControl={formTipoOficio}
              onChange={(e) =>
                formTipoOficio.setValue("sigla", e.target.value.toUpperCase())
              }
              maxLength={{
                value: "2",
                message: "A sigla deve conter 2 letras",
              }}
              minLength={{
                value: "2",
                message: "A sigla deve conter 2 letras",
              }}
            />
            <InputBox
              id="descricao"
              label="Descrição"
              formControl={formTipoOficio}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoOficioFormSubmit.isOpen}
              isDisabled={!formTipoOficioValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir template de oficio Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirTemplateOficio.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirTemplateOficio.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Template de Ofício</Box>{" "}
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
                {selectedRow?.titulo}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteTemplateOficio(selectedRow);
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
                    excluirTemplateOficio.onClose();
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

TemplateOficios.auth = true;
TemplateOficios.dashboard = true;
