import
  {
    Box,
    Button,
    chakra,
    Divider,
    Fade,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    SimpleGrid,
    Spinner,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    useBoolean,
    useBreakpointValue,
    useNumberInput
  } from "@chakra-ui/react";
import { AnimatePresenceWrapper } from "components/AnimatePresenceWrapper";
import { FormMaker } from "components/Form";
import { Overlay } from "components/Overlay";
import { Table } from "components/Table";
import download from "downloadjs";
import { motion } from "framer-motion";
import { useCustomForm } from "hooks";
import { DateTime } from "luxon";
import { celularMask, cepMask, cpfMask } from "masks-br";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import
  {
    FiAlertCircle,
    FiDownload,
    FiLock,
    FiMinus,
    FiPlus,
    FiUnlock
  } from "react-icons/fi";
import
  {
    axios,
    filesAPIService,
    filesAPIUpload,
    getBackendRoute
  } from "services";
import { variants } from "styles/transitions";

export default function Beneficiarios({ entity, idBeneficiario }) {
  const router = useRouter();
  const [unlockEdit, setUnlockEdit] = useBoolean();
  const [benefDataIsLoading, setBenefDataIsLoading] = useBoolean(true);
  const [benefDataReloading, setBenefDataReloading] = useBoolean(false);
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadController, setUploadController] = useState(null);
  const [benefData, setBenefData] = useState([]);
  const [benefDataNotFound, setBenefDataNotFound] = useState(true);
  const formDadosBeneficiario = useCustomForm();

  const fileUpload = async (data, params) => {
    const config = {
      signal: uploadController.signal,
      onUploadProgress: (event) => {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
      params,
    };
    const response = await filesAPIUpload.post(`/uploadFile`, data, config);
    return response;
  };

  const onSubmit = ({ anexoDocumento, ...formData }, e) => {
    formDadosBeneficiario.setLoading();
    e.preventDefault();
    const anexos = new FormData();
    formData.dataNasc = DateTime.fromSQL(formData.dataNasc)
      .setLocale("pt-BR")
      .toISO();
    formData.dataEntregaMaterial = DateTime.fromSQL(
      formData.dataEntregaMaterial
    )
      .setLocale("pt-BR")
      .toISO();

    if (anexoDocumento) {
      anexoDocumento.map((file, idx) => anexos.append(`files`, file));
    }

    if (anexos.getAll("files").length) {
      fileUpload(anexos).then((res) => {
        formData.anexos = res.data[0];
        axios
          .put(
            getBackendRoute(entity, `beneficiarios/${benefData.id}`),
            {
              params: {
                id: benefData.id,
              },
            },
            formData
          )
          .then(({ data }) => console.log(data))
          .catch((err) => console.log(err))
          .finally(() => {
            formDadosBeneficiario.setLoaded();
            setUnlockEdit.off();
          });
      });
    } else {
      axios
        .put(
          getBackendRoute(entity, `beneficiarios/${benefData.id}`),
          {
            params: {
              id: benefData.id,
            },
          },
          formData
        )
        .then(({ data }) => console.log(data))
        .catch((err) => console.log(err))
        .finally(() => {
          formDadosBeneficiario.setLoaded();
          setUnlockEdit.off();
        });
    }
  };

  const panels = [
    {
      label: "Dados",
      content: (
        <Dados
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
        />
      ),
    },
    {
      label: "Formação",
      content: (
        <Formacao
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
        />
      ),
    },
    {
      label: "Documentos",
      content: (
        <Documentos
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
          onSubmit={formDadosBeneficiario.handleSubmit(onSubmit)}
          formState={{
            isLoading: formDadosBeneficiario.isLoading,
            validation: formDadosBeneficiario.validation,
          }}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          uploadController={uploadController}
        />
      ),
    },
    {
      label: "Pendências",
      content: (
        <Pendencias
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
        />
      ),
    },
    {
      label: "Histórico",
      content: (
        <Historico
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
          onSubmit={formDadosBeneficiario.handleSubmit(onSubmit)}
          formState={{
            isLoading: formDadosBeneficiario.isLoading,
            validation: formDadosBeneficiario.validation,
          }}
        />
      ),
    },
    {
      label: "Materiais",
      content: (
        <Materiais
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
          onSubmit={formDadosBeneficiario.handleSubmit(onSubmit)}
          formState={{
            isLoading: formDadosBeneficiario.isLoading,
            validation: formDadosBeneficiario.validation,
          }}
        />
      ),
    },
    {
      label: "Informações Sigilosas",
      content: (
        <InformacoesSigilosas
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
          onSubmit={formDadosBeneficiario.handleSubmit(onSubmit)}
          formState={{
            isLoading: formDadosBeneficiario.isLoading,
            validation: formDadosBeneficiario.validation,
          }}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
          uploadController={uploadController}
        />
      ),
    },
    {
      label: "Vaga",
      content: (
        <Vaga
          data={benefData}
          entity={entity}
          formControl={formDadosBeneficiario.control}
          unlockEdit={unlockEdit && !benefDataReloading}
        />
      ),
    },
  ];

  useEffect(() => {
    setBenefDataReloading.on();
    axios
      .get(getBackendRoute(entity, "beneficiarios"), {
        params: {
          id: idBeneficiario,
        },
      })
      .then(({ data }) => {
        if (data) {
          setBenefData(data);
          setBenefDataNotFound(false);
        }
      })
      .catch((err) => new Error(err))
      .finally(() => {
        setBenefDataIsLoading.off();
        setBenefDataReloading.off();
      });
  }, [unlockEdit, formDadosBeneficiario.isLoading]);

  useEffect(() => {
    setUploadController(new AbortController());
  }, []);

  return (
    <>
      <AnimatePresenceWrapper router={router} isLoaded={!benefDataIsLoading}>
        <Fade in={!benefDataNotFound} unmountOnExit>
          <chakra.form onSubmit={formDadosBeneficiario.handleSubmit(onSubmit)}>
            <HStack pb={5}>
              <Heading size="md">
                Dados do Beneficiário - {benefData && benefData.nome}
              </Heading>
              <Tooltip
                hasArrow
                label={
                  unlockEdit
                    ? "Bloquear para Edição"
                    : "Desbloquear para Edição"
                }
                bg={unlockEdit ? "red.700" : "brand1.700"}
                placement="bottom"
              >
                <IconButton
                  icon={
                    unlockEdit && !benefDataReloading ? (
                      <FiUnlock size={22} />
                    ) : (
                      <FiLock size={22} />
                    )
                  }
                  colorScheme={unlockEdit ? "red" : "brand1"}
                  variant={
                    unlockEdit && !benefDataReloading ? "solid" : "ghost"
                  }
                  size="sm"
                  onClick={() => {
                    setUnlockEdit.toggle();
                    setBenefDataReloading.on();
                  }}
                  isDisabled={unlockEdit && formDadosBeneficiario.isLoading}
                  isLoading={benefDataReloading}
                  transition="all .2s ease-in-out"
                />
              </Tooltip>
              <Fade in={unlockEdit && !benefDataReloading} unmountOnExit>
                <Button
                  type="submit"
                  colorScheme="brand1"
                  size="sm"
                  isLoading={formDadosBeneficiario.isLoading}
                  isDisabled={!formDadosBeneficiario.validation}
                  loadingText="Aguarde..."
                >
                  Salvar alterações
                </Button>
              </Fade>
            </HStack>
            <Tabs
              variant="soft-rounded"
              colorScheme="brand1"
              size="md"
              bg="gray.100"
              shadow="md"
              rounded="lg"
              isFitted={useBreakpointValue({ base: true, md: false })}
            >
              <TabList
                flexWrap="wrap"
                borderBottom="2px"
                borderColor="brand1.500"
                p={2}
                shadow="md"
              >
                {panels.map(({ label, content }, idx) => (
                  <Tab
                    key={`tab-${label}`}
                    rounded="lg"
                    fontSize="xs"
                    _selected={{
                      shadow: "inner",
                      bg: "brand1.100",
                      color: "brand1.700",
                    }}
                    _hover={{
                      transform: "scale(1.1) ",
                      color: "brand1.400",
                    }}
                    transition="all .2s ease-in-out"
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {panels.map(({ label, content }, idx) => (
                  <TabPanel key={`tab-${label}`} p={0} roundedBottom="lg">
                    <motion.div
                      initial="pageInitial"
                      animate="pageAnimate"
                      exit="pageExit"
                      variants={variants}
                    >
                      <Box pos="relative">
                        <Stack
                          p={4}
                          rounded="lg"
                          shadow="md"
                          spacing={3}
                          opacity={
                            (benefDataReloading ||
                              formDadosBeneficiario.isLoading) &&
                            0.2
                          }
                          transition="all .2s ease-in-out"
                        >
                          {content}
                        </Stack>
                        <Box pos="absolute" top="4" right="4">
                          <Fade
                            in={
                              benefDataReloading ||
                              formDadosBeneficiario.isLoading
                            }
                          >
                            <HStack>
                              <Text>Carregando</Text>
                              <Spinner
                                color="brand1.500"
                                thickness="2px"
                                speed=".5s"
                                emptyColor="gray.200"
                              />
                            </HStack>{" "}
                          </Fade>
                        </Box>
                      </Box>
                    </motion.div>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </chakra.form>
        </Fade>
        <Fade in={benefDataNotFound} unmountOnExit>
          <Box bg="gray.200" mt={2} rounded="lg" shadow="md">
            <HStack p={10} justifyContent="space-between">
              <Heading size="md" color="brand1.700">
                Beneficiário não localizado
              </Heading>
              <Icon
                as={FiAlertCircle}
                boxSize={10}
                bg="red.600"
                color="whiteAlpha.800"
                p={1}
                rounded="md"
              />
            </HStack>
          </Box>
        </Fade>
      </AnimatePresenceWrapper>
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { entity, idBeneficiario },
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
      idBeneficiario,
    },
  };
}

const Dados = ({ data, entity, formControl, unlockEdit }) => {
  const [etniasFromBd, setEtniasFromBd] = useState(null);
  const [tamanhosFromBd, setTamanhosFromBd] = useState(null);
  const [territorioIdentidade, setTerritorioIdentidade] = useState(null);
  const [cepData, setCepData] = useState({
    street: data?.logradouro,
    neighborhood: data?.bairro,
    city: data?.municipio,
    state: data?.uf,
  });
  const [buscaCep, setBuscaCep] = useBoolean();
  const [emailQtd, setEmailQtd] = useState([0]);
  const [telefoneQtd, setTelefoneQtd] = useState([0]);

  const getEtnias = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "etnias"));
    const etniasOptions = data.map(({ id, etnia }) => ({
      value: id,
      label: etnia,
    }));
    setEtniasFromBd(etniasOptions);
  });

  const getTamanhoUniforme = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "tamanhos-uniforme")
    );
    const tamanhoOptions = data.map(({ id, tamanho }) => ({
      value: id,
      label: tamanho,
    }));
    setTamanhosFromBd(tamanhoOptions);
  });

  const getTerritorioIdentidade = useCallback(async () => {
    const { data: municipios } = await axios.get(
      getBackendRoute(entity, "municipios")
    );
    const municipioFiltered = municipios.find(
      ({ nome }) => nome === data?.municipio
    );
    setTerritorioIdentidade(municipioFiltered?.territorioIdentidade);
  });

  const formDadosPessoais = [
    {
      id: "nome",
      label: "Nome",
      placeholder: "Nome Beneficiario",
      formControl,
    },
    {
      id: "dataNasc",
      label: "Data de Nascimento",
      placeholder: "Data de Nascimento Beneficiario",
      formControl,
      type: "date",
      validate: (v) => DateTime.isDateTime(DateTime.fromSQL(v)),
    },
    {
      id: "cpf",
      label: "CPF",
      placeholder: "CPF Beneficiario",
      formControl,
      mask: cpfMask,
    },
    {
      id: "rg",
      label: "RG",
      placeholder: "RG Beneficiario",
      formControl,
      type: "number",
    },
    {
      id: "sexo",
      label: "Sexo",
      placeholder: "Sexo Beneficiario",
      formControl,
      type: "select",
      options: [
        {
          id: "Masculino",
          label: "Masculino",
        },
        {
          id: "Feminino",
          label: "Feminino",
        },
      ],
    },
    {
      id: "etnia_Id",
      label: "Etnia",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: etniasFromBd,
    },
    {
      id: "observacao",
      label: "Observações",
      placeholder: "Observações Beneficiário",
      formControl,
    },
  ];

  const formDadosRh = [
    {
      id: "matriculaFlem",
      label: "Matrícula RH",
      placeholder: "Matrícula RH Beneficiario",
      formControl,
      type: "number",
    },
    {
      id: "ctps",
      label: "CTPS",
      placeholder: "CTPS Beneficiario",
      formControl,
    },
    {
      id: "pis",
      label: "PIS",
      placeholder: "PIS Beneficiario",
      formControl,
      type: "number",
    },
    {
      id: "deficiencia",
      label: "Deficiência",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: [
        {
          value: "nenhuma",
          label: "Nenhuma",
        },
        {
          value: "deficiencia auditiva",
          label: "Deficiência Auditiva",
        },
        {
          value: "deficiencia fisica",
          label: "Deficiência Física",
        },
        {
          value: "deficiencia intelectual",
          label: "Deficiência Intelectual",
        },
        {
          value: "deficiencia visual",
          label: "Deficiência Visual",
        },
      ],
    },
    {
      id: "tamanhoUniforme_Id",
      label: "Tamanho Fardamento",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: tamanhosFromBd,
    },
  ];

  const formEndereco = [
    {
      id: "cep",
      label: "CEP",
      placeholder: "CEP Beneficiario",
      formControl,
      mask: cepMask,
      inputRightElement: (
        <Box w={24}>
          <Button
            colorScheme="brand1"
            size="xs"
            variant="outline"
            hidden={!(unlockEdit && formControl.getValues("cep")?.length === 9)}
            onClick={() => consultaEndereco()}
            isLoading={buscaCep}
          >
            Buscar CEP
          </Button>
        </Box>
      ),
    },
    {
      id: "logradouro",
      label: "Logradouro",
      placeholder: "Logradouro",
      formControl,
      defaultValue: cepData.street,
    },
    {
      id: "numero",
      label: "Número",
      placeholder: "Número",
      formControl,
    },
    {
      id: "complemento",
      label: "Complemento",
      placeholder: "Complemento",
      formControl,
    },
    {
      id: "bairro",
      label: "Bairro",
      placeholder: "Bairro",
      formControl,
      defaultValue: cepData.neighborhood,
    },
    {
      id: "municipio",
      label: "Município",
      placeholder: "Município",
      formControl,
      defaultValue: cepData.city,
    },
    {
      id: "uf",
      label: "UF",
      placeholder: "UF",
      formControl,
      defaultValue: cepData.state,
    },
    {
      id: "territorio",
      label: "Território",
      placeholder: "Território",
      formControl,
      defaultValue: territorioIdentidade?.nome,
      readOnly: true,
    },
  ];

  const formEmail = new Array().concat(
    ...emailQtd.map((obj, idx, arr) => [
      {
        id: `email.${idx}`,
        formControl,
        placeholder: "email@exemplo.com",
        defaultValue: obj.contato,
      },
      {
        id: `obsEmail.${idx}`,
        formControl,
        placeholder: "Observação",
        defaultValue: obj.observacao,
        inputRightElement: (
          <IconButton
            colorScheme="brand1"
            size="sm"
            variant="outline"
            hidden={!unlockEdit}
            onClick={() => {
              if (idx === 0 && arr.length >= 1) {
                setEmailQtd((prev) => [...prev, emailQtd.length + 1]);
              } else {
                setEmailQtd((prev) => prev.filter((obj, idx2) => idx2 !== idx));
                formControl.unregister(`email`);
                formControl.unregister(`obsEmail`);
              }
            }}
            isLoading={buscaCep}
          >
            {idx === 0 ? arr.length >= 1 && <FiPlus /> : <FiMinus />}
          </IconButton>
        ),
      },
    ])
  );

  const formTelefone = new Array().concat(
    ...telefoneQtd.map((obj, idx, arr) => [
      {
        id: `celular.${idx}`,
        formControl,
        placeholder: "(11) 98765-4321",
        mask: celularMask,
        defaultValue: obj.contato,
      },
      {
        id: `obsCelular.${idx}`,
        formControl,
        placeholder: "Observação",
        defaultValue: obj.observacao,
        inputRightElement: (
          <IconButton
            colorScheme="brand1"
            size="sm"
            variant="outline"
            hidden={!unlockEdit}
            onClick={() => {
              if (idx === 0 && arr.length >= 1) {
                setTelefoneQtd((prev) => [...prev, telefoneQtd.length + 1]);
              } else {
                setTelefoneQtd((prev) =>
                  prev.filter((obj, idx2) => idx2 !== idx)
                );
                formControl.unregister(`celular`);
                formControl.unregister(`obsCelular`);
              }
            }}
            isLoading={buscaCep}
          >
            {idx === 0 ? arr.length >= 1 && <FiPlus /> : <FiMinus />}
          </IconButton>
        ),
      },
    ])
  );

  const consultaEndereco = async () => {
    const cep = formControl.getValues("cep");
    try {
      setBuscaCep.on();
      const { data } = await axios.get(getBackendRoute(entity, "ext/cep"), {
        params: {
          cep: cep,
        },
      });
      setCepData(data);
    } catch (error) {
      setCepData({});
    } finally {
      setBuscaCep.off();
    }
  };

  useEffect(() => {
    if (data && data.contatos.length >= 1) {
      const telefones = data.contatos.filter(
        ({ tipoContato_Id }) => tipoContato_Id === "celular"
      );
      const emails = data.contatos.filter(
        ({ tipoContato_Id }) => tipoContato_Id === "email"
      );

      setEmailQtd(emails.length ? emails : [0]);
      setTelefoneQtd(telefones.length ? telefones : [0]);
    }
  }, [data?.contatos]);

  useEffect(() => {
    getEtnias();
    getTamanhoUniforme();
  }, []);

  useEffect(() => {
    getTerritorioIdentidade();
  }, [data?.municipio]);

  return (
    <>
      <Box>
        <Heading color="brand1.700" size="md" mb={4} py={1}>
          Dados Pessoais
        </Heading>
        <FormMaker inlineForm unlockEdit={unlockEdit} data={data}>
          {formDadosPessoais}
        </FormMaker>
      </Box>

      <Divider borderColor="gray.500" variant="dashed" />

      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Dados RH
        </Heading>
        <FormMaker inlineForm unlockEdit={unlockEdit} data={data}>
          {formDadosRh}
        </FormMaker>
      </Box>

      <Divider borderColor="gray.500" variant="dashed" />

      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Endereço
        </Heading>
        <FormMaker inlineForm unlockEdit={unlockEdit} data={data}>
          {formEndereco}
        </FormMaker>
      </Box>
      <Divider borderColor="gray.500" variant="dashed" />
      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Contatos
        </Heading>
        <SimpleGrid columns={2}>
          <Heading color="brand1.700" size="sm" mt={6}>
            Telefone / Celular
          </Heading>
          <Heading color="brand1.700" size="sm" mt={6}>
            Observação
          </Heading>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <FormMaker inlineForm unlockEdit={unlockEdit} data={data}>
            {formTelefone}
          </FormMaker>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <Heading color="brand1.700" size="sm" mt={6}>
            E-mail
          </Heading>
          <Heading color="brand1.700" size="sm" mt={6}>
            Observação
          </Heading>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <FormMaker inlineForm unlockEdit={unlockEdit} data={data}>
            {formEmail}
          </FormMaker>
        </SimpleGrid>
      </Box>
    </>
  );
};

