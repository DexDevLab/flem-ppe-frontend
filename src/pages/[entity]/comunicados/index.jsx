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
import { Dropzone } from "components/Dropzone";
import { EmailEditor } from "components/EmailEditor";
import { InputBox } from "components/Inputs/InputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import ChakraTagInput from "components/Inputs/TagInput";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { DateTime } from "luxon";
import { cpfMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import {
  FiEdit,
  FiMoreHorizontal,
  FiPlus,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import { axios, filesAPIUpload, getBackendRoute } from "services";
import { maskCapitalize } from "utils"; 

export default function Comunicados({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [comunicadosFromBd, setComunicadosFromBd] = useState([]);
  const [emailsRemetentesFromBd, setEmailsRemetentesFromBd] = useState([]);
  const [parametrosFromBd, setParametrosFromBd] = useState([]);
  const [nomeEvento, setNomeEvento] = useState("");
  const [uploadProgress, setUploadProgress] = useState();
  const [controller, setController] = useState(null);
  const addComunicado = useDisclosure();
  const addEmailRemetente = useDisclosure();
  const enviarComunicado = useDisclosure();
  const comunicadoFormSubmit = useDisclosure();
  const emailRemetenteFormSubmit = useDisclosure();
  const enviarComunicadoFormSubmit = useDisclosure();
  const excluirComunicado = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "código",
        accessor: "codComunicado",
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
        accessor: "remetenteComunicado",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value?.nome} - {value?.email}
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
        accessor: "enviosComunicados",
        Cell: ({ value, row: { original } }) => (
          <Box minW={200}>
            {value.length === 0 && "Não"}
            {value.length !== 0 &&
              value.length === original?.benefAssoc.length &&
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
              original.benefAssoc.length === original?.enviosOficios?.length
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
                      addComunicado.onOpen();
                    },
                  },
                  {
                    text: "Enviar",
                    icon: <FiSend />,
                    onClick: () => {
                      setSelectedRow(original);
                      enviarComunicado.onOpen();
                    },
                    // disabled: original.benefAssoc.length === 0,
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(original);
                      excluirComunicado.onOpen();
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

  const data = useMemo(() => comunicadosFromBd, [comunicadosFromBd]);

  const formComunicado = useForm({
    mode: "onChange",
  });

  const formEmailRemetente = useForm({
    mode: "onChange",
  });

  const { isValid: formComunicadoValidation } = useFormState({
    control: formComunicado.control,
  });

  const { isValid: formEmailRemetenteValidation } = useFormState({
    control: formEmailRemetente.control,
  });

  const onSubmitComunicado = (formData, e) => {
    comunicadoFormSubmit.onOpen();
    e.preventDefault();

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
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/comunicados`, formData)
          .put(getBackendRoute(entity, "comunicados"), formData)
          .then((res) => {
            if (res.status === 200) {
              fileUpload(anexos, { referenceObjId: res.data.id }).then(
                async (res) => {
                  // await axios.put(
                  //   `/api/${entity}/comunicados/anexos`,
                  //   { anexosId: res.data },
                  //   { params: { id: selectedRow.id } }
                  // );
                  await axios.put(
                    getBackendRoute(entity, "comunicados/anexos"),
                    { anexosId: res.data },
                    {
                      params: {
                        id: selectedRow.id,
                      },
                    },
                  );
                  comunicadoFormSubmit.onClose();
                  addComunicado.onClose();
                  setSelectedRow(null);
                  formComunicado.reset({});
                  toast({
                    title: "Comunicado atualizado com sucesso",
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
              comunicadoFormSubmit.onClose();
              toast({
                title: "Comunicado já existe",
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
      .post(getBackendRoute(entity, "comunicados"), formData)
      .then((res) => {
        if (res.status === 200) {
          if (formData.anexos.length) {
            fileUpload(anexos, { referenceObjId: res.data.id }).then(
              async (res) => {
                await axios.put(
                  getBackendRoute(entity, "comunicados/anexos"),
                  { anexosId: res.data },
                  { params: { id: res.data[0].referenceObjId } }
                );
              }
            );
          }
          comunicadoFormSubmit.onClose();
          addComunicado.onClose();
          setSelectedRow(null);
          formComunicado.reset({});
          toast({
            title: "Comunicado adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          comunicadoFormSubmit.onClose();
          toast({
            title: "Comunicado já existe",
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

  const onSubmitEmailRemetente = (formData, e) => {
    emailRemetenteFormSubmit.onOpen();
    e.preventDefault();

    axios
      //.post(`/api/${entity}/comunicados/remetentes`, formData)
      .post(getBackendRoute(entity, "comunicados/remetentes"), formData)
      .then((res) => {
        if (res.status === 200) {
          emailRemetenteFormSubmit.onClose();
          addEmailRemetente.onClose();
          formEmailRemetente.reset({});
          toast({
            title: "Remetente adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          emailRemetenteFormSubmit.onClose();
          toast({
            title: "Remetente já existe",
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

  const deleteComunicado = (formData) => {
    comunicadoFormSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/comunicados`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "comunicados"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirComunicado.onClose();
          comunicadoFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Comunicado excluído com sucesso",
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

  const onSubmitEnviarComunicado = (formData) => {
    enviarComunicadoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/comunicados/envios`, formData)
      .post(getBackendRoute(entity, "comunicados/envios"), formData)
      .then((res) => {
        if (res.status === 200) {
          enviarComunicado.onClose();
          setSelectedRow(null);
          toast({
            title: "Comunicado pronto para envio.",
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
      .finally(() => enviarComunicadoFormSubmit.onClose());
  };

  const assuntoEmailForm = formComunicado.watch("assunto");

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
      //.get(`/api/${entity}/comunicados`)
      .get(getBackendRoute(entity, "comunicados"))
      .then((res) => {
        if (res.status === 200) {
          setComunicadosFromBd(
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
  }, [addComunicado.isOpen, excluirComunicado.isOpen, enviarComunicado.isOpen]);

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
  }, [addEmailRemetente.isOpen]);

  useEffect(() => {
    setNomeEvento(assuntoEmailForm);
  }, [assuntoEmailForm]);

  useEffect(() => {
    setController(new AbortController());
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Comunicados</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addComunicado.onOpen}
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

      {/* Adicionar/Editar comunicado Overlay  */}
      <Overlay
        onClose={() => {
          addComunicado.onClose();
          formComunicado.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        size="lg"
        isOpen={addComunicado.isOpen && !addEmailRemetente.isOpen}
        header={selectedRow ? "Editar Comunicado" : "Adicionar Comunicado"}
        closeButton
      >
        <chakra.form
          onSubmit={formComunicado.handleSubmit(onSubmitComunicado)}
          w="100%"
        >
          <Stack spacing={4}>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="emailRemetente"
                  formControl={formComunicado}
                  label="E-mail Rementente"
                  colorScheme="brand1"
                  options={emailsRemetentesFromBd}
                  placeholder="Selecione..."
                  defaultValue={
                    selectedRow
                      ? emailsRemetentesFromBd &&
                        emailsRemetentesFromBd.filter(
                          ({ id }) => id === selectedRow.remetenteComunicado_Id
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
                  onClick={addEmailRemetente.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <InputBox
              id="assunto"
              label="Assunto"
              formControl={formComunicado}
              defaultValue={selectedRow?.assunto}
            />
          </Stack>
          <Fade in={nomeEvento && nomeEvento.length >= 1} unmountOnExit>
            <Stack spacing={4}>
              <EmailEditor
                id="conteudoEmail"
                title={"Corpo do E-mail "}
                formControl={formComunicado}
                loadOnEditor={selectedRow?.conteudoEmail}
                parametros={parametrosFromBd}
              />
              <Dropzone
                id="anexos"
                label="Anexos"
                formControl={formComunicado}
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
                formControl={formComunicado}
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
              isLoading={comunicadoFormSubmit.isOpen}
              isDisabled={!formComunicadoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar remetente Overlay  */}
      <Overlay
        isOpen={addEmailRemetente.isOpen}
        onClose={() => {
          addEmailRemetente.onClose();
          formEmailRemetente.reset({});
        }}
        closeButton
        header="Adicionar Remetente"
      >
        <chakra.form
          onSubmit={formEmailRemetente.handleSubmit(onSubmitEmailRemetente)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formEmailRemetente} />
            <InputBox
              id="email"
              label="E-mail"
              formControl={formEmailRemetente}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={emailRemetenteFormSubmit.isOpen}
              isDisabled={!formEmailRemetenteValidation}
              loadingText="Salvando"
              shadow="md"
            >
              Cadastrar
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir comunicado Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirComunicado.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirComunicado.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Comunicado</Box>
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
              <Heading size="md">Deseja excluir o seguinte comunicado?</Heading>
              <Text fontSize="xl" align="center">
                #{selectedRow?.codComunicado} - {selectedRow?.assunto}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteComunicado(selectedRow);
                  }}
                  isLoading={comunicadoFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluirComunicado.onClose();
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

      {/* Enviar comunicado Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={enviarComunicado.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={enviarComunicado.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Enviar Comunicado</Box>
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
              <Heading size="md">Deseja enviar o seguinte comunicado?</Heading>
              <Text fontSize="xl" align="center">
                #{selectedRow?.codComunicado} - {selectedRow?.assunto}
              </Text>
              <HStack>
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={() => {
                    onSubmitEnviarComunicado(selectedRow);
                  }}
                  isLoading={enviarComunicadoFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Enviar
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    enviarComunicado.onClose();
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

Comunicados.auth = true;
Comunicados.dashboard = true;
