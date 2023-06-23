/**
 * Componente de página de Monitores
 * @module monitores
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
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { MenuIconButton } from "components/Menus/MenuIconButton";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { getBackendRoute } from "services";
import { axios, axiosNoTimeout } from "services/apiService";
import { maskCapitalize } from "utils";
import { exceptionHandler } from "utils/exceptionHandler";

/**
 * Renderiza a Página de Cadastramento de Monitores
 * @method Monitores
 * @memberof module:monitores
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Monitores({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState(null);
  const [monitoresFromBd, setMonitoresFromBd] = useState([]);
  const [colaboradoresFromRh, setColaboradoresFromRh] = useState([]);
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const addMonitor = useDisclosure();
  const monitorFormSubmit = useDisclosure();
  const excluirMonitor = useDisclosure();
  const position = useBreakpointValue({ base: "bottom", sm: "top-right" });
  const fetchTableData = useDisclosure();
  const fetchRhApiData = useDisclosure();
  const toast = useToast();

  const formMonitor = useForm({
    mode: "onChange",
  });

  const { isValid: formMonitorValidation } = useFormState({
    control: formMonitor.control,
  });

  const data = useMemo(() => monitoresFromBd, [monitoresFromBd]);

  const colaboradoresOptions = useMemo(
    () =>
      _.isArray(colaboradoresFromRh) &&
      colaboradoresFromRh.map(({ matriculaDominio, nome }) => ({
        value: matriculaDominio.toString(),
        label: `${matriculaDominio} - ${maskCapitalize(nome)}`,
        isDisabled: monitoresFromBd.find(
          ({ matricula }) => matricula === matriculaDominio
        ),
      })),
    [colaboradoresFromRh, monitoresFromBd]
  );

  const demandantesOptions = useMemo(
    () =>
      demandantesFromBd
        .filter(({ vagas }) => {
          const escritoriosRegionaisIds = vagas.map(
            ({ municipio: { escritorio_RegionalId } }) => escritorio_RegionalId
          );
          const idsEscritoriosSelecionados = formMonitor
            .getValues("erAssoc")
            ?.map(({ value }) => value);

          return !_.isEmpty(
            escritoriosRegionaisIds?.filter((id) =>
              idsEscritoriosSelecionados?.includes(id)
            )
          );
        })
        .map(({ id, nome, sigla }) => ({
          value: id,
          label: `${sigla} - ${nome}`,
        })),

    [demandantesFromBd, selectedRow, formMonitor.watch("erAssoc")]
  );

  const onSubmitMonitor = (formData, e) => {
    monitorFormSubmit.onOpen();
    e.preventDefault();
    if (selectedRow) {
      formData.id = selectedRow.id;
      return (
        axios
          //.put(`/api/${entity}/monitores`, formData)
          .put(getBackendRoute(entity, "monitores"), formData)
          .then((res) => {
            if (res.status === 200) {
              monitorFormSubmit.onClose();
              addMonitor.onClose();
              setSelectedRow(null);
              formMonitor.reset({});
              toast({
                title: "Monitor(a) aualizado(a) com sucesso",
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
              monitorFormSubmit.onClose();
              exception.title = "Monitor(a) já existe";
              exception.description = "";
              exception.duration = 5000;
            }
            toast(exception);
            // if (error.response.status === 409) {
            //   monitorFormSubmit.onClose();
            //   toast({
            //     title: "Monitor(a) já existe",
            //     status: "error",
            //     duration: 5000,
            //     isClosable: false,
            //     position,
            //   });
            // } else {
            //   throw new Error(error.response.data);
            // }
          })
      );
    }

    formData.monitor = colaboradoresFromRh.find(
      ({ matriculaDominio }) => matriculaDominio === parseInt(formData.monitor)
    );
    axios
      //.post(`/api/${entity}/monitores`, formData)
      .post(getBackendRoute(entity, "monitores"), formData)
      .then((res) => {
        if (res.status === 200) {
          monitorFormSubmit.onClose();
          addMonitor.onClose();
          setSelectedRow(null);
          formMonitor.reset({});
          toast({
            title: "Monitor(a) adicionado(a) com sucesso",
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
          monitorFormSubmit.onClose();
          exception.title = "Monitor(a) já existe";
          exception.description = "";
          exception.duration = 5000;
        }
        toast(exception);
        // if (error.response.status === 409) {
        //   monitorFormSubmit.onClose();
        //   toast({
        //     title: "Monitor(a) já existe",
        //     status: "error",
        //     duration: 5000,
        //     isClosable: false,
        //     position,
        //   });
        // } else {
        //   throw new Error(error.response.data);
        // }
      });
  };

  const deleteMonitor = (formData) => {
    monitorFormSubmit.onOpen();
    axios
      // .delete(`/api/${entity}/monitores`, {
      //   params: {
      //     id: formData.id,
      //   },
      // })
      .delete(getBackendRoute(entity, "monitores"), {
        params: {
          id: formData.id,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          excluirMonitor.onClose();
          monitorFormSubmit.onClose();
          setSelectedRow(null);
          toast({
            title: "Monitor(a) excluído(a) com sucesso",
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
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  useEffect(() => {
    fetchRhApiData.onOpen();
    // const deptosToExclude = [
    //   1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
    // ];
    const deptosToGetColab = [125, 131];
    axiosNoTimeout
      // .get(`/api/${entity}/funcionarios/rh`, {
      //   params: {
      //     id_situacao: 1,
      //     condition: "AND",
      //   },
      // })
      .get(getBackendRoute(entity, "funcionarios"), {
        params: {
          codDepto: JSON.stringify(deptosToGetColab),
          condition: "AND",
          ativo: true,
        },
      })
      .then(({ data: { query } }) => setColaboradoresFromRh(query))
      .catch((error) => {
        toast(exceptionHandler(error));
      })
      .finally(fetchRhApiData.onClose);
    axios
      //.get(`/api/${entity}/escritorios-regionais`)
      .get(getBackendRoute(entity, "escritorios-regionais"))
      .then((res) => {
        if (res.status === 200) {
          setEscritoriosFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => {
        toast(exceptionHandler(error));
      });
    axios
      //.get(`/api/${entity}/demandantes`)
      .get(getBackendRoute(entity, "demandantes"))
      .then((res) => {
        if (res.status === 200) {
          // setDemandantesFromBd(
          //   res.data.map(({ id, sigla, nome }) => ({
          //     value: id,
          //     label: `${sigla} - ${nome}`,
          //   }))
          // );
          setDemandantesFromBd(res.data);
        }
      })
      .catch((error) => toast(exceptionHandler(error)));
  }, []);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      //.get(`/api/${entity}/monitores`)
      .get(getBackendRoute(entity, "monitores"))
      .then((res) => {
        if (res.status === 200) {
          setMonitoresFromBd(res.data);
        }
      })
      .catch((error) => {
        toast(exceptionHandler(error));
      })
      .finally(fetchTableData.onClose);
  }, [monitorFormSubmit.isOpen]);

  const columns = useMemo(
    () => [
      {
        Header: "Matrícula",
        accessor: "matricula",
        Cell: ({ value }) => <Box>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Monitor",
        accessor: "nome",
        Cell: ({ value }) => <Box minW={200}>{maskCapitalize(value)}</Box>,
        Footer: false,
      },
      {
        Header: "Escritórios Atribuídos",
        accessor: "escritoriosRegionais",
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map((colab, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id}>
                    {maskCapitalize(colab.nome)}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={colab.id} as="i">
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
        Header: "Demandantes Atribuídos",
        accessor: ({ demandantes }) =>
          demandantes.map(({ id, sigla, nome }) => ({
            id,
            nome: `${sigla} - ${nome}`,
          })),
        Cell: ({ value }) => (
          <Box minW={200}>
            {value.map(({ id, nome }, idx, arr) => {
              if (idx < 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={id}>
                    {nome}
                  </Text>
                );
              }
              if (idx === 3) {
                return (
                  <Text noOfLines={1} fontSize="sm" key={id} as="i">
                    e outros {arr.length - idx}...
                  </Text>
                );
              }
            })}
          </Box>
          // <>{JSON.stringify(value)}</>
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
                    text: "Editar",
                    icon: <FiEdit />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      addMonitor.onOpen();
                    },
                  },
                  {
                    text: "Excluir",
                    icon: <FiTrash2 />,
                    onClick: () => {
                      setSelectedRow(props.row.original);
                      excluirMonitor.onOpen();
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

  return (
    <>
      <AnimatePresenceWrapper
        router={router}
        isLoaded={!fetchTableData.isOpen && !fetchRhApiData.isOpen}
      >
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading fontSize="1.4rem">Monitores</Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            onClick={addMonitor.onOpen}
          >
            Adicionar
          </Button>
        </Flex>
        <Table data={data} columns={columns} />
      </AnimatePresenceWrapper>

      {/* Adicionar/Editor monitor Overlay  */}
      <Overlay
        onClose={() => {
          addMonitor.onClose();
          formMonitor.reset({});
          if (selectedRow) {
            setSelectedRow(null);
          }
        }}
        isOpen={addMonitor.isOpen}
        header={selectedRow ? "Editar Monitor" : "Adicionar Monitor"}
        closeButton
      >
        <chakra.form
          onSubmit={formMonitor.handleSubmit(onSubmitMonitor)}
          w="100%"
        >
          <Stack spacing={4}>
            <SelectInputBox
              id="monitor"
              label="Colaborador"
              formControl={formMonitor}
              options={colaboradoresOptions}
              defaultValue={
                !_.isEmpty(selectedRow) &&
                !_.isEmpty(colaboradoresOptions) &&
                colaboradoresOptions.find(
                  ({ value }) => parseInt(value) === selectedRow.matricula
                )
              }
              isDisabled={selectedRow}
              required={!selectedRow}
            />
            <SelectInputBox
              id="erAssoc"
              label="Escritórios Regionais Associados"
              formControl={formMonitor}
              options={escritoriosFromBd}
              defaultValue={
                selectedRow &&
                escritoriosFromBd.filter(({ value }) =>
                  selectedRow.escritoriosRegionais.find(
                    ({ id }) => id === value
                  )
                )
              }
              required={!selectedRow}
              isMulti
            />
            <SelectInputBox
              id="demandantesAssociados"
              label="Demandantes Associados"
              formControl={formMonitor}
              options={demandantesOptions}
              defaultValue={
                selectedRow &&
                Object.assign(
                  Array.from(selectedRow.demandantes).map(
                    ({ id, nome, sigla }) => ({
                      value: id,
                      label: `${sigla} - ${nome}`,
                    })
                  )
                )
              }
              required={!selectedRow}
              isMulti
            />
          </Stack>
          <HStack py={6} justifyContent="flex-end">
            <Button
              colorScheme="brand1"
              type="submit"
              isLoading={monitorFormSubmit.isOpen}
              isDisabled={!formMonitorValidation}
              loadingText="Salvando"
              shadow="md"
            >
              {selectedRow ? "Salvar" : "Cadastrar"}
            </Button>
          </HStack>
        </chakra.form>
      </Overlay>

      {/* Excluir monitor Modal  */}
      <Modal
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isOpen={excluirMonitor.isOpen}
        isCentered
        size="lg"
        trapFocus={false}
        onClose={excluirMonitor.onClose}
        onCloseComplete={() => setSelectedRow(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Excluir Monitor(a)</Box>
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
              <Heading size="md">Deseja excluir o seguinte Monitor(a)?</Heading>
              <Text fontSize="xl" align="center">
                {selectedRow?.matricula} - {maskCapitalize(selectedRow?.nome)}
              </Text>
              <HStack>
                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    deleteMonitor(selectedRow);
                  }}
                  isLoading={monitorFormSubmit.isOpen}
                  loadingText="Aguarde"
                >
                  Excluir
                </Button>
                <Button
                  colorScheme="brand1"
                  variant="outline"
                  onClick={() => {
                    excluirMonitor.onClose();
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

Monitores.auth = true;
Monitores.dashboard = true;
