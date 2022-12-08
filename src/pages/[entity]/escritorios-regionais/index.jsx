import {
  Box,
  Button,
  Center,
  chakra,
  Collapse,
  Divider,
  Fade,
  Flex,
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
import { InputBox } from "components/Inputs/InputBox";
import { MaskedInputBox } from "components/Inputs/MaskedInputBox";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { celularMask, cepMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import {
  FiEdit,
  FiMoreHorizontal,
  FiPlus,
  FiTool,
  FiTrash2,
} from "react-icons/fi";
import { axios, getBackendRoute } from "services";
import { dynamicSort } from "utils";

export default function EscritoriosRegionais({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [cepData, setCepData] = useState(null);
  const [ibgeData, setIbgeData] = useState();
  const addEscritorioRegional = useDisclosure();
  const formSubmit = useDisclosure();
  const gerenciarEscritorioFormSubmit = useDisclosure();
  const gerenciarEscritorio = useDisclosure();
  const excluirEscritorio = useDisclosure();
  const buscaCep = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const toast = useToast();

  const columns = useMemo(
    () => [
      {
        Header: "Escritório",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "logradouro",
        accessor: "logradouro",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "cidade",
        accessor: "cidade",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "contato",
        accessor: "num_contato",
        Cell: ({ value }) => <Text noOfLines={2}>{value}</Text>,
        Footer: false,
      },
      {
        Header: "email",
        accessor: "email",
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
                    text: "Gerenciar",
                    icon: <FiTool />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      gerenciarEscritorio.onOpen();
                    },
                  },
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      addEscritorioRegional.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirEscritorio.onOpen();
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

  const data = useMemo(() => escritoriosFromBd, [escritoriosFromBd]);

  const formAddEscritorio = useForm({
    mode: "onChange",
  });

  const formGerenciarEscritorio = useForm({
    mode: "onChange",
  });

  const { isValid: formAddEscritorioValidation } = useFormState({
    control: formAddEscritorio.control,
  });

  const { isValid: formGerenciarEscritorioValidation } = useFormState({
    control: formGerenciarEscritorio.control,
  });

  const onSubmitEscritorioRegional = (formData, e) => {
    formSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/escritorios-regionais`, formData)
          .put(getBackendRoute(entity, "escritorios-regionais"), formData)
          .then((res) => {
            if (res.status === 200) {
              formSubmit.onClose();
              addEscritorioRegional.onClose();
              setSelectedRow(null);
              formAddEscritorio.reset({});
              toast({
                title: "Escritório atualizado com sucesso",
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
                title: "Escritório já existe",
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
      //.post(`/api/${entity}/escritorios-regionais`, formData)
      .post(getBackendRoute(entity, "escritorios-regionais"), formData)
      .then((res) => {
        if (res.status === 200) {
          formSubmit.onClose();
          addEscritorioRegional.onClose();
          setSelectedRow(null);
          formAddEscritorio.reset({});
          toast({
            title: "Escritório adicionado com sucesso",
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
            title: "Escritório já existe",
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

  const onSubmitGerenciarEscritorio = (formData, e) => {
    e.preventDefault();
    gerenciarEscritorioFormSubmit.onOpen();
    formData.id = selectedRow.id;
    axios
      //.put(`/api/${entity}/escritorios-regionais/gerenciar`, formData)
      .put(getBackendRoute(entity, "escritorios-regionais/gerenciar"), formData)
      .then((res) => {
        if (res.status === 200) {
          gerenciarEscritorio.onClose();
          setSelectedRow(null);
          formGerenciarEscritorio.reset({});
          toast({
            title: "Escritório atualizado com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        if (error.response.status === 409) {
          console.log(error.response.data);
          toast({
            title: "Não foi possível completar a operação",
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          console.log(error);
          throw new Error(error.response.data);
        }
      })
      .finally(() => gerenciarEscritorioFormSubmit.onClose());
  };

  const deleteEscritorioRegional = (formData) => {
    formSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/escritorios-regionais`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "escritorios-regionais"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirEscritorio.onClose();
          formSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Escritrório excluída com sucesso",
            status: "success",
            duration: 5000,
            isClosable: false,
            position,
          });
        }
      })
      .catch((error) => {
        console.log(error);
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
      //.get(`/api/${entity}/escritorios-regionais`)
      .get(getBackendRoute(entity, "escritorios-regionais"))
      .then((res) => {
        if (res.status === 200) {
          setEscritoriosFromBd(res.data);
        }
      })
      .catch((error) => {
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    axios
      //.get(`/api/${entity}/municipios`)
      .get(getBackendRoute(entity, "municipios"))
      .then((res) => {
        if (res.status === 200) {
          setMunicipiosFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    addEscritorioRegional.isOpen,
    gerenciarEscritorio.isOpen,
    excluirEscritorio.isOpen,
  ]);
  const cepInput = formAddEscritorio.watch("cep");

  const consultaEndereco = async () => {
    const cep = formAddEscritorio.getValues("cep");
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
        position,
      });
    } catch (error) {
      setCepData(null);
      formAddEscritorio.reset({
        cep,
      });
      toast({
        title: "Endereço não localizado",
        description: "Verifique o CEP ou preencha o endereço manualmente",
        status: "warning",
        duration: 5000,
        isClosable: false,
        position,
        containerStyle: {
          width: "300px",
        },
      });
    } finally {
      buscaCep.onClose();
    }
  };

  useEffect(() => {
    if (
      addEscritorioRegional.isOpen &&
      cepInput?.length === 9 &&
      !selectedRow
    ) {
      consultaEndereco();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEscritorioRegional.isOpen, cepInput]);

  const options = [
    { value: "1212", label: "Monitor 1" },
    { value: "3434", label: "Monitor 2" },
    { value: "5656", label: "Monitor 3" },
  ];

  useEffect(() => {
    axios
      // .get(
      //   `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${entity}/municipios`
      // )
      .get(getBackendRoute(entity, "ext/municipios"))
      .then(({ data }) =>
        setIbgeData(
          data.map(({ id, nome, ...opt }) => ({
            value: Number(id),
            label: nome,
          }))
        )
      )
      .catch((error) => {
        throw new Error(error.response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const municipFiltered = useMemo(
    () =>
      ibgeData &&
      municipiosFromBd &&
      selectedRow &&
      ibgeData
        .map((municipIbge) => {
          const check = municipiosFromBd.find(
            (municip) =>
              municip.idIBGE === municipIbge.value &&
              municip.escritorio_RegionalId !== null
          );
          if (check && check?.escritorio_RegionalId !== selectedRow?.id) {
            return {
              value: municipiosFromBd.find(
                ({ idIBGE }) => idIBGE === municipIbge.value
              ).id,
              label: `${municipIbge.label} - ${check?.escritorioRegional?.nome}`,
              isDisabled: true,
            };
          }
          return {
            value: municipiosFromBd.find(
              ({ idIBGE }) => idIBGE === municipIbge.value
            ).id,
            label: municipIbge.label,
            isDisabled: false,
          };
        })
        .sort(dynamicSort("label")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRow]
  );

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={isLoaded}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Escritórios Regionais</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addEscritorioRegional.onOpen}
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

      {/* Adicionar escritório regional Overlay  */}
      <Overlay
        onClose={() => {
          addEscritorioRegional.onClose();
          formAddEscritorio.reset({});
          if (selectedRow) {
            setSelectedRow(null);
            setCepData(null);
          }
        }}
        isOpen={addEscritorioRegional.isOpen && !gerenciarEscritorio.isOpen}
        header={
          selectedRow
            ? "Editar Escritório Regional"
            : "Adicionar Escritório Regional"
        }
        closeButton
      >
        <chakra.form
          onSubmit={formAddEscritorio.handleSubmit(onSubmitEscritorioRegional)}
          w="100%"
        >
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAddEscritorio}
              defaultValue={selectedRow?.nome}
            />
            <MaskedInputBox
              id="cep"
              label="CEP"
              placeholder="12345-678"
              formControl={formAddEscritorio}
              defaultValue={selectedRow?.cep}
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
              in={(cepInput && cepInput.length === 9) || selectedRow}
              animateOpacity
            >
              <Stack spacing={4}>
                <InputBox
                  id="logradouro"
                  label="Logradouro"
                  formControl={formAddEscritorio}
                  isLoaded={!buscaCep.isOpen}
                  defaultValue={
                    selectedRow?.logradouro || (cepData && cepData.street)
                  }
                />
                <InputBox
                  id="complemento"
                  label="Complemento"
                  formControl={formAddEscritorio}
                  defaultValue={selectedRow?.complemento}
                  required={false}
                />
                <InputBox
                  id="bairro"
                  label="Bairro"
                  formControl={formAddEscritorio}
                  defaultValue={
                    selectedRow?.bairro || (cepData && cepData.neighborhood)
                  }
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="cidade"
                  label="Cidade"
                  formControl={formAddEscritorio}
                  defaultValue={
                    selectedRow?.cidade || (cepData && cepData.city)
                  }
                  isLoaded={!buscaCep.isOpen}
                />
                <InputBox
                  id="uf"
                  label="UF"
                  formControl={formAddEscritorio}
                  defaultValue={selectedRow?.uf || (cepData && cepData.state)}
                  isLoaded={!buscaCep.isOpen}
                />
              </Stack>
            </Collapse>
            <InputBox
              id="email"
              label="E-mail"
              formControl={formAddEscritorio}
              defaultValue={selectedRow?.email}
              validate={(value) =>
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                "Informe um E-mail válido"
              }
            />
            <MaskedInputBox
              id="num_contato"
              label="Contato"
              placeholder="11 12345-6789"
              formControl={formAddEscritorio}
              defaultValue={selectedRow?.num_contato}
              validate={(value) =>
                value.length >= 14 || "Informe DDD + número válido"
              }
              setMask={celularMask}
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formSubmit.isOpen}
              isDisabled={!formAddEscritorioValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Gerenciar escritório regional Overlay  */}
      <Overlay
        isOpen={gerenciarEscritorio.isOpen}
        onClose={() => {
          gerenciarEscritorio.onClose();
          formGerenciarEscritorio.reset({});
        }}
        closeButton
        header={`Gerenciar ${selectedRow && selectedRow.nome}`}
        size="lg"
      >
        <chakra.form
          onSubmit={formGerenciarEscritorio.handleSubmit(
            onSubmitGerenciarEscritorio
          )}
          w="100%"
        >
          <Stack spacing={4}>
            <SelectInputBox
              id="municipios"
              label="Municípios"
              formControl={formGerenciarEscritorio}
              options={municipFiltered}
              required={false}
              isMulti
              defaultValue={
                selectedRow &&
                municipFiltered.filter((mun) =>
                  selectedRow.municipios
                    .map((sel) => sel.id)
                    .includes(mun.value)
                )
              }
            />
            {/* Campo para seleção de monitores deverá ser reabilitado na implementação do módulo de monitoramento (SMB) */}
            {/* <SelectInputBox
              id="monitores"
              label="Monitores"
              formControl={formGerenciarEscritorio}
              options={options}
              required={false}
              isMulti
            /> */}
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={gerenciarEscritorioFormSubmit.isOpen}
              isDisabled={!formGerenciarEscritorioValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir escritorio regional Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirEscritorio.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirEscritorio.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Escritório Regional</Box>
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
              <Heading size="md">Deseja excluir o seguinte escritório?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteEscritorioRegional(selectedRow);
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
                    excluirEscritorio.onClose();
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

EscritoriosRegionais.auth = true;
EscritoriosRegionais.dashboard = true;
