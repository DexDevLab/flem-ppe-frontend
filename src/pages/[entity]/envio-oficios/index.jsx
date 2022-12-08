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
  IconButton,
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
import { Dropzone } from "components/Dropzone";
import { EmailEditor } from "components/EmailEditor";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import ChakraTagInput from "components/Inputs/TagInput";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { TextViewer } from "components/TextViewer";
import { useCustomForm } from "hooks/useCustomForm";
import { DateTime } from "luxon";
import { cpfMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiEdit,
  FiEye,
  FiMoreHorizontal,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import { axios, filesAPIUpload, getBackendRoute } from "services";
import { maskCapitalize } from "utils";

export default function EnvioOficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [oficiosFromBd, setOficiosFromBd] = useState();
  const [templatesFromBd, setTemplatesFromBd] = useState();
  const [emailsRemetentesFromBd, setEmailsRemetentesFromBd] = useState([]);
  const [parametrosFromBd, setParametrosFromBd] = useState([]);
  const [nomeEvento, setNomeEvento] = useState("");
  const [uploadProgress, setUploadProgress] = useState();
  const [controller, setController] = useState(null);
  const viewTemplate = useDisclosure();
  const formSubmit = useDisclosure();
  const enviarOficioModal = useDisclosure();
  const enviarOficioSubmit = useDisclosure();
  const excluirOficioSubmit = useDisclosure();
  const excluirOficioModal = useDisclosure();
  const formAddOficio = useCustomForm();
  const fetchTableData = useDisclosure();
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });

  const columns = useMemo(
    () => [
      {
        Header: "código",
        accessor: "codOficio",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "adicionado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "assunto",
        accessor: "assunto",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "remetente",
        accessor: "remetenteOficio",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.nome} - {value.email}
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
        Header: "enviado?",
        accessor: "enviosOficios",
        Cell: ({ value, row: { original } }) => (
          <Box minW={200}>
            {value.length === 0 && "Não"}
            {value.length !== 0 &&
              value.length === original.benefAssoc.length &&
              "Sim"}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: ({ row: { original } }) => (
          <MenuIconButton
            isDisabled={
              original.benefAssoc.length !== 0 &&
              original.benefAssoc.length === original.enviosOficios.length
            }
            icon={<FiMoreHorizontal />}
            menuItems={[
              {
                menuGroupLabel: null,
                menuGroupButtons: [
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(original);
                      formAddOficio.openOverlay();
                    },
                  },
                  {
                    text: "Enviar",
                    icon: <FiSend />,
                    onClick: () => {
                      setSelectedRow(original);
                      enviarOficioModal.onOpen();
                    },
                    disabled: original.benefAssoc.length === 0,
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(original);
                      excluirOficioModal.onOpen();
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

  const data = useMemo(() => oficiosFromBd, [oficiosFromBd]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    formAddOficio.setLoading();

    const anexos = new FormData();
    formData.anexos.map((file, idx) => anexos.append(`files`, file));

    const fileUpload = async (data, params) => {
      const config = {
        signal: controller.signal,
        onUploadProgress: (event) => {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
        params,
      };
      const response = await filesAPIUpload.post(`/uploadFile`, data, config);
      return response;
    };

    if (selectedRow) {
      return axios
      // .put(`/api/${entity}/oficios/gerenciar`, formData, {
      //   params: { id: selectedRow.id },
      // })
        .put(getBackendRoute(entity, "oficios/gerenciar"), formData, {
          params: { id: selectedRow.id },
        })
        .then((res) => {
          if (res.status === 200) {
            if (formData.anexos.length) {
              fileUpload(anexos, { referenceObjId: res.data.id }).then(
                async (res) => {
                  // await axios.put(
                  //   `/api/${entity}/oficios/anexos`,
                  //   { anexosId: res.data },
                  //   { params: { id: selectedRow.id } }
                  // );
                  await axios.put(
                    getBackendRoute(entity, "oficios/anexos"),
                    { anexosId: res.data },
                    { params: { id: selectedRow.id } }
                  );
                }
              );
            }
            setSelectedRow(null);
            formAddOficio.setLoaded();
            formAddOficio.closeOverlay();
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
            formAddOficio.setLoaded();
            toast({
              title: "Ofício já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error.response.data);
          }
        });
    }

    axios
      //.post(`/api/${entity}/oficios/gerenciar`, formData)
      .post(getBackendRoute(entity, "oficios/gerenciar"), formData)
      .then((res) => {
        if (res.status === 200) {
          fileUpload(anexos, { referenceObjId: res.data.id }).then(
            async (res) => {
              // await axios.put(
              //   `/api/${entity}/oficios/anexos`,
              //   { anexosId: res.data },
              //   { params: { id: res.data[0].referenceObjId } }
              // );
              await axios.put(
                getBackendRoute(entity, "oficios/anexos"),
                {
                  params: {
                    id: res.data[0].referenceObjId,
                  },
                },
                { anexosId: res.data }
              );
              formAddOficio.setLoaded();
              formAddOficio.closeOverlay();
              setSelectedRow(null);
              toast({
                title: "Ofício adicionado com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
                position,
              });
            }
          );
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          formAddOficio.setLoaded();
          toast({
            title: "Ofício já existe",
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

  const deleteOficio = (formData) => {
    excluirOficioSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/oficios/gerenciar`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(
        getBackendRoute(entity, "oficios/gerenciar"),
        {
          params: {
            id: formData.id,
          },
        },
        { anexosId: res.data }
      )
      .then((res) => {
        if (res.status === 200) {
          excluirOficioModal.onClose();
          excluirOficioSubmit.onClose();
          setSelectedRow(null);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  };

  const onSubmitEnviarOficio = (formData) => {
    enviarOficioSubmit.onOpen();
    axios
      //.post(`/api/${entity}/oficios/enviar`, formData)
      .post(getBackendRoute(entity, "oficios/enviar"), formData)
      .then((res) => {
        if (res.status === 200) {
          enviarOficioSubmit.onClose();
          enviarOficioModal.onClose();
          setSelectedRow(null);
          toast({
            title: "Ofício pronto para envio.",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        throw new Error(error.response.data);
      })
      .finally(() => enviarOficioSubmit.onClose());
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
      //.get(`/api/${entity}/oficios/gerenciar`)
      .get(getBackendRoute(entity, "oficios/gerenciar"))
      .then((res) => {
        if (res.status === 200) {
          setOficiosFromBd(
            res.data.map((row) => ({
              ...row,
              anexosId: JSON.parse(row.anexosId),
            }))
          );
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
    formAddOficio.overlayIsOpen,
    enviarOficioModal.isOpen,
    excluirOficioModal.isOpen,
  ]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/oficios`)
      .get(getBackendRoute(entity, "oficios"))
      .then((res) => {
        if (res.status === 200) {
          const templatesOptions = res.data.map((template) => ({
            id: template.id,
            value: template.id,
            label: `${template.tipo.sigla} - ${template.titulo}`,
            conteudo: template.conteudo,
          }));
          setTemplatesFromBd(templatesOptions);
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
      //.get(`/api/${entity}/comunicados/remetentes`)
      .get(getBackendRoute(entity, "comunicados/remetentes"))
      .then((res) => {
        if (res.status === 200) {
          setEmailsRemetentesFromBd(
            res.data.map(({ id, email, nome }) => ({
              value: id,
              id,
              label: `${nome} - ${email}`,
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

  const formWatchAssunto = formAddOficio.control.watch("assunto");
  const formWatchTemplate = formAddOficio.control.watch("templateOficio");

  useEffect(() => {
    setNomeEvento(formWatchAssunto);
  }, [formWatchAssunto]);

  useEffect(() => {
    setController(new AbortController());
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Envio de Ofícios</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiSend />}
            onClick={formAddOficio.openOverlay}
          >
            Novo Envio
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
          formAddOficio.closeOverlay();
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        size="lg"
        isOpen={formAddOficio.overlayIsOpen}
        header={
          selectedRow ? "Editar Envio de Ofício" : "Adicionar Envio de Ofício"
        }
        closeButton
      >
        <chakra.form onSubmit={formAddOficio.handleSubmit(onSubmit)} w="100%">
          <Stack spacing={4}>
            <SelectInputBox
              id="templateOficio"
              formControl={formAddOficio.control}
              label="Template de Ofício"
              colorScheme="brand1"
              options={templatesFromBd}
              placeholder="Selecione..."
              defaultValue={
                selectedRow
                  ? templatesFromBd &&
                    templatesFromBd.filter(
                      ({ id }) => id === selectedRow.templateOficio_Id
                    )
                  : null
              }
              inputRightElement={
                <IconButton
                  variant="ghost"
                  colorScheme="brand1"
                  aria-label="Ver"
                  h={9}
                  w={4}
                  icon={<FiEye />}
                  isDisabled={!formWatchTemplate}
                  onClick={viewTemplate.onOpen}
                />
              }
            />
            <SelectInputBox
              id="emailRemetente"
              formControl={formAddOficio.control}
              label="Rementente de E-mail"
              colorScheme="brand1"
              options={emailsRemetentesFromBd}
              placeholder="Selecione..."
              defaultValue={
                selectedRow
                  ? emailsRemetentesFromBd &&
                    emailsRemetentesFromBd.filter(
                      ({ id }) => id === selectedRow.remetenteOficio_Id
                    )
                  : null
              }
            />
            <InputBox
              id="assunto"
              label="Assunto"
              formControl={formAddOficio.control}
              defaultValue={selectedRow?.assunto}
            />
          </Stack>
          <Fade in={nomeEvento && nomeEvento.length >= 1} unmountOnExit>
            <Stack spacing={4}>
              <EmailEditor
                id="conteudoEmail"
                title={"Corpo do E-mail "}
                formControl={formAddOficio.control}
                loadOnEditor={selectedRow?.conteudoEmail}
                parametros={parametrosFromBd}
              />
              <Dropzone
                id="anexos"
                label="Anexos"
                formControl={formAddOficio.control}
                onUploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
                uploadController={controller}
                multiple
                defaultValue={
                  Array.isArray(selectedRow?.anexosId)
                    ? selectedRow.anexosId.map(
                        (anexo) => new File([], anexo.name)
                      )
                    : undefined
                }
              />
              <ChakraTagInput
                id="benefAssoc"
                formControl={formAddOficio.control}
                label="Beneficiários"
                placeholder="Matrículas ou CPFs separados por vírgula"
                mask={cpfMask}
                defaultValues={selectedRow?.benefAssoc.map(
                  ({ matriculaFlem }) => ({
                    value: matriculaFlem,
                    label: matriculaFlem,
                    isInvalid: false,
                  })
                )}
              />
            </Stack>
          </Fade>

          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formAddOficio.isLoading}
              isDisabled={!formAddOficio.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* View template de oficio Overlay  */}
      <Overlay
        onClose={viewTemplate.onClose}
        size="full"
        isOpen={viewTemplate.isOpen}
        header="Visualizar Template"
        placement="left"
        closeButton
      >
        <TextViewer
          loadOnEditor={
            templatesFromBd &&
            formWatchTemplate &&
            templatesFromBd.find(
              (template) => template.id === formWatchTemplate
            ).conteudo
          }
        />
      </Overlay>

      {/* Excluir ofício Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirOficioModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirOficioModal.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Ofício</Box>{" "}
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
              <Heading size="md">Deseja excluir o seguinte ofício?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.assunto}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteOficio(selectedRow);
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
                    excluirOficioModal.onClose();
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

      {/* Enviar ofício Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={enviarOficioModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={enviarOficioModal.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Enviar Ofício</Box>
            <Icon
              as={FiSend}
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
            <VStack my={3} spacing={6}>
              <Heading size="md">Deseja enviar o seguinte ofício?</Heading>
              <Text fontSize="xl" align="center">
                #{selectedRow?.codOficio} - {selectedRow?.assunto}
              </Text>
              <HStack>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    onSubmitEnviarOficio(selectedRow);
                  }}
                  isLoading={enviarOficioSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Enviar
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    enviarOficioModal.onClose();
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

EnvioOficios.auth = true;
EnvioOficios.dashboard = true;