const Formacao = ({ data, entity, formControl, unlockEdit }) => {
  const [formacoesFromBd, setFormacoesFromBd] = useState([]);
  const [formacoesOptions, setFormacoesOptions] = useState([]);
  const [loadingFormacoes, setLoadingFormacoes] = useBoolean(false);

  const getFormacoes = useCallback(async () => {
    setLoadingFormacoes.on();
    const { data } = await axios.get(getBackendRoute(entity, "formacoes"));
    const formacoesOptions = data.map(({ id, nome }) => ({
      value: id,
      label: nome,
    }));
    setFormacoesFromBd(data);
    setFormacoesOptions(formacoesOptions);
    setLoadingFormacoes.off();
  });

  const formFormacao = [
    {
      id: "matriculaSec",
      label: "Matrícula SEC",
      placeholder: "Matrícula SEC Beneficiário",
      formControl,
      type: "number",
    },
    {
      id: "escolaMunicipio",
      label: "Município da instituição de ensino",
      formControl,
    },
    {
      id: "escolaConclusao",
      label: "Nome da instituição de ensino",
      formControl,
    },
    {
      id: "eixoFormacao_Id",
      label: "Eixo de Formação",
      placeholder: "Selecione...",
      formControl,
      defaultValue: data?.formacao?.eixo?.nome,
      disabled: true,
    },
    {
      id: "formacao_Id",
      label: "Formação",
      placeholder: loadingFormacoes ? "Carregando..." : "Selecione...",
      formControl,
      type: "select",
      options: formacoesOptions,
      defaultValue: formacoesOptions.find(
        ({ value }) => value === data?.formacao.id
      )?.value,
      onChange: (e) =>
        formControl.setValue(
          "eixoFormacao_Id",
          formacoesFromBd.find(({ id }) => id === e.target.value).eixo.nome
        ),
    },
    {
      id: "anamnese",
      label: "Anamnese",
      formControl,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
    },
  ];

  const formCursoSuperior = [
    {
      id: "superiorConcluido",
      label: "Concluiu Ensino Superior?",
      formControl,
      type: "select",
      placeholder: "Não Informado",
      options: [
        {
          value: "N",
          label: "Não",
        },
        {
          value: "S",
          label: "Sim",
        },
      ],
    },
    {
      id: "superiorCursando",
      label: "Está cursando Ensino Superior?",
      formControl,
      type: "select",
      placeholder: "Não Informado",
      options: [
        {
          value: "N",
          label: "Não",
        },
        {
          value: "S",
          label: "Sim",
        },
      ],
      showIn: formControl.getValues("superiorConcluido") === "N",
    },
    {
      id: "superiorTipo",
      label: "Tipo de Instituição (Particular ou Pública)",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: [
        {
          value: "particular",
          label: "Particular",
        },
        {
          value: "publica",
          label: "Pública",
        },
      ],
      // required: "Obrigatório",
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S",
    },
    {
      id: "superiorCurso",
      label: "Curso",
      formControl,
      // required: "Obrigatório",
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S",
    },
    {
      id: "superiorInstituicao",
      label: "Instituição",
      formControl,
      // required: "Obrigatório",
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S",
    },
    {
      id: "superiorModalidade",
      label: "Modalidade de Ensino",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: [
        {
          value: "ead",
          label: "EAD",
        },
        {
          value: "presencial",
          label: "Presencial",
        },
        {
          value: "semi",
          label: "Semipresencial",
        },
      ],
      // required: "Obrigatório",
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S",
    },
    {
      id: "superiorAnoInicio",
      label: "Ano de início",
      formControl,
      type: "number",
      // required: "Obrigatório",
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S",
      validate: (v) => v <= DateTime.now().year || "Ano inválido",
    },
    {
      id: "superiorAnoConclusao",
      label: "Ano de conclusão",
      formControl,
      type: "number",
      // required: "Obrigatório",
      showIn: formControl.getValues("superiorConcluido") === "S",
      validate: (v) => v <= DateTime.now().year || "Ano inválido",
    },
    {
      id: "superiorPeriodo",
      label: "Período",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: [
        {
          value: "1",
          label: "1º Período",
        },
        {
          value: "2",
          label: "2º Período",
        },
        {
          value: "3",
          label: "3º Período",
        },
        {
          value: "4",
          label: "4º Período",
        },
        {
          value: "5",
          label: "5º Período",
        },
        {
          value: "6",
          label: "6º Período",
        },
      ],
      // required: "Obrigatório",
      showIn: formControl.getValues("superiorCursando") === "S",
    },
    {
      id: "superiorPretende",
      label: "Pretende fazer Curso Superior?",
      formControl,
      type: "select",
      placeholder: "Não Informado",
      options: [
        {
          value: "N",
          label: "Não",
        },
        {
          value: "S",
          label: "Sim",
        },
      ],
      showIn: formControl.getValues("superiorCursando") === "N",
    },
    {
      id: "tecnicoMatriculadoOutro",
      label: "Está matriculado em outro curso técnico e/ou profissionalizante?",
      formControl,
      type: "select",
      placeholder: "Não Informado",
      options: [
        {
          value: "N",
          label: "Não",
        },
        {
          value: "S",
          label: "Sim",
        },
      ],
      showIn: formControl.getValues("superiorPretende") === "N",
    },
    {
      id: "cursoTipo",
      label: "Tipo de Instituição (Particular ou Pública)",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: [
        {
          value: "particular",
          label: "Particular",
        },
        {
          value: "publica",
          label: "Pública",
        },
      ],
      // required: "Obrigatório",
      showIn: formControl.getValues("tecnicoMatriculadoOutro") === "S",
    },
    {
      id: "tecnicoCursandoOutro",
      label: "Curso",
      formControl,
      // required: "Obrigatório",
      showIn: formControl.getValues("tecnicoMatriculadoOutro") === "S",
    },
    {
      id: "rendaPpeAjuda",
      label: "Renda do PPE ajudou na manutenção do curso?",
      formControl,
      type: "select",
      placeholder: "Não Informado",
      options: [
        {
          value: "N",
          label: "Não",
        },
        {
          value: "S",
          label: "Sim",
        },
      ],
      showIn:
        formControl.getValues("superiorConcluido") === "S" ||
        formControl.getValues("superiorCursando") === "S" ||
        formControl.getValues("tecnicoMatriculadoOutro") === "S",
    },
  ];

  useEffect(() => {
    getFormacoes();
  }, [data]);

  useEffect(() => {
    if (formControl.getValues("superiorConcluido") === "S") {
      formControl.setValue("superiorCursando", "");
      formControl.setValue("superiorPretende", "");
      formControl.setValue("tecnicoMatriculadoOutro", "");
    }
    if (formControl.getValues("superiorConcluido") === "N") {
      formControl.setValue("superiorTipo", "");
      formControl.setValue("superiorCurso", "");
      formControl.setValue("superiorInstituicao", "");
      formControl.setValue("superiorModalidade", "");
      formControl.setValue("superiorAnoInicio", "");
      formControl.setValue("superiorAnoConclusao", "");
      formControl.setValue("superiorPeriodo", "");
      formControl.setValue("cursoTipo", "");
      formControl.setValue("tecnicoCursandoOutro", "");
      formControl.setValue("rendaPpeAjuda", "");
    }
  }, [formControl.getValues("superiorConcluido")]);

  useEffect(() => {
    if (formControl.getValues("superiorCursando") === "S") {
      formControl.setValue("superiorPretende", "");
      formControl.setValue("tecnicoMatriculadoOutro", "");
    }
    if (formControl.getValues("superiorCursando") === "N") {
      formControl.setValue("superiorTipo", "");
      formControl.setValue("superiorCurso", "");
      formControl.setValue("superiorInstituicao", "");
      formControl.setValue("superiorModalidade", "");
      formControl.setValue("superiorAnoInicio", "");
      formControl.setValue("superiorAnoConclusao", "");
      formControl.setValue("superiorPeriodo", "");
      formControl.setValue("cursoTipo", "");
      formControl.setValue("rendaPpeAjuda", "");
    }
  }, [formControl.getValues("superiorCursando")]);

  useEffect(() => {
    if (formControl.getValues("superiorPretende") === "S") {
      formControl.setValue("tecnicoMatriculadoOutro", "");
      formControl.setValue("cursoTipo", "");
      formControl.setValue("tecnicoCursandoOutro", "");
      formControl.setValue("rendaPpeAjuda", "");
    }
  }, [formControl.getValues("superiorPretende")]);

  useEffect(() => {
    if (formControl.getValues("tecnicoMatriculadoOutro") === "N") {
      formControl.setValue("cursoTipo", "");
      formControl.setValue("tecnicoCursandoOutro", "");
      formControl.setValue("rendaPpeAjuda", "");
    }
  }, [formControl.getValues("tecnicoMatriculadoOutro")]);

  return (
    <>
      <Box>
        <Heading color="brand1.700" size="md" mb={4} py={1}>
          Formação
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formFormacao}
        </FormMaker>
      </Box>
      <Divider borderColor="gray.500" variant="dashed" />
      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Ensino Superior
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formCursoSuperior}
        </FormMaker>
      </Box>
    </>
  );
};

