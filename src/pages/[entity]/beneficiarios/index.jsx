import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Tooltip,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { Dropzone } from "components/Dropzone";
import { SelectInputBox } from "components/Inputs/SelectInputBox";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import { useCustomForm } from "hooks";
import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FiEye, FiFilter, FiPlus, FiTrash2 } from "react-icons/fi";
import { axios, filesAPIUpload, getBackendRoute } from "services";

export default function Beneficiarios({ entity, ...props }) {
  const fetchTableData = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const [uploadProgress, setUploadProgress] = useState(null);
  const [controller, setController] = useState(null);
  const formUpload = useCustomForm();
  const [benefFromBd, setBenefFromBd] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [escritoriosFromBd, setEscritoriosFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const [situacoesFromBd, setSituacoesFromBd] = useState([]);
  const [formacoesFromBd, setFormacoesFromBd] = useState([]);
  const [tableRowsCount, setTableRowsCount] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useBoolean();

  const onSubmit = async (data) => {
    formUpload.setLoading();
    const formData = new FormData();

    data.anexos.map((file, idx) => formData.append(`files`, file));

    const config = {
      signal: controller.signal,
      onUploadProgress: (event) => {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    };

    filesAPIUpload
      .post(`/uploadFile`, formData, config)
      .then(({ status, data }) => {
        if (status === 200) {
          router.push(
            `${router.asPath}/importar?fileId=${data[0].id}`,
            router.asPath + "/importar"
          );
        }
      })
      .catch((err) => {
        if (err.message === "canceled") {
          setController(new AbortController());
          return onToggle();
        }
        return console.log(err);
      })
      .finally(formUpload.setLoaded);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nome Beneficiário",
        accessor: "nome",
        Footer: false,
      },
      {
        Header: "CPF",
        accessor: "cpf",
        Footer: false,
      },
      {
        Header: "Matrícula FLEM",
        accessor: "matriculaFlem",
        Footer: false,
      },
      {
        Header: "Demandante",
        accessor: (row) =>
          `${row.vaga.demandante.sigla} - ${row.vaga.demandante.nome}`,
        Cell: ({ value }) => {
          return <Box minW={200}>{value}</Box>;
        },
        Footer: false,
      },
      // {
      //   Header: "Município Vaga",
      //   accessor: "municipio_vaga",
      //   Footer: false,
      // },
      // {
      //   Header: "Escritório Regional",
      //   accessor: "escritorio_regional",
      //   Footer: false,
      // },
      {
        Header: "Município Vaga",
        accessor: "vaga.municipio.nome",
        Cell: ({ value }) => {
          return <Box minW={200}>{value}</Box>;
        },
        Footer: false,
      },
      {
        Header: "Situação Vaga",
        accessor: (row) =>
          `${row.vaga.situacaoVaga.tipoSituacao.nome} - ${row.vaga.situacaoVaga.nome}`,
        Cell: ({ value }) => {
          return <Box minW={200}>{value}</Box>;
        },
        Footer: false,
      },
      {
        Header: "Escritório Regional",
        accessor: "vaga.municipio.escritorioRegional.nome",
        Cell: ({ value }) => {
          return <Box minW={200}>{value}</Box>;
        },
        Footer: false,
      },
      {
        Header: "Ações",
        props: { teste: "true" },
        Cell: ({
          row: {
            original: { id },
          },
        }) => (
          <IconButton
            icon={<FiEye />}
            onClick={() => router.push(`/${entity}/beneficiarios/${id}`)}
            variant="outline"
            colorScheme="brand1"
            _focus={{
              boxShadow: "0 0 0 3px var(--chakra-colors-brand1-300)",
            }}
          />
        ),
        Footer: false,
      },
    ],
    []
  );

  const data = useMemo(() => tableData, [tableData]);

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath]);

  useEffect(() => {
    fetchTableData.onOpen();
    axios
      .get(getBackendRoute(entity, "beneficiarios"))
      .then(({ data }) => {
        const rows = data.map(({ vaga, ...benef }) => ({
          ...benef,
          vaga: vaga.shift(),
        }));
        setBenefFromBd(rows);
        setTableData(rows);
      })
      .finally(fetchTableData.onClose);
  }, []);

  useEffect(() => {
    setController(new AbortController());
  }, []);

  const filtroAvancadoForm = useCustomForm();

  const filtroAvancadoFormSubmit = async (formData, e) => {
    e.preventDefault();
    const {
      escritoriosRegionais = [],
      municipios = [],
      demandantes = [],
      situacaoBenef = [],
      formacoes = [],
    } = formData;

    const filteredRows = benefFromBd
      .filter(
        ({
          vaga: {
            municipio: { escritorio_RegionalId },
          },
        }) =>
          _.isEmpty(escritoriosRegionais)
            ? true
            : escritoriosRegionais
                .map(({ value }) => value)
                .includes(escritorio_RegionalId)
      )

      .filter(({ vaga: { municipio_Id } }) =>
        _.isEmpty(municipios)
          ? true
          : municipios.map(({ value }) => value).includes(municipio_Id)
      )

      .filter(({ vaga: { demandante_Id } }) =>
        _.isEmpty(demandantes)
          ? true
          : demandantes.map(({ value }) => value).includes(demandante_Id)
      )
      .filter(({ vaga: { situacaoVaga_Id } }) =>
        _.isEmpty(situacaoBenef)
          ? true
          : situacaoBenef.map(({ value }) => value).includes(situacaoVaga_Id)
      )
      .filter(({ formacao_Id }) =>
        _.isEmpty(formacoes)
          ? true
          : formacoes.map(({ value }) => value).includes(formacao_Id)
      );

    setTableData(filteredRows);
    if (
      _.isEmpty(escritoriosRegionais) &&
      _.isEmpty(municipios) &&
      _.isEmpty(demandantes) &&
      _.isEmpty(situacaoBenef) &&
      _.isEmpty(formacoes)
    ) {
      setFiltroAtivo.off();
    } else {
      setFiltroAtivo.on();
    }
    return filtroAvancadoForm.closeOverlay();
  };

  const limparFiltroAvancado = () => {
    setTableData(benefFromBd);
    return setFiltroAtivo.off();
  };

  const escritoriosRegionais = filtroAvancadoForm.control.watch(
    "escritoriosRegionais"
  );
  const municipios = filtroAvancadoForm.control.watch("municipios");

  useEffect(() => {
    axios
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
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    filtroAvancadoForm.control.control._fields.municipios?._f.ref.clearValue();
  }, [escritoriosRegionais]);

  useEffect(() => {
    axios
      .get(
        getBackendRoute(entity, "municipios"),
        _.isEmpty(escritoriosRegionais)
          ? {}
          : {
              params: {
                escritorioRegional_Id: JSON.stringify(
                  escritoriosRegionais?.map(({ value }) => value)
                ),
              },
            }
      )
      .then((res) => {
        if (res.status === 200) {
          setMunicipiosFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  }, [escritoriosRegionais, municipios]);

  useEffect(() => {
    axios
      .get(getBackendRoute(entity, "demandantes"), {
        params: {
          municipio_Id: _.isEmpty(municipios)
            ? null
            : JSON.stringify(municipios?.map(({ value }) => value)),
          escritorioRegional_Id: _.isEmpty(escritoriosRegionais)
            ? null
            : JSON.stringify(escritoriosRegionais?.map(({ value }) => value)),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setDemandantesFromBd(
            res.data.map(({ id, nome, sigla }) => ({
              value: id,
              label: `${sigla} - ${nome}`,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
    filtroAvancadoForm.control.control._fields.demandantes?._f.ref.clearValue();
  }, [municipios]);

  useEffect(() => {
    axios
      .get(getBackendRoute(entity, "situacoes-vaga"))
      .then((res) => {
        if (res.status === 200) {
          setSituacoesFromBd(
            res.data.map(
              ({ id, nome, tipoSituacao: { nome: tipoSituacao } }) => ({
                value: id,
                label: `${tipoSituacao} - ${nome}`,
              })
            )
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  }, [filtroAvancadoForm.control.watch("")]);

  useEffect(() => {
    axios
      .get(getBackendRoute(entity, "formacoes"))
      .then((res) => {
        if (res.status === 200) {
          setFormacoesFromBd(
            res.data.map(({ id, nome }) => ({
              value: id,
              label: nome,
            }))
          );
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        throw new Error(error.response.data);
      });
  }, [filtroAvancadoForm.control.watch("")]);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!fetchTableData.isOpen}>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Box>
            <Heading fontSize="1.4rem">Beneficiários</Heading>
            <Heading size="xs" color="gray.500" mt={1}>
              {tableRowsCount && tableRowsCount.length === 1
                ? `${tableRowsCount} registro encontrado`
                : `${tableRowsCount} registros encontrados`}
            </Heading>
          </Box>
          <HStack>
            <Button
              colorScheme="brand1"
              shadow="md"
              leftIcon={<FiPlus />}
              onClick={onToggle}
            >
              Importar
            </Button>
            <ButtonGroup isAttached={filtroAtivo}>
              <Button
                colorScheme="brand1"
                shadow="md"
                leftIcon={
                  <FiFilter fill={filtroAtivo ? "currentColor" : "none"} />
                }
                onClick={filtroAvancadoForm.openOverlay}
                variant={filtroAtivo ? "solid" : "outline"}
              >
                Filtro Avançado {filtroAtivo && "Ativo"}
              </Button>

              <Tooltip label="Limpar Filtro" hidden={!filtroAtivo}>
                <IconButton
                  variant="solid"
                  colorScheme="red"
                  hidden={!filtroAtivo}
                  icon={<FiTrash2 />}
                  onClick={limparFiltroAvancado}
                />
              </Tooltip>
            </ButtonGroup>
          </HStack>
        </Flex>
        <SimpleGrid>
          <Table
            columns={columns}
            data={data}
            setRowsCount={setTableRowsCount}
          />
        </SimpleGrid>
      </AnimatePresenceWrapper>

      {/* Upload planilha de importação modal */}
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onToggle}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Importar Beneficiários</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack
              as={chakra.form}
              onSubmit={formUpload.handleSubmit(onSubmit)}
              w="100%"
              spacing={4}
            >
              <Dropzone
                id="anexos"
                onUploadProgress={uploadProgress}
                setUploadProgress={setUploadProgress}
                uploadController={controller}
                formControl={formUpload.control}
                validate={(v) => v?.length || "Adicione um arquivo"}
              />
              <Button
                colorScheme="brand1"
                type="submit"
                loadingText="Aguarde..."
                shadow="md"
                isDisabled={!formUpload.validation}
                isLoading={formUpload.isLoading}
              >
                Upload
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Filtro Avançado Overlay */}
      <Overlay
        closeOnOverlayClick={true}
        isOpen={filtroAvancadoForm.overlayIsOpen}
        onClose={filtroAvancadoForm.closeOverlay}
        header="Filtro Avançado"
        closeButton
      >
        <Heading size="md" mb={4}>
          Selecionar filtros:
        </Heading>
        <Stack
          as={chakra.form}
          onSubmit={filtroAvancadoForm.handleSubmit(filtroAvancadoFormSubmit)}
        >
          <SelectInputBox
            id="escritoriosRegionais"
            label="Escritórios Regionais"
            formControl={filtroAvancadoForm.control}
            options={escritoriosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="municipios"
            label="Municípios"
            formControl={filtroAvancadoForm.control}
            options={municipiosFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="demandantes"
            label="Demandantes"
            formControl={filtroAvancadoForm.control}
            options={demandantesFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="situacaoBenef"
            label="Situação"
            formControl={filtroAvancadoForm.control}
            options={situacoesFromBd}
            isMulti
            required={false}
          />
          <SelectInputBox
            id="formacoes"
            label="Formações"
            formControl={filtroAvancadoForm.control}
            options={formacoesFromBd}
            isMulti
            required={false}
          />
          <HStack justifyContent="flex-end" pt={4}>
            <Button type="submit" colorScheme="brand1">
              Filtrar
            </Button>
          </HStack>
        </Stack>
      </Overlay>
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

Beneficiarios.auth = true;
Beneficiarios.dashboard = true;
