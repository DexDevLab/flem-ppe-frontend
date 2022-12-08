import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  chakra,
  Collapse,
  Divider,
  Fade,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  InputRightElement,
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
import { SwitchButton } from "components/Buttons/SwitchButton";
import { EmailEditor } from "components/EmailEditor";
import { CheckboxInput } from "components/Inputs/CheckboxInput";
import { InputBox } from "components/Inputs/InputBox";
import { MaskedInputBox } from "components/Inputs/MaskedInputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import ChakraTagInput from "components/Inputs/TagInput";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import download from "downloadjs";
import { useCustomForm } from "hooks";
import { DateTime } from "luxon";
import { cepMask, cpfMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { BsClipboardCheck } from "react-icons/bs";
import {
  FiEdit,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
  FiUserCheck,
} from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { maskCapitalize } from "utils";

export default function Eventos({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [cepData, setCepData] = useState([]);
  const [eventosFromBd, setEventosFromBd] = useState([]);
  const [locaisEventosFromBd, setLocaisEventosFromBd] = useState([]);
  const [tiposEventoFromBd, setTiposEventoFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromRh] = useState([]);
  const [beneficiariosFromRh, setBeneficiariosFromRh] = useState([]);
  const [parametrosFromBd, setParametrosFromBd] = useState([]);
  const [emailsRemetentesFromBd, setEmailsRemetentesFromBd] = useState([]);
  const [emailAlerts, emailAlertsState] = useState(false);
  const [criarAcaoCR, setCriarAcaoCR] = useState(false);
  const [benefLote, setBenefLote] = useState(false);
  const [modalidade, setModalidade] = useState("");
  const [nomeEvento, setNomeEvento] = useState("");
  const tipoEventoFormSubmit = useDisclosure();
  const downloadingFile = useDisclosure();
  const addEvento = useDisclosure();
  const formSubmit = useDisclosure();
  const localEventoFormSubmit = useDisclosure();
  const addLocalFormSubmit = useDisclosure();
  const addLoca = useDisclosure();
  const excluirEventoModal = useDisclosure();
  const addTipoEvento = useDisclosure();
  const addLocalEvento = useDisclosure();
  const buscaCep = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast({
    position,
  });
  const informarPresenca = useCustomForm();

  const columns = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Data",
        accessor: "data",
        Cell: ({ value }) => (
          <Box minW={150}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}
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
        Header: "Local",
        accessor: "modalidade",
        Cell: ({ row: { original }, value }) => (
          <Box minW={200}>
            {value === "videoconferencia" && "Videoconferência"}
            {value === "presencial" && original.localEvento.nome}
          </Box>
        ),
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
                    text: "Gerar Lista de Presença",
                    icon: <BsClipboardCheck />,
                    onClick: () => {
                      downloadListaPresenca(props.row.original);
                    },
                    disabled: props.row.original.benefAssoc.length === 0,
                  },
                  {
                    text: "Informar presença",
                    icon: <FiUserCheck />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      informarPresenca.openOverlay();
                    },
                    disabled: props.row.original.benefAssoc.length === 0,
                  },

                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      addEvento.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirEventoModal.onOpen();
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

  const data = useMemo(() => eventosFromBd, [eventosFromBd]);

  const formAddEvento = useForm({
    mode: "onChange",
  });

  const formLocalEvento = useForm({
    mode: "onChange",
  });

  const formTipoEvento = useForm({
    mode: "onChange",
  });

  const { isValid: formAddEventoValidation } = useFormState({
    control: formAddEvento.control,
  });

  const { isValid: formLocalEventoValidation } = useFormState({
    control: formLocalEvento.control,
  });

  const { isValid: formTipoEventoValidation } = useFormState({
    control: formTipoEvento.control,
  });

  const onSubmitAddEvento = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      formData.acao_CrId = selectedRow.acao_Cr[0]?.id;
      formData.comunicado_Id = selectedRow.comunicado[0]?.id;

      return (
        axios
          //.put(`/api/${entity}/eventos`, formData)
          .put(getBackendRoute(entity, "eventos"), formData)
          .then((res) => {
            if (res.status === 200) {
              formSubmit.onClose();
              addEvento.onClose();
              setSelectedRow(null);
              formAddEvento.reset({});
              toast({
                title: "Evento atualizado com sucesso",
                status: "success",
                duration: 5000,
                isClosable: false,
              });
            }
          })
          .catch((error) => {
            if (error.response.status === 409) {
              formSubmit.onClose();
              toast({
                title: "Evento já existe",
                status: "error",
                duration: 5000,
                isClosable: false,
              });
            } else {
              throw new Error(error.response.data);
            }
          })
      );
    }
    axios
      //.post(`/api/${entity}/eventos`, formData)
      .post(getBackendRoute(entity, "eventos"), formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addEvento.onClose();
          setSelectedRow(null);
          formAddEvento.reset({});
          toast({
            title: "Evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          formSubmit.onClose();
          toast({
            title: "Evento já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
          });
        } else {
          throw new Error(error.response.data);
        }
      });
  };

  const onSubmitLocalEvento = (formData, e) => {
    e.preventDefault();
    localEventoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/eventos/locais`, formData)
      .post(getBackendRoute(entity, "eventos/locais"), formData)
      .then((res) => {
        if (res.status === 200) {
          localEventoFormSubmit.onClose();
          addLocalEvento.onClose();
          formLocalEvento.reset({});
          toast({
            title: "Local de Evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          localEventoFormSubmit.onClose();
          toast({
            title: `Local já existe`,
            status: "error",
            duration: 5000,
            isClosable: false,
          });
        } else {
          throw new Error(error.response.data);
        }
      });
  };

  const onSubmitTipoEvento = (formData, e) => {
    e.preventDefault();
    tipoEventoFormSubmit.onOpen();
    axios
      //.post(`/api/${entity}/eventos/tipos`, formData)
      .post(getBackendRoute(entity, "eventos/tipos"), formData)
      .then((res) => {
        if (res.status === 200) {
          tipoEventoFormSubmit.onClose();
          addTipoEvento.onClose();
          setSelectedRow(null);
          formTipoEvento.reset({});
          toast({
            title: "Tipo de evento adicionado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          tipoEventoFormSubmit.onClose();
          toast({
            title: "Tipo já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
          });
        } else {
          throw new Error(error.response.data);
        }
      });
  };

  const onSubmitInformarPresenca = (formData, e) => {
    e.preventDefault();
    informarPresenca.setLoading();
    formData.eventoId = selectedRow.id;
    axios
      //.post(`/api/${entity}/eventos/presenca`, formData)
      .post(getBackendRoute(entity, "eventos/presenca"), formData)
      .then((res) => {
        if (res.status === 200) {
          informarPresenca.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Presença em evento informada com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
        }
      })
      .catch((error) => {
        throw new Error(error.response.data);
      })
      .finally(informarPresenca.setLoaded);
  };

  const excluirEvento = (formData) => {
    formSubmit.onOpen();
    console.log(formData);
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
          excluirEventoModal.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Evento excluído com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  };

  const downloadListaPresenca = ({ id, nome }) => {
    downloadingFile.onOpen();
    axios
      // .get(`/api/${entity}/reports`, {
      //   params: {
      //     id,
      //     reportUrl: "/eventos/lista-presenca",
      //   },
      //   responseType: "blob",
      // })
      .get(
        getBackendRoute(entity, "reports"),
        {
          params: {
            id: id,
            reportUrl: "eventos/lista-presenca",
          },
        responseType: "blob"
        }
      )
      .then((res) => {
        if (res.status === 200) {
          const content = res.headers["content-type"];
          toast({
            title: "Lista gerada com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
          });
          download(res.data, `PPE_LISTA_PRESENCA_${nome}.pdf`, content);
          downloadingFile.onClose();
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
    axios
      //.get(`/api/${entity}/colaboradores-cr`)
      .get(getBackendRoute(entity, "colaboradores-cr"))
      .then((res) => {
        if (res.status === 200) {
          setColaboradoresFromRh(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: maskCapitalize(nome),
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

  useEffect(() => {
    axios
      //.get(`/api/${entity}/beneficiarios`)
      .get(getBackendRoute(entity, "beneficiarios"))
      .then((res) => {
        if (res.status === 200) {
          setBeneficiariosFromRh(
            res.data.map(({ matriculaFlem, nome, cpf }) => ({
              value: matriculaFlem,
              label: `${matriculaFlem} - ` + maskCapitalize(nome),
              cpf: cpf,
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

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/eventos`)
      .get(getBackendRoute(entity, "eventos"))
      .then((res) => {
        if (res.status === 200) {
          setEventosFromBd(res.data);
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
  }, [addEvento.isOpen, excluirEventoModal.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/municipios`)
      .get(getBackendRoute(entity, "municipios"))
      .then((res) => {
        if (res.status === 200) {
          setMunicipiosFromBd(
            res.data.map((munic) => ({
              id: munic.id,
              value: munic.id,
              label: munic.nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, addLoca.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/eventos/tipos`)
      .get(getBackendRoute(entity, "eventos/tipos"))
      .then((res) => {
        if (res.status === 200) {
          setTiposEventoFromBd(
            res.data.map((tipo) => ({
              id: tipo.id,
              value: tipo.id,
              label: tipo.nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEvento.isOpen, addTipoEvento.isOpen]);

  useEffect(() => {
    axios
      //.get(`/api/${entity}/eventos/locais`)
      .get(getBackendRoute(entity, "eventos/locais"))
      .then((res) => {
        if (res.status === 200) {
          setLocaisEventosFromBd(
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
  }, [addEvento.isOpen, addLocalEvento.isOpen]);

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
    axios
      //.get(`/api/${entity}/demandantes`)
      .get(getBackendRoute(entity, "demandantes"))
      .then((res) => {
        if (res.status === 200) {
          setDemandantesFromBd(
            res.data.map(({ id, sigla, nome }) => ({
              value: id,
              id,
              label: `${sigla} - ${nome}`,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  }, []);
  const cepInput = formLocalEvento.watch("cep");
  const filtroParticipantes = formAddEvento.watch("filtro");
  const nomeEventoForm = formAddEvento.watch("nome");
  const modalidadeForm = formAddEvento.watch("modalidade");
  const emailAlertsForm = formAddEvento.watch("emailAlerts");
  const criarAcaoCRForm = formAddEvento.watch("criarAcaoCR");
  const benefLoteInput = formAddEvento.watch("benefType");

  const consultaEndereco = async () => {
    const cep = formLocalEvento.getValues("cep");
    try {
      buscaCep.onOpen();
      // const { data } = await axios.get(
      //   `https://brasilapi.com.br/api/cep/v2/${cep}`
      // );
      const { data } = await axios.get(getBackendRoute(entity, "ext/cep"), {
        params: {
          cep: cep,
        },
      });
      setCepData(data);
      toast({
        title: "Endereço localizado",
        status: "success",
        duration: 5000,
        isClosable: false,
      });
    } catch (error) {
      setCepData(null);
      formLocalEvento.reset({
        cep,
      });
      toast({
        title: "Endereço não localizado",
        description: "Verifique o CEP ou preencha o endereço manualmente",
        status: "warning",
        duration: 5000,
        isClosable: false,
        containerStyle: {
          width: "300px",
        },
      });
    } finally {
      buscaCep.onClose();
    }
  };

  useEffect(() => {
    if (addLocalEvento.isOpen && cepInput?.length === 9 && !selectedRow) {
      consultaEndereco();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addLocalEvento.isOpen, cepInput]);

  useEffect(() => {
    emailAlertsState(emailAlertsForm);
    if (!emailAlertsForm) {
      formAddEvento.unregister("conteudoEmail");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailAlertsForm]);

  useEffect(() => {
    setCriarAcaoCR(criarAcaoCRForm);
    if (!criarAcaoCRForm) {
      formAddEvento.unregister("colabAcaoCR");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criarAcaoCRForm]);

  useEffect(() => {
    setNomeEvento(nomeEventoForm);
  }, [nomeEventoForm]);

  useEffect(() => {
    setModalidade(modalidadeForm);
    if (modalidadeForm === "videoconferencia") {
      formAddEvento.unregister("local");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalidadeForm]);

  useEffect(() => {
    switch (filtroParticipantes) {
      case "municDemand":
        formAddEvento.unregister("benefAssoc");
        break;

      case "benef":
        formAddEvento.unregister("filtroMunicipios");
        formAddEvento.unregister("filtroDemandantes");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroParticipantes]);

  useEffect(() => {
    setBenefLote(benefLoteInput);
  }, [benefLoteInput]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Eventos</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addEvento.onOpen}
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

      {/* Adicionar Evento Overlay  */}
      <Overlay
        onClose={() => {
          addEvento.onClose();
          formAddEvento.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={
          addEvento.isOpen && !(addTipoEvento.isOpen || addLocalEvento.isOpen)
        }
        header={selectedRow ? "Editar Evento" : "Adicionar Evento"}
        closeButton
        size={emailAlerts ? "lg" : "md"}
        transition="max-width ease-in-out .2s"
      >
        <chakra.form
          onSubmit={formAddEvento.handleSubmit(onSubmitAddEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAddEvento}
              defaultValue={selectedRow?.nome}
            />
            <InputBox
              id="data"
              label="Data"
              type="datetime-local"
              formControl={formAddEvento}
              defaultValue={
                selectedRow?.data &&
                DateTime.fromISO(selectedRow.data)
                  .setZone("UTC-3")
                  .toFormat("yyyy-MM-dd'T'HH:mm")
              }
              validate={(dataSelecionada) =>
                DateTime.now()
                  .diff(DateTime.fromISO(dataSelecionada), "days")
                  .toObject().days < 1 || "Informe uma data válida"
              }
            />
            <CheckboxInput
              id="modalidade"
              label="Modalidade"
              formControl={formAddEvento}
              defaultValue={selectedRow?.modalidade}
              options={[
                { id: "presencial", label: "Presencial" },
                { id: "videoconferencia", label: "Videoconferência" },
              ]}
            />
            <Fade in={modalidade === "presencial"} unmountOnExit>
              <HStack justifyContent="space-between">
                <Box w="100%">
                  <SelectInputBox
                    id="local"
                    formControl={formAddEvento}
                    label="Local"
                    options={locaisEventosFromBd}
                    placeholder="Selecione..."
                    defaultValue={
                      selectedRow &&
                      locaisEventosFromBd.filter(
                        ({ value }) => value === selectedRow.local_EventoId
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
                    onClick={addLocalEvento.onOpen}
                  >
                    <Icon as={FiPlus} boxSize={6} />
                  </Button>
                </Box>
              </HStack>
            </Fade>
            <HStack justifyContent="space-between">
              <Box w="100%">
                <SelectInputBox
                  id="tipo"
                  label="Tipo "
                  placeholder="Selecione..."
                  formControl={formAddEvento}
                  options={tiposEventoFromBd}
                  defaultValue={
                    selectedRow &&
                    tiposEventoFromBd.filter(
                      ({ value }) => value === selectedRow.tipo_eventoId
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
                  onClick={addTipoEvento.onOpen}
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Button>
              </Box>
            </HStack>
            <Divider pt={2} />
            <HStack justifyContent="space-between" py={2}>
              <Heading size="sm" textAlign="center" color="gray.500">
                Participantes
              </Heading>
              <CheckboxInput
                id="filtro"
                options={[
                  { id: "municDemand", label: "Municipios/Demandantes" },
                  { id: "benef", label: "Beneficiários" },
                ]}
                size="xs"
                formControl={formAddEvento}
                defaultValue={
                  selectedRow 
                  && Array.isArray(selectedRow.benefAssoc) 
                  && "benef"
                }
              />
            </HStack>
            <Fade
              in={filtroParticipantes === "municDemand"}
              pt={2}
              unmountOnExit
            >
              <Stack spacing={4} py={2}>
                <SelectInputBox
                  id="filtroMunicipios"
                  label="Filtrar por Municípios"
                  placeholder="Selecione..."
                  options={municipiosFromBd}
                  formControl={formAddEvento}
                />
                <SelectInputBox
                  id="filtroDemandantes"
                  label="Filtrar por Demandantes"
                  placeholder="Selecione..."
                  options={demandantesFromBd}
                  formControl={formAddEvento}
                />
              </Stack>
            </Fade>
            <Fade
              in={
                filtroParticipantes === "benef" ||
                (selectedRow &&
                  Array.isArray(selectedRow.benefAssoc) &&
                  "benef")
              }
              pt={2}
              unmountOnExit
            >
              <Box>
                <Flex justifyContent="space-between" flex="0 0 1%" mb={2}>
                  <FormLabel ps={0.5} m={0}>
                    Beneficiários Associados
                  </FormLabel>
                  <Box alignSelf="center">
                    <SwitchButton
                      id="benefType"
                      formControl={formAddEvento}
                      label="Selecionar em Lote"
                      size="sm"
                    />
                  </Box>
                </Flex>
                {!benefLote && (
                  <SelectInputBox
                    id="benefAssoc"
                    formControl={formAddEvento}
                    options={beneficiariosFromRh}
                    isMulti
                    defaultValue={
                      selectedRow &&
                      beneficiariosFromRh.filter((benef) =>
                        selectedRow.benefAssoc.find(
                          (selec) => selec.cpf === benef.cpf
                        )
                      )
                    }
                  />
                )}
                {benefLote && (
                  <ChakraTagInput
                    id="benefAssoc"
                    formControl={formAddEvento}
                    placeholder="Matrículas ou CPFs separados por vírgula"
                    mask={cpfMask}
                  />
                )}
              </Box>
            </Fade>
            <Divider pt={1} />
            <HStack justifyContent="space-between" py={2}>
              <Heading size="sm" textAlign="center" color="gray.500">
                Notificações e Ações
              </Heading>
            </HStack>
            <Box
              bg={criarAcaoCR && "gray.50"}
              p={criarAcaoCR && 2}
              shadow={criarAcaoCR && "inner"}
              rounded="lg"
              transition="all ease-in-out .2s"
            >
              <SwitchButton
                id="criarAcaoCR"
                label="Criar ação na CR?"
                formControl={formAddEvento}
                defaultChecked={
                  selectedRow && selectedRow?.acao_Cr[0]?.excluido === false
                }
              />
              <Fade in={criarAcaoCR} unmountOnExit>
                <Box py={4}>
                  <SelectInputBox
                    id="colabAcaoCR"
                    label="Atribuir ação a"
                    placeholder="Selecione..."
                    options={colaboradoresFromRh}
                    formControl={formAddEvento}
                    defaultValue={
                      selectedRow &&
                      selectedRow?.acao_Cr.reverse()[0]?.excluido === false &&
                      colaboradoresFromRh.filter(({ value }) =>
                        selectedRow.acao_Cr[0]?.colabCr.find(
                          ({ id }) => id === value
                        )
                      )
                    }
                    bg="white"
                    isMulti
                  />
                </Box>
              </Fade>
            </Box>
            <Box
              bg={emailAlerts && "gray.50"}
              p={emailAlerts && 2}
              shadow={emailAlerts && "inner"}
              rounded="lg"
              transition="all ease-in-out .2s"
            >
              <SwitchButton
                id="emailAlerts"
                label="Notificar participantes por e-mail?"
                formControl={formAddEvento}
                defaultChecked={
                  selectedRow && selectedRow?.comunicado[0]?.excluido === false
                }
              />
              <Fade in={emailAlerts} unmountOnExit>
                <Box mt={4} mb={2}>
                  <SelectInputBox
                    id="emailRemetente"
                    formControl={formAddEvento}
                    label="E-mail Rementente"
                    colorScheme="brand1"
                    options={emailsRemetentesFromBd}
                    placeholder="Selecione..."
                    defaultValue={
                      selectedRow
                        ? emailsRemetentesFromBd &&
                          emailsRemetentesFromBd.filter(
                            ({ id }) =>
                              id ===
                              selectedRow.comunicado[0]?.remetenteComunicado_Id
                          )
                        : null
                    }
                  />
                </Box>
                <EmailEditor
                  id="conteudoEmail"
                  title={nomeEvento ? nomeEvento : "Nome do Evento"}
                  formControl={formAddEvento}
                  loadOnEditor={selectedRow?.comunicado[0]?.conteudoEmail}
                  parametros={parametrosFromBd}
                />
              </Fade>
            </Box>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddEventoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Adicionar local de evento Overlay */}
      <Overlay
        isOpen={addLocalEvento.isOpen}
        onClose={() => {
          addLocalEvento.onClose();
          formLocalEvento.reset({});
        }}
        closeButton
        header="Adicionar Local de Evento"
      >
        <chakra.form
          onSubmit={formLocalEvento.handleSubmit(onSubmitLocalEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formLocalEvento} />
            <MaskedInputBox
              id="cep"
              label="CEP"
              placeholder="12345-678"
              formControl={formLocalEvento}
              validate={(value) =>
                value.length === 9 || "Informe um CEP válido"
              }
              setMask={cepMask}
              pr={8}
              inputrightelement={
                <Fade in={selectedRow && cepInput?.length === 9}>
                  <InputRightElement w="auto" pr={1.5}>
                    <Button h="1.75rem" size="sm" onClick={consultaEndereco}>
                      Atualizar Endereço
                    </Button>
                  </InputRightElement>
                </Fade>
              }
            />
            <Collapse
              in={cepInput && cepInput.length === 9}
              animateOpacity
              unmountOnExit
            >
              <Stack spacing={4}>
                <InputBox
                  id="logradouro"
                  formControl={formLocalEvento}
                  label="Logradouro"
                  isLoaded={!buscaCep.isOpen}
                  defaultValue={
                    (cepData && cepData.street) || selectedRow?.logradouro
                  }
                />
                <InputBox
                  id="complemento"
                  formControl={formLocalEvento}
                  label="Complemento"
                  required={false}
                />
                <InputBox
                  id="bairro"
                  formControl={formLocalEvento}
                  label="Bairro"
                  defaultValue={
                    selectedRow?.bairro || (cepData && cepData.neighborhood)
                  }
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="cidade"
                  formControl={formLocalEvento}
                  label="Cidade"
                  defaultValue={
                    selectedRow?.cidade || (cepData && cepData.city)
                  }
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="uf"
                  formControl={formLocalEvento}
                  label="UF"
                  defaultValue={selectedRow?.uf || (cepData && cepData.state)}
                  isLoaded={!buscaCep.isOpen}
                />
              </Stack>
            </Collapse>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={addLocalFormSubmit.isOpen}
              isDisabled={!formLocalEventoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/*  Adicionar tipo de evento Overlay  */}
      <Overlay
        isOpen={addTipoEvento.isOpen}
        onClose={() => {
          addTipoEvento.onClose();
          formTipoEvento.reset({});
        }}
        closeButton
        header="Adicionar Tipo de Evento"
      >
        <chakra.form
          onSubmit={formTipoEvento.handleSubmit(onSubmitTipoEvento)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox id="nome" label="Nome" formControl={formTipoEvento} />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={tipoEventoFormSubmit.isOpen}
              isDisabled={!formTipoEventoValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir evento Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirEventoModal.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirEventoModal.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Evento</Box>
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
              <Heading size="md">Deseja excluir o seguinte evento?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome} -{" "}
                {DateTime.fromISO(selectedRow?.data).toLocaleString(
                  DateTime.DATETIME_SHORT
                )}
                h
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    excluirEvento(selectedRow);
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
                    excluirEventoModal.onClose();
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

      {/* Gerar lista de presença modal */}
      <AlertDialog
        isOpen={downloadingFile.isOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Gerar lista de presença
            </AlertDialogHeader>

            <AlertDialogBody display="flex" alignItems="center">
              Aguarde, o download do arquivo comecará em breve...
              <Box>
                <Spinner color="brand1.500" size="lg" />
              </Box>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Informar presença modal */}
      <AlertDialog
        isOpen={informarPresenca.overlayIsOpen}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" pb={0}>
              Informar presença
            </AlertDialogHeader>

            <AlertDialogBody
              display="flex"
              alignItems="center"
              flexDir="column"
              justifyContent="space-between"
            >
              <Text pb={2}>
                Informar lista de beneficiários presentes no evento abaixo:
              </Text>
              <Stack py={4} bg="gray.200" w="full" mb={4} rounded="md">
                <Text textAlign="center">{selectedRow?.nome}</Text>
                <Text textAlign="center">
                  Realizado em:{" "}
                  {DateTime.fromISO(selectedRow?.data).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )}
                  h
                </Text>
              </Stack>
              <Stack
                as={chakra.form}
                onSubmit={informarPresenca.handleSubmit(
                  onSubmitInformarPresenca
                )}
                w="full"
              >
                <ChakraTagInput
                  id="benefAssoc"
                  formControl={informarPresenca.control}
                  placeholder="Matrículas ou CPFs separados por vírgula"
                  mask={cpfMask}
                />
                <Flex alignSelf="flex-end" pb={4}>
                  <HStack>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        informarPresenca.closeOverlay();
                        setSelectedRow(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="brand1"
                      variant="outline"
                      isDisabled={!informarPresenca.validation}
                      isLoading={informarPresenca.isLoading}
                      loadingText="Aguarde..."
                    >
                      Salvar
                    </Button>
                  </HStack>
                </Flex>
              </Stack>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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

Eventos.auth = true;
Eventos.dashboard = true;