const Documentos = ({
  data,
  formControl,
  entity,
  formState,
  unlockEdit,
  onSubmit,
  uploadProgress,
  setUploadProgress,
  uploadController,
}) => {
  const [openAddHistorico, setOpenAddHistorico] = useBoolean();

  const downloadFile = async (id) => {
    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: {
        referenceObjId: id,
      },
    });
    const { data: file } = await filesAPIService.get(`/downloadFile`, {
      params: {
        fileId: fileDetails.id,
      },
      responseType: "blob",
    });

    download(file, fileDetails.name, fileDetails.contentType);
  };

  const tableDocumentosColumns = useMemo(
    () => [
      {
        Header: "criado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box minW={200}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Criado por",
        accessor: "createdBy",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
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
            icon={<FiDownload />}
            onClick={() => downloadFile(id)}
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

  const tableDocumentosData = useMemo(
    () => data.documentos.filter(({ sigiloso }) => !sigiloso),
    [data?.documentos]
  );

  const formDocumentoInputs = [
    {
      id: "descricaoDocumento",
      label: "Descrição",
      formControl: formControl,
      required: "Obrigatório",
    },
    {
      id: "anexoDocumento",
      formControl: formControl,
      type: "file",
      uploadProgress,
      setUploadProgress,
      uploadController,
      validate: (v) => v.length || "Obrigatório",
      mt: 4,
    },
    {
      id: "docSigiloso",
      formControl: formControl,
      type: "hidden",
      defaultValue: "false",
    },
  ];

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading color="brand1.700" size="md" py={1}>
            Documentos
          </Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            size="sm"
            hidden={!unlockEdit || formState.isLoading}
            onClick={setOpenAddHistorico.on}
            zIndex="banner"
          >
            Adicionar
          </Button>
        </Flex>
        {tableDocumentosData && tableDocumentosData.length ? (
          <Table data={tableDocumentosData} columns={tableDocumentosColumns} />
        ) : (
          <Heading size="sm" color="gray.600">
            Nenhum registro foi encontrado.
          </Heading>
        )}
      </Box>

      {/* Adicionar histórico Overlay  */}
      <Overlay
        onClose={() => {
          formControl.unregister(formDocumentoInputs.map(({ id }) => id));
          setOpenAddHistorico.off();
        }}
        isOpen={unlockEdit && openAddHistorico}
        header="Adicionar Documento"
        closeButton
        onCloseComplete={setOpenAddHistorico.off}
      >
        <FormMaker inlineForm data={data}>
          {formDocumentoInputs}
        </FormMaker>
        <HStack justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="brand1"
            isLoading={formState.isLoading}
            isDisabled={!formState.validation}
            loadingText="Aguarde..."
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </HStack>
      </Overlay>
    </>
  );
};

const Pendencias = ({ data, formControl, entity, unlockEdit }) => {
  const [tiposPendenciasFromBd, setTiposPendenciasFromBd] = useState([]);

  const getPendenciasTipos = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "pendencias/tipos")
    );
    setTiposPendenciasFromBd(data);
  });

  const formDocumentosPendentes = tiposPendenciasFromBd
    .filter(({ label }) => !label.includes("Vale"))
    .filter(({ label }) => !label.includes("Plano"))
    .map(({ id, label }) => ({
      id: `pendencias.${id}`,
      label,
      formControl,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      defaultValue:
        data &&
        Array.isArray(data.pendencias) &&
        data.pendencias
          .filter(({ tipoPendencia_Id }) => tipoPendencia_Id === id)
          .pop()?.pendente,
    }));

  const formBeneficiosPendentes = tiposPendenciasFromBd
    .filter(({ label }) => label.includes("Vale") || label.includes("Plano"))
    .map(({ id, label }) => ({
      id: `pendencias.${id}`,
      label,
      formControl,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
      defaultValue:
        data &&
        Array.isArray(data.pendencias) &&
        data.pendencias
          .filter(({ tipoPendencia_Id }) => tipoPendencia_Id === id)
          .pop()?.pendente,
    }));

  useEffect(() => {
    getPendenciasTipos();
  }, []);

  return (
    <>
      <Box>
        <Heading color="brand1.700" size="md" mb={4} py={1}>
          Benefícios Pendentes
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formBeneficiosPendentes}
        </FormMaker>
      </Box>
      <Divider borderColor="gray.500" variant="dashed" />
      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Documentos Pendentes
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formDocumentosPendentes}
        </FormMaker>
      </Box>
    </>
  );
};

