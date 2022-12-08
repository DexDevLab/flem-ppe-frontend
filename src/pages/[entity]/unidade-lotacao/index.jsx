/**
 * Página de Unidade de Lotação
 * @module unidades-lotacao
 */

import {
  Box,
  Button,
  chakra,
  Collapse,
  Divider,
  Fade,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useBoolean,
  useBreakpointValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { InputBox } from "components/Inputs/InputBox";
import { MaskedInputBox } from "components/Inputs/MaskedInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useCustomForm } from "hooks";
import { celularMask, cepMask } from "masks-br";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FiEdit,
  FiInfo,
  FiMinus,
  FiMoreHorizontal,
  FiPlus,
  FiTool,
  FiTrash2,
} from "react-icons/fi";
import { axios, getBackendRoute } from "services";

/**
 * Renderiza o cadastro de unidades de lotação
 * @method UnidadeLotacao
 * @memberof module:unidades-lotacao
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns página renderizada
 */
export default function UnidadeLotacao({ entity, ...props }) {
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPontoFocal, setSelectedPontoFocal] = useState(null);
  const [emailQtd, setEmailQtd] = useState([0]);
  const [telefoneQtd, setTelefoneQtd] = useState([0]);
  const [unidadesLotacaoFromBd, setUnidadesLotacaoFromBd] = useState([]);
  const [pontosFocaisFromBd, setPontosFocaisFromBd] = useState([]);
  const [cepData, setCepData] = useState({});
  const fetchTableData = useDisclosure();
  const [fetchPontosFocaisFromBd, setFetchPontosFocaisFromBd] = useBoolean();
  const gerenciarUnidadeOverlay = useDisclosure();
  const [buscaCep, setBuscaCep] = useBoolean();
  const toast = useToast();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const formAddUnidade = useCustomForm();
  const formGerenciarUnidade = useCustomForm();
  const formDeleteUnidadeLotacao = useCustomForm();
  const formDeletePontoFocal = useCustomForm();

  const columns = useMemo(
    () => [
      {
        Header: "Unidade",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "localização",
        accessor: "descricao",
        Cell: ({ row: { original } }) => (
          <Text
            noOfLines={2}
          >{`${original.logradouro}, ${original.complemento}, ${original.bairro}, ${original.municipio} - ${original.uf}`}</Text>
        ),
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
                    text: "Gerenciar",
                    icon: <FiTool />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      gerenciarUnidadeOverlay.onOpen();
                    },
                  },
                  {
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      formAddUnidade.openOverlay();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      formDeleteUnidadeLotacao.openOverlay();
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

  const data = useMemo(() => unidadesLotacaoFromBd, [unidadesLotacaoFromBd]);

  const columnsTablePontosFocais = useMemo(
    () => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={100}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "E-mail",
        Cell: ({
          row: {
            original: { contato: value },
          },
        }) =>
          value
            .filter(({ tipoContato_Id }) => tipoContato_Id === "email")
            .map(({ contato }) => (
              <Text
                key={`contato-email-${contato}`}
                fontSize="sm"
                noOfLines={2}
              >
                {contato}
              </Text>
            )),
        Footer: false,
      },
      {
        Header: "Celular",
        Cell: ({
          row: {
            original: { contato: value },
          },
        }) =>
          value
            .filter(({ tipoContato_Id }) => tipoContato_Id === "celular")
            .map(({ contato }) => (
              <Text
                key={`contato-celular-${contato}`}
                fontSize="sm"
                noOfLines={2}
              >
                {contato}
              </Text>
            )),
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
                      setSelectedPontoFocal(props.row.original);
                      formGerenciarUnidade.openOverlay();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedPontoFocal(props.row.original);
                      formDeletePontoFocal.openOverlay();
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

  const dataTablePontosFocais = useMemo(
    () =>
      selectedRow &&
      pontosFocaisFromBd.filter(
        ({ unidadeLotacao_Id }) => unidadeLotacao_Id === selectedRow.id
      ),
    [selectedRow, pontosFocaisFromBd, formGerenciarUnidade.overlayIsOpen]
  );

  const onSubmitMaterial = (formData, e) => {
    formAddUnidade.setLoading();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/unidades-lotacao`, formData)
          .put(getBackendRoute(entity, "unidades-lotacao"), formData)
          .then((res) => {
            if (res.status === 200) {
              formAddUnidade.closeOverlay();
              setSelectedRow(null);
              toast({
                title: "Unidade atualizada com sucesso",
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
                title: "Unidade já existe",
                status: "error",
                duration: 5000,
                isClosable: false,
                position,
              });
            } else {
              formAddUnidade.setLoaded();
              throw new Error(error.response.data);
            }
          })
      );
    }
    axios
      //.post(`/api/${entity}/unidades-lotacao`, formData)
      .post(getBackendRoute(entity, "unidades-lotacao"), formData)
      .then((res) => {
        if (res.status === 200) {
          formAddUnidade.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Unidade adicionada com sucesso",
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
            title: "Unidade já existe",
            status: "error",
            duration: 5000,
            isClosable: false,
            position,
          });
        } else {
          throw new Error(error.response.data);
        }
      })
      .finally(formAddUnidade.setLoaded);
  };

  const onSubmitGerenciarUnidade = (formData, e) => {
    e.preventDefault();
    formGerenciarUnidade.setLoading();
    formData.idUnidadeLotacao = selectedRow.id;
    if (selectedPontoFocal) {
      axios
        // .put(`/api/${entity}/unidades-lotacao/ponto-focal`, formData, {
        //   params: {
        //     idPontoFocal: selectedPontoFocal.id,
        //   },
        // })
        .put(
          getBackendRoute(entity, "unidades-lotacao/ponto-focal"),
          formData,
          {
            params: {
              idPontoFocal: selectedPontoFocal.id,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            formGerenciarUnidade.closeOverlay();
            toast({
              title: "Ponto Focal atualizado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            toast({
              title: "Ponto Focal já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error.response.data);
          }
        })
        .finally(formGerenciarUnidade.setLoaded);
    } else {
      axios
        //.post(`/api/${entity}/unidades-lotacao/ponto-focal`, formData)
        .post(getBackendRoute(entity, "unidades-lotacao/ponto-focal"), formData)
        .then((res) => {
          if (res.status === 200) {
            formGerenciarUnidade.closeOverlay();
            toast({
              title: "Ponto Focal adicionado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: false,
              position,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            toast({
              title: "Ponto Focal já existe",
              status: "error",
              duration: 5000,
              isClosable: false,
              position,
            });
          } else {
            throw new Error(error.response.data);
          }
        })
        .finally(formGerenciarUnidade.setLoaded);
    }
  };

  const deleteMaterial = (formData) => {
    formDeleteUnidadeLotacao.setLoading();
    axios
      // .delete(`/api/${entity}/unidades-lotacao`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "unidades-lotacao"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          formDeleteUnidadeLotacao.closeOverlay();
          setSelectedRow(null);
          toast({
            title: "Unidade excluída com sucesso",
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
      .finally(formDeleteUnidadeLotacao.setLoaded);
  };

  const deletePontoFocal = (formData) => {
    formDeletePontoFocal.setLoading();
    axios
      // .delete(`/api/${entity}/unidades-lotacao/ponto-focal`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "unidades-lotacao/ponto-focal"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          formDeletePontoFocal.closeOverlay();
          setSelectedPontoFocal(null);
          toast({
            title: "Ponto Focal excluído com sucesso",
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
      .finally(formDeletePontoFocal.setLoaded);
  };

  const consultaEndereco = async () => {
    const cep = formAddUnidade.control.getValues("cep");
    try {
      setBuscaCep.on();
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
      formAddUnidade.control.reset({
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
      setBuscaCep.off();
    }
  };

  const cepInput = formAddUnidade.control.watch("cep");

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/unidades-lotacao`)
      .get(getBackendRoute(entity, "unidades-lotacao"))
      .then((res) => {
        if (res.status === 200) {
          setUnidadesLotacaoFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(fetchTableData.onClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAddUnidade.overlayIsOpen, formDeleteUnidadeLotacao.overlayIsOpen]);

  useEffect(() => {
    setFetchPontosFocaisFromBd.on();
    axios
      //.get(`/api/${entity}/unidades-lotacao/ponto-focal`)
      .get(getBackendRoute(entity, "unidades-lotacao/ponto-focal"))
      .then((res) => {
        if (res.status === 200) {
          setPontosFocaisFromBd(res.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      })
      .finally(setFetchPontosFocaisFromBd.off);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gerenciarUnidadeOverlay.isOpen,
    formGerenciarUnidade.overlayIsOpen,
    formDeletePontoFocal.overlayIsOpen,
  ]);

  useEffect(() => {
    if (
      formAddUnidade.overlayIsOpen &&
      cepInput?.length === 9 &&
      !selectedRow
    ) {
      consultaEndereco();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAddUnidade.overlayIsOpen, cepInput]);

  useEffect(() => {
    if (selectedPontoFocal) {
      setEmailQtd(
        selectedPontoFocal.contato.filter(
          ({ tipoContato_Id }) => tipoContato_Id === "email"
        )
      );
      setTelefoneQtd(
        selectedPontoFocal.contato.filter(
          ({ tipoContato_Id }) => tipoContato_Id === "celular"
        )
      );
    }
  }, [selectedPontoFocal]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!fetchTableData.isOpen}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Unidades de Lotação</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={formAddUnidade.openOverlay}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={data} columns={columns} />
      </AnimatePresenceWrapper>

      {/* Adicionar/editar unidade de lotação Overlay  */}
      <Overlay
        onClose={() => {
          formAddUnidade.closeOverlay();
          if (selectedRow) {
            setSelectedRow(null);
          }
          setCepData(null);
        }}
        isOpen={formAddUnidade.overlayIsOpen}
        header={
          selectedRow
            ? "Editar Unidade de Lotação"
            : "Adicionar Unidade de Lotação"
        }
        closeButton
      >
        <chakra.form onSubmit={formAddUnidade.handleSubmit(onSubmitMaterial)}>
          <Stack spacing={4}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formAddUnidade.control}
              defaultValue={selectedRow?.nome}
            />
            <MaskedInputBox
              id="cep"
              label="CEP"
              placeholder="12345-678"
              formControl={formAddUnidade.control}
              validate={(value) =>
                value.length === 9 || "Informe um CEP válido"
              }
              setMask={cepMask}
              pr={8}
              defaultValue={selectedRow?.cep}
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
                  formControl={formAddUnidade.control}
                  label="Logradouro"
                  isLoaded={!buscaCep}
                  defaultValue={
                    (cepData && cepData.street) || selectedRow?.logradouro
                  }
                />
                <InputBox
                  id="complemento"
                  formControl={formAddUnidade.control}
                  label="Complemento"
                  required={false}
                  defaultValue={selectedRow?.complemento}
                />
                <InputBox
                  id="bairro"
                  formControl={formAddUnidade.control}
                  label="Bairro"
                  defaultValue={
                    selectedRow?.bairro || (cepData && cepData.neighborhood)
                  }
                  isLoaded={!buscaCep}
                />
                <InputBox
                  id="municipio"
                  formControl={formAddUnidade.control}
                  label="Município"
                  defaultValue={
                    selectedRow?.municipio || (cepData && cepData.city)
                  }
                  isLoaded={!buscaCep}
                />
                <InputBox
                  id="uf"
                  formControl={formAddUnidade.control}
                  label="UF"
                  defaultValue={selectedRow?.uf || (cepData && cepData.state)}
                  isLoaded={!buscaCep}
                />
              </Stack>
            </Collapse>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formAddUnidade.isLoading}
              isDisabled={!formAddUnidade.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Gerenciar unidade de lotação Overlay  */}
      <Overlay
        isOpen={
          gerenciarUnidadeOverlay.isOpen && !formGerenciarUnidade.overlayIsOpen
        }
        onClose={() => {
          gerenciarUnidadeOverlay.onClose();
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        closeButton
        header={`Gerenciar Unidade de Lotação -  ${
          selectedRow && selectedRow.nome
        }`}
        size="lg"
      >
        <Stack>
          <HStack justifyContent="space-between">
            <Heading size="md">Pontos Focais</Heading>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand1"
              shadow="md"
              onClick={formGerenciarUnidade.openOverlay}
            >
              Adicionar
            </Button>
          </HStack>
          <AnimatePresenceWrapper
            router={router}
            isLoaded={!fetchPontosFocaisFromBd}
            p={0}
          >
            {Array.isArray(dataTablePontosFocais) &&
            dataTablePontosFocais.length === 0 ? (
              <Box bg="gray.200" rounded="md" mt={4}>
                <HStack justifyContent="space-between" p={4}>
                  <Heading size="md">
                    Não existem pontos focais nesta unidade de lotação.
                  </Heading>
                  <Icon as={FiInfo} boxSize={6} />
                </HStack>
              </Box>
            ) : (
              <Table
                data={dataTablePontosFocais}
                columns={columnsTablePontosFocais}
              />
            )}
          </AnimatePresenceWrapper>
        </Stack>
      </Overlay>

      {/* Adicionar Ponto Focal Modal  */}
      <Overlay
        header={
          selectedPontoFocal ? "Editar Ponto Focal" : "Adicionar Ponto Focal"
        }
        isOpen={formGerenciarUnidade.overlayIsOpen}
        size="lg"
        onClose={() => {
          formGerenciarUnidade.closeOverlay();
          formGerenciarUnidade.control.reset({});
          setEmailQtd([0]);
          setTelefoneQtd([0]);
          if (selectedPontoFocal) {
            setSelectedPontoFocal(null);
          }
        }}
      >
        <chakra.form
          onSubmit={formGerenciarUnidade.handleSubmit(onSubmitGerenciarUnidade)}
          w="100%"
        >
          <Stack spacing={3}>
            <InputBox
              id="nome"
              label="Nome"
              formControl={formGerenciarUnidade.control}
              size="sm"
              defaultValue={selectedPontoFocal && selectedPontoFocal.nome}
            />
            <Box>
              <FormLabel ps={0.5} mb={0}>
                E-mail
              </FormLabel>
              {emailQtd.map((obj, idx, arr) => (
                <HStack key={`form-email-${idx}`}>
                  <Box w="full">
                    <InputBox
                      id={`email.${idx}`}
                      formControl={formGerenciarUnidade.control}
                      size="sm"
                      placeholder="email@exemplo.com"
                      validate={(value) =>
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          value
                        ) || "Informe um E-mail válido"
                      }
                      defaultValue={selectedPontoFocal && obj.contato}
                    />
                  </Box>
                  {arr.length - 1 === idx ? (
                    <Box alignSelf="flex-end">
                      <IconButton
                        icon={<FiPlus />}
                        colorScheme="brand1"
                        size="sm"
                        onClick={() =>
                          setEmailQtd((prev) => [...prev, emailQtd.length + 1])
                        }
                      />
                    </Box>
                  ) : (
                    <Box alignSelf="flex-end">
                      <IconButton
                        icon={<FiMinus />}
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEmailQtd((prev) =>
                            prev.filter((obj, idx2) => idx2 !== idx)
                          );
                          formGerenciarUnidade.control.unregister(`email`);
                        }}
                      />
                    </Box>
                  )}
                </HStack>
              ))}
            </Box>
            <Box>
              <FormLabel ps={0.5} mb={0}>
                Contato
              </FormLabel>
              {telefoneQtd.map((obj, idx, arr) => (
                <HStack key={`form-contato-${idx}`}>
                  <Box w="full">
                    <MaskedInputBox
                      id={`contato.${idx}`}
                      formControl={formGerenciarUnidade.control}
                      size="sm"
                      placeholder="(11) 98765-4321"
                      setMask={celularMask}
                      validate={(value) =>
                        value.length >= 14 || "Informe um telefone válido"
                      }
                      defaultValue={selectedPontoFocal && obj.contato}
                    />
                  </Box>
                  {arr.length - 1 === idx ? (
                    <Box alignSelf="flex-end">
                      <IconButton
                        icon={<FiPlus />}
                        colorScheme="brand1"
                        size="sm"
                        onClick={() =>
                          setTelefoneQtd((prev) => [
                            ...prev,
                            telefoneQtd.length + 1,
                          ])
                        }
                      />
                    </Box>
                  ) : (
                    <Box alignSelf="flex-end">
                      <IconButton
                        icon={<FiMinus />}
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTelefoneQtd((prev) =>
                            prev.filter((obj, idx2) => idx2 !== idx)
                          );
                          formGerenciarUnidade.control.unregister(`contato`);
                        }}
                      />
                    </Box>
                  )}
                </HStack>
              ))}
            </Box>
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={formGerenciarUnidade.isLoading}
              isDisabled={!formGerenciarUnidade.validation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
            <Button
              colorScheme="brand1"
              variant="outline"
              onClick={() => {
                formGerenciarUnidade.closeOverlay();
                formGerenciarUnidade.control.reset({});
                setEmailQtd([0]);
                setTelefoneQtd([0]);
                if (selectedPontoFocal) {
                  setSelectedPontoFocal(null);
                }
              }}
            >
              Cancelar
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir unidade de lotação Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={formDeleteUnidadeLotacao.overlayIsOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={formDeleteUnidadeLotacao.closeOverlay}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Unidade de Lotação</Box>
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
              <Heading size="md">Deseja excluir a seguinte unidade?</Heading>
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
                  isLoading={formDeleteUnidadeLotacao.isLoading}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    formDeleteUnidadeLotacao.closeOverlay();
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

      {/* Excluir ponto focal Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={formDeletePontoFocal.overlayIsOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={formDeletePontoFocal.closeOverlay}
        onCloseComplete={() => setSelectedPontoFocal(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Ponto Focal</Box>
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
                Deseja excluir o seguinte ponto focal?
              </Heading>
              <Text fontSize="xl" align="center">
                {selectedPontoFocal?.nome}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deletePontoFocal(selectedPontoFocal);
                    setSelectedPontoFocal(null);
                  }}
                  isLoading={formDeletePontoFocal.isLoading}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    formDeletePontoFocal.closeOverlay();
                    setSelectedPontoFocal(null);
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

UnidadeLotacao.auth = true;
UnidadeLotacao.dashboard = true;