const Historico = ({
  data,
  formControl,
  entity,
  formState,
  unlockEdit,
  onSubmit,
}) => {
  const [tiposHistoricoFromBd, setTiposHistoricoFromBd] = useState([]);
  const [openAddHistorico, setOpenAddHistorico] = useBoolean();

  const getTiposHistorico = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "tipos-historico")
    );
    const tiposOptions = data
      .filter(({ sigiloso }) => !sigiloso)
      .filter(({ nome }) => !["Documento", "Documento Sigiloso"].includes(nome))
      .map(({ id, nome }) => ({
        value: id,
        label: nome,
      }));
    setTiposHistoricoFromBd(tiposOptions);
  });

  const tableHistoricoColumns = useMemo(
    () => [
      {
        Header: "criado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box minW={200}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "tipo",
        accessor: "tipoHistorico.nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Criado por",
        accessor: "createdBy",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
    ],
    []
  );

  const tableHistoricoData = useMemo(
    () => data.historico.filter(({ sigiloso }) => !sigiloso),
    [data?.historico]
  );

  const formHistoricoInputs = [
    {
      id: "idCatHistorico",
      label: "Categoria",
      placeholder: "Selecione...",
      formControl: formControl,
      type: "select",
      options: tiposHistoricoFromBd,
      required: "Obrigatório",
    },
    {
      id: "descricaoHistorico",
      label: "Descrição",
      formControl: formControl,
      required: "Obrigatório",
    },
    {
      id: "histSigiloso",
      formControl: formControl,
      type: "hidden",
      defaultValue: "false",
    },
  ];

  useEffect(() => {
    getTiposHistorico();
  }, [openAddHistorico]);

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading color="brand1.700" size="md" py={1}>
            Histórico
          </Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            size="sm"
            hidden={!unlockEdit}
            onClick={setOpenAddHistorico.on}
            zIndex="banner"
          >
            Adicionar
          </Button>
        </Flex>
        {tableHistoricoData.length ? (
          <Table data={tableHistoricoData} columns={tableHistoricoColumns} />
        ) : (
          <Heading size="sm" color="gray.600">
            Nenhum registro foi encontrado.
          </Heading>
        )}
      </Box>

      {/* Adicionar histórico Overlay  */}
      <Overlay
        onClose={() => {
          formControl.unregister(formHistoricoInputs.map(({ id }) => id));
          setOpenAddHistorico.off();
        }}
        isOpen={unlockEdit && openAddHistorico}
        header="Adicionar Histórico"
        closeButton
        onCloseComplete={setOpenAddHistorico.off}
      >
        <FormMaker inlineForm data={data}>
          {formHistoricoInputs}
        </FormMaker>
        <HStack justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="brand1"
            isLoading={formState.isLoading}
            isDisabled={!formState.validation}
            loadingText="Aguarde..."
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </HStack>
      </Overlay>
    </>
  );
};

const Materiais = ({
  data,
  formControl,
  entity,
  formState,
  unlockEdit,
  onSubmit,
}) => {
  const [openAddMaterial, setOpenAddMaterial] = useBoolean();
  const [materiaisFromBd, setMateriaisFromBd] = useState();
  const [tamanhosFromBd, setTamanhosFromBd] = useState();
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      min: 1,
      max: 99,
      defaultValue: 1,
      onChange: (v) => formControl.setValue("qtdMaterial", v),
    });

  const formEntregaMateriais = [
    {
      id: "dataEntregaMaterial",
      label: "Data de Entrega",
      formControl,
      type: "date",
      required: true,
      validate: (v) => DateTime.fromSQL(v).toJSDate() !== "Invalid Date",
    },
    {
      id: "idMaterial",
      label: "Material",
      placeholder: "Selecione...",
      formControl: formControl,
      type: "select",
      options: materiaisFromBd,
      required: true,
    },
    {
      id: "idTamanho",
      label: "Tamanho",
      placeholder: "Selecione...",
      formControl: formControl,
      type: "select",
      options: tamanhosFromBd,
      required: true,
    },
    {
      id: "qtdMaterial",
      label: "Quantidade",
      formControl: formControl,
      customInputProps: getInputProps,
      inputLeftElement: (
        <IconButton
          size="sm"
          colorScheme="brand1"
          variant="outline"
          {...getDecrementButtonProps()}
        >
          <FiMinus />
        </IconButton>
      ),
      inputRightElement: (
        <IconButton
          size="sm"
          colorScheme="brand1"
          variant="outline"
          {...getIncrementButtonProps()}
        >
          <FiPlus />
        </IconButton>
      ),
      textAlign: "center",
      defaultValue: "1",
    },
    {
      id: "obsMaterial",
      label: "Observações",
      formControl: formControl,
      type: "textarea",
    },
  ];

  const tableMateriaisColumns = useMemo(
    () => [
      {
        Header: "entregue em",
        accessor: "dataEntrega",
        Cell: ({ value }) => (
          <Box minW={200}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATE_MED)}
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "material",
        accessor: "tipo.nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "tamanho",
        accessor: "tamanhoEntregue.tamanho",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "quantidade",
        accessor: "quantidade",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "observações",
        accessor: "observacao",
        Cell: ({ value }) => (
          <Box minW={200} fontSize="sm">
            {value}
          </Box>
        ),
        Footer: false,
      },
    ],
    []
  );

  const tableMateriaisData = useMemo(
    () => data.materiaisEntregues,
    [data.materiaisEntregues]
  );

  const getMateriais = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "materiais"));
    const materiaisOptions = data.map(({ id, nome }) => ({
      value: id,
      label: nome,
    }));
    setMateriaisFromBd(materiaisOptions);
  });

  const getTamanhosUniforme = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "tamanhos-uniforme")
    );
    const tamanhosOptions = data.map(({ id, tamanho }) => ({
      value: id,
      label: tamanho,
    }));
    setTamanhosFromBd(tamanhosOptions);
  });

  useEffect(() => {
    getMateriais();
    getTamanhosUniforme();
  }, [openAddMaterial]);
  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading color="brand1.700" size="md" py={1}>
            Materiais
          </Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            size="sm"
            hidden={!unlockEdit}
            onClick={setOpenAddMaterial.on}
            zIndex="banner"
          >
            Adicionar
          </Button>
        </Flex>
        {tableMateriaisData.length ? (
          <Table data={tableMateriaisData} columns={tableMateriaisColumns} />
        ) : (
          <Heading size="sm" color="gray.600">
            Nenhum registro foi encontrado.
          </Heading>
        )}
      </Box>

      {/* Adicionar entrega de material Overlay  */}
      <Overlay
        onClose={() => {
          formControl.unregister(formEntregaMateriais.map(({ id }) => id));
          setOpenAddMaterial.off();
        }}
        isOpen={unlockEdit && openAddMaterial}
        header="Informar entrega de material"
        closeButton
        onCloseComplete={setOpenAddMaterial.off}
      >
        <FormMaker inlineForm data={data}>
          {formEntregaMateriais}
        </FormMaker>
        <HStack justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="brand1"
            isLoading={formState.isLoading}
            isDisabled={!formState.validation}
            loadingText="Aguarde..."
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </HStack>
      </Overlay>
    </>
  );
};

const InformacoesSigilosas = ({
  data,
  formControl,
  entity,
  formState,
  unlockEdit,
  onSubmit,
  uploadProgress,
  setUploadProgress,
  uploadController,
}) => {
  const [tiposHistoricoFromBd, setTiposHistoricoFromBd] = useState([]);
  const [openAddHistoricoSigiloso, setOpenAddHistoricoSigiloso] = useBoolean();
  const [openAddDocumentoSigiloso, setOpenAddDocumentoSigiloso] = useBoolean();

  const getTiposHistorico = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "tipos-historico")
    );
    const tiposOptions = data
      .filter(({ sigiloso }) => sigiloso)
      .filter(({ nome }) => !["Documento"].includes(nome))
      .map(({ id, nome }) => ({
        value: id,
        label: nome,
      }));
    setTiposHistoricoFromBd(tiposOptions);
  });

  const downloadFile = async (id) => {
    const {
      data: { fileDetails },
    } = await filesAPIService.get(`/getFile`, {
      params: {
        referenceObjId: id,
      },
    });
    const { data: file } = await filesAPIService.get(`/downloadFile`, {
      params: {
        fileId: fileDetails.id,
      },
      responseType: "blob",
    });

    download(file, fileDetails.name, fileDetails.contentType);
  };

  const tableHistoricoSigilosoColumns = useMemo(
    () => [
      {
        Header: "criado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box minW={200}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "tipo",
        accessor: "tipoHistorico.nome",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Criado por",
        accessor: "createdBy",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
    ],
    []
  );

  const tableHistoricoSigilosoData = useMemo(
    () => data.historico.filter(({ sigiloso }) => sigiloso),
    [data.historico]
  );

  const tableDocumentosSigilososColumns = useMemo(
    () => [
      {
        Header: "criado em",
        accessor: "createdAt",
        Cell: ({ value }) => (
          <Box minW={200}>
            {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_MED)}h
          </Box>
        ),
        Footer: false,
      },
      {
        Header: "descrição",
        accessor: "descricao",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Criado por",
        accessor: "createdBy",
        Cell: ({ value }) => <Box minW={200}>{value}</Box>,
        Footer: false,
      },
      {
        Header: "Ações",
        Cell: ({
          row: {
            original: { id },
          },
        }) => (
          <IconButton
            icon={<FiDownload />}
            onClick={() => downloadFile(id)}
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

  const tableDocumentosSigilososData = useMemo(
    () => data.documentos.filter(({ sigiloso }) => sigiloso),
    [data?.documentos]
  );

  const formHistoricoSigilosoInputs = [
    {
      id: "idCatHistorico",
      label: "Categoria",
      placeholder: "Selecione...",
      formControl: formControl,
      type: "select",
      options: tiposHistoricoFromBd,
      required: "Obrigatório",
    },
    {
      id: "descricaoHistorico",
      label: "Descrição",
      formControl: formControl,
      required: "Obrigatório",
    },
    {
      id: "histSigiloso",
      formControl: formControl,
      type: "hidden",
      defaultValue: true,
    },
  ];

  const formDocumentoSigilosoInputs = [
    {
      id: "descricaoDocumento",
      label: "Descrição",
      formControl: formControl,
      required: "Obrigatório",
    },
    {
      id: "anexoDocumento",
      formControl: formControl,
      type: "file",
      uploadProgress,
      setUploadProgress,
      uploadController,
      validate: (v) => v.length || "Obrigatório",
      mt: 4,
    },
    {
      id: "docSigiloso",
      formControl: formControl,
      type: "hidden",
      defaultValue: "true",
    },
  ];

  useEffect(() => {
    getTiposHistorico();
  }, [openAddHistoricoSigiloso]);

  return (
    <>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading color="brand1.700" size="md" py={1}>
            Histórico Sigiloso
          </Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            size="sm"
            hidden={!unlockEdit}
            onClick={setOpenAddHistoricoSigiloso.on}
            zIndex="banner"
          >
            Adicionar
          </Button>
        </Flex>
        {tableHistoricoSigilosoData.length ? (
          <Table
            data={tableHistoricoSigilosoData}
            columns={tableHistoricoSigilosoColumns}
          />
        ) : (
          <Heading size="sm" color="gray.600">
            Nenhum registro foi encontrado.
          </Heading>
        )}
      </Box>
      <Divider borderColor="gray.500" variant="dashed" />
      <Box>
        <Flex justifyContent="space-between" alignItems="center" pb={5}>
          <Heading color="brand1.700" size="md" py={1}>
            Documentos Sigilosos
          </Heading>
          <Button
            colorScheme="brand1"
            shadow="md"
            leftIcon={<FiPlus />}
            size="sm"
            hidden={!unlockEdit || formState.isLoading}
            onClick={setOpenAddDocumentoSigiloso.on}
            zIndex="banner"
          >
            Adicionar
          </Button>
        </Flex>
        {tableDocumentosSigilososData.length ? (
          <Table
            data={tableDocumentosSigilososData}
            columns={tableDocumentosSigilososColumns}
          />
        ) : (
          <Heading size="sm" color="gray.600">
            Nenhum registro foi encontrado.
          </Heading>
        )}
      </Box>

      {/* Adicionar histórico Overlay  */}
      <Overlay
        onClose={() => {
          formControl.unregister(
            formHistoricoSigilosoInputs.map(({ id }) => id)
          );
          setOpenAddHistoricoSigiloso.off();
        }}
        isOpen={unlockEdit && openAddHistoricoSigiloso}
        header="Adicionar Histórico Sigiloso"
        closeButton
        onCloseComplete={setOpenAddHistoricoSigiloso.off}
      >
        <FormMaker inlineForm data={data}>
          {formHistoricoSigilosoInputs}
        </FormMaker>
        <HStack justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="brand1"
            isLoading={formState.isLoading}
            isDisabled={!formState.validation}
            loadingText="Aguarde..."
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </HStack>
      </Overlay>

      {/* Adicionar documento Overlay  */}
      <Overlay
        onClose={() => {
          formControl.unregister(
            formDocumentoSigilosoInputs.map(({ id }) => id)
          );
          setOpenAddDocumentoSigiloso.off();
        }}
        isOpen={unlockEdit && openAddDocumentoSigiloso}
        header="Adicionar Documento Sigiloso"
        closeButton
        onCloseComplete={setOpenAddDocumentoSigiloso.off}
      >
        <FormMaker inlineForm data={data}>
          {formDocumentoSigilosoInputs}
        </FormMaker>
        <HStack justifyContent="flex-end">
          <Button
            type="submit"
            colorScheme="brand1"
            isLoading={formState.isLoading}
            isDisabled={!formState.validation}
            loadingText="Aguarde..."
            onClick={onSubmit}
          >
            Salvar
          </Button>
        </HStack>
      </Overlay>
    </>
  );
};

const Vaga = ({ data, entity, formControl, unlockEdit }) => {
  const [demandantesFromBd, setDemandantesFromBd] = useState([]);
  const [formacoesFromBd, setFormacoesFromBd] = useState([]);
  const [municipiosFromBd, setMunicipiosFromBd] = useState([]);
  const [unidadesLotacaoFromBd, setUnidadesLotacaoFromBd] = useState([]);
  const [situacoesVagaFromBd, setSituacoesVagaFromBd] = useState([]);
  const [distanciaVaga, setDistanciaVaga] = useState([]);
  const [vagaInfo, setVagaInfo] = useState([]);

  const getDemandantes = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "demandantes"));
    const demandantesOptions = data.map(({ id, sigla, nome }) => ({
      value: id,
      label: `${sigla} - ${nome}`,
    }));
    setDemandantesFromBd(demandantesOptions);
  });

  const getFormacoes = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "formacoes"));
    const formacoesOptions = data.map(({ id, nome }) => ({
      value: id,
      label: nome,
    }));
    setFormacoesFromBd(formacoesOptions);
  });

  const getMunicipios = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "municipios"));
    const formacoesOptions = data.map(({ id, nome }) => ({
      value: id,
      label: nome,
    }));
    setMunicipiosFromBd(formacoesOptions);
  });

  const getUnidadesLotacao = useCallback(async () => {
    const { data } = await axios.get(
      getBackendRoute(entity, "unidades-lotacao")
    );
    const unidadesOptions = data.map(({ id, nome }) => ({
      value: id,
      label: nome,
    }));
    setUnidadesLotacaoFromBd(unidadesOptions);
  });

  const getSituacoesVaga = useCallback(async () => {
    const { data } = await axios.get(getBackendRoute(entity, "situacoes-vaga"));
    const unidadesOptions = data.map(({ id, nome, tipoSituacao }) => ({
      value: id,
      label: `${tipoSituacao.nome} - ${nome}`,
    }));
    setSituacoesVagaFromBd(unidadesOptions);
  });

  const getDistanciaVaga = useCallback(async () => {
    if (data.municipio && vagaInfo?.municipio?.nome) {
      const origem = `${data.municipio} - ${entity}`;
      const destino = `${vagaInfo?.municipio?.nome} - ${entity}`;

      const { data: response } = await axios.get(
        getBackendRoute(entity, "ext/distancia"),
        {
          params: {
            origem,
            destino,
          },
        }
      );
      setDistanciaVaga(response);
    }
  });

  const formVaga = [
    {
      id: "demandante_Id",
      label: "Demandante",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: demandantesFromBd,
      defaultValue: demandantesFromBd.find(
        ({ value }) => vagaInfo?.demandante_Id === value
      )?.value,
    },
    // {
    //   id: "formacao_Id",
    //   label: "Formação",
    //   placeholder: "Selecione...",
    //   formControl,
    //   type: "select",
    //   options: formacoesFromBd,
    //   defaultValue: formacoesFromBd.find(
    //     ({ value }) => data?.formacao_Id === value
    //   )?.value,
    // },
    {
      id: "situacaoVaga_Id",
      label: "Situação",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: situacoesVagaFromBd,
      defaultValue: situacoesVagaFromBd.find(
        ({ value }) => vagaInfo?.situacaoVaga_Id === value
      )?.value,
    },
    {
      id: "escritorioRegional",
      label: "Escritório Regional",
      formControl,
      defaultValue: vagaInfo?.municipio?.escritorioRegional?.nome,
      readOnly: true,
    },
    {
      id: "territorioIdentidade",
      label: "Território",
      placeholder: "Território Vaga",
      formControl,
      defaultValue: vagaInfo?.municipio?.territorioIdentidade?.nome,
      readOnly: true,
    },
    {
      id: "vaga_municipio_Id",
      label: "Município Vaga",
      placeholder: "Município Vaga",
      formControl,
      type: "select",
      options: municipiosFromBd,
      defaultValue: municipiosFromBd.find(
        ({ value }) => vagaInfo?.municipio_Id === value
      )?.value,
    },
    {
      id: "municipio",
      label: "Município Residência",
      placeholder: "Município Residência",
      formControl,
      readOnly: true,
    },
    {
      id: "distanciaMunicipios",
      label: "Distância entre Municípios",
      placeholder: "Distância entre Municípios",
      formControl,
      defaultValue: distanciaVaga?.distance?.text,
      readOnly: true,
    },
    {
      id: "unidadeLotacao_Id",
      label: "Unidade de Lotação",
      placeholder: "Selecione...",
      formControl,
      type: "select",
      options: unidadesLotacaoFromBd,
      defaultValue: unidadesLotacaoFromBd.find(
        ({ value }) => vagaInfo?.unidadeLotacao_Id === value
      )?.value,
    },
  ];

  const formSec = [
    {
      id: "dataConvocacao",
      label: "Data de Convocação",
      placeholder: "Data de Convocação",
      formControl,
      defaultValue: vagaInfo?.dataConvocacao
        ? DateTime.fromISO(vagaInfo.dataConvocacao).toLocaleString(
            DateTime.DATE_MED
          )
        : null,
      readOnly: true,
    },
    {
      id: "remessa",
      label: "Remessa/Lote",
      placeholder: "Remessa/Lote",
      formControl,
      defaultValue: vagaInfo?.remessaSec?.remessa,
      readOnly: true,
    },
    {
      id: "data_remessa",
      label: "Data Remessa/Lote",
      placeholder: "Data Remessa/Lote",
      formControl,
      defaultValue: vagaInfo?.remessaSec?.data_remessa
        ? DateTime.fromISO(vagaInfo?.remessaSec?.data_remessa).toLocaleString(
            DateTime.DATE_MED
          )
        : null,
      readOnly: true,
    },
    {
      id: "mes_remessa",
      label: "Mês Remessa/Lote",
      placeholder: "Mês Remessa/Lote",
      formControl,
      defaultValue: vagaInfo?.remessaSec?.data_remessa
        ? DateTime.fromISO(vagaInfo?.remessaSec?.data_remessa)
            .setLocale("pt-BR")
            .toFormat("MMMM 'de' yyyy")
        : null,
      readOnly: true,
    },
    // {
    //   id: "1",
    //   label: "Data Envio da Situação",
    //   placeholder: "Data Envio da Situação",
    //   formControl,
    //   readOnly: true,
    // },
    {
      id: "publicadoDiarioOficial",
      label: "Publicação no Diário Oficial",
      formControl,
      defaultValue: vagaInfo?.publicadoDiarioOficial,
      type: "switch",
      checkedLabel: {
        true: "Sim",
        false: "Não",
      },
    },
  ];

  useEffect(() => {
    getDemandantes();
    getFormacoes();
    getMunicipios();
    getUnidadesLotacao();
    getSituacoesVaga();
  }, []);

  useEffect(() => {
    //const [ultimaVaga] = data.vaga.reverse();
    const [ultimaVaga] = data.vaga;
    setVagaInfo(ultimaVaga);
  }, [data.vaga]);

  useEffect(() => {
    getDistanciaVaga();
  }, [vagaInfo]);

  return (
    <>
      <Box>
        <Heading color="brand1.700" size="md" mb={4} py={1}>
          Dados da Vaga
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formVaga}
        </FormMaker>
      </Box>
      <Divider borderColor="gray.500" variant="dashed" />
      <Box>
        <Heading color="brand1.700" size="md" mb={4}>
          Informações Secretaria do Trabalho
        </Heading>
        <FormMaker inlineForm data={data} unlockEdit={unlockEdit}>
          {formSec}
        </FormMaker>
      </Box>
    </>
  );
};

Beneficiarios.auth = true;
Beneficiarios.dashboard = true;
