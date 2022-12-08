import { Box, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiMoreHorizontal } from "react-icons/fi";

import { useReactToPrint } from "react-to-print";

// import htmlToDraft from 'html-to-draftjs';

import "@deevotechvn/quill-mention/dist/quill.mention.min.css";
import "quill/dist/quill.snow.css";
import { useQuill } from "react-quilljs";

// const QuillMention = dynamic(() => import("quill-mention"), { ssr: false });

export default function Oficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();
  const [selectedRow, setSelectedRow] = useState();
  const {
    isOpen: addMaterialIsOpen,
    onOpen: addMaterialOnOpen,
    onClose: addMaterialOnClose,
  } = useDisclosure();

  const columns = useMemo(
    () => [
      {
        Header: "Material",
        accessor: "nome_material",
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
          <IconButton
            icon={<FiMoreHorizontal />}
            onClick={() => setSelectedRow(props?.row?.original)}
            variant="outline"
            colorScheme="brand1"
          />
        ),
        Footer: false,
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      {
        nome_material: "Camisa Polo",
        descricao:
          "A camisa foi confecionada no modelo camisa polo em malha piquet PA, 60% poliéster e 40% algodão, na cor branca, com serigrafia (processo de impressão aplicável em tecido, frente, costas e mangas): marca da Carteira de Trabalho do lado esquerdo do peito, marca do governo da Bahia na manga do lado esquerdo e da Fundação Luís Eduardo Magalhães na maga do lado direito. Na parte de trás, centralizado horizontalmente e na parte superior: MAIS FORÇA PARA A JUVENTUDE VENCER",
      },
      {
        nome_material: "Jaleco",
        descricao: null,
      },
      {
        nome_material: "Avental",
        descricao: null,
      },
      {
        nome_material: "Crachá",
        descricao: null,
      },
      {
        nome_material: "Vale Alimentação",
        descricao: null,
      },
      {
        nome_material: "Vale Refeição",
        descricao: null,
      },
      {
        nome_material: "Vale Transporte",
        descricao: null,
      },
      {
        nome_material: "Máscara COVID 19",
        descricao: "Máscara a ser utilizada na prevenção do COVID19",
      },
    ],
    []
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = (formData) => {
    console.log(formData);
  };

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  async function suggestPeople(searchTerm) {
    return atValues.filter((person) =>
      person.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const atValues = [
    {
      id: "nome_beneficiario",
      value: "Nome do Beneficiário",
    },
    {
      id: "codigo_oficio",
      value: "Codigo do Oficio",
    },
    {
      id: "unidade_lotacao",
      value: "Unidade de Lotação",
    },
    {
      id: "logr_unidade_lotacao",
      value: "Logradouro da Unidade de Lotação",
    },
    {
      id: "bairr_unidade_lotacao",
      value: "Bairro da Unidade de Lotação",
    },
    {
      id: "munic_vaga",
      value: "Município da Vaga",
    },
    {
      id: "ponto_focal_unidade",
      value: "Ponto Focal da Unidade",
    },
    {
      id: "sigl_demandante",
      value: "Sigla do Demandante",
    },
    {
      id: "form_beneficiario",
      value: "Formação do Beneficiário",
    },
  ];

  const { quill, quillRef, Quill } = useQuill({
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "align",
      "list",
      "indent",
      "size",
      "header",
      "link",
      "image",
      "video",
      "color",
      "background",
      "clean",
      "mention",
    ],
    modules: {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ["@"],
        attributes: { bold: true },
        source: async function (searchTerm, renderList) {
          const matchedPeople = await suggestPeople(searchTerm);
          renderList(matchedPeople);
        },
      },
    },
  });

  if (Quill && !quill) {
    // For execute this line only once.
    const { Mention, MentionBlot } = require("@deevotechvn/quill-mention"); // Install with 'yarn add quill-magic-url'
    Quill.register(MentionBlot);
    Quill.register("modules/mention", Mention);
  }

  const delta = {
    ops: [
      { insert: "Salvador, 08 de junho de 2022." },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Ofício Nº " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "1",
            denotationChar: "@",
            id: "codigo_oficio",
            value: "Codigo do Oficio",
          },
        },
      },
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { attributes: { bold: true }, insert: "À" },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "unidade_lotacao",
            value: "Unidade de Lotação",
          },
        },
      },
      { attributes: { bold: true }, insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "logr_unidade_lotacao",
            value: "Logradouro da Unidade de Lotação",
          },
        },
      },
      { attributes: { bold: true }, insert: ", " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "bairr_unidade_lotacao",
            value: "Bairro da Unidade de Lotação",
          },
        },
      },
      { attributes: { bold: true }, insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "munic_vaga",
            value: "Município da Vaga",
          },
        },
      },
      { attributes: { bold: true }, insert: " - BA" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { attributes: { bold: true }, insert: "Ilmo. (a) Senhor (a)" },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "1",
            denotationChar: "@",
            id: "ponto_focal_unidade",
            value: "Ponto Focal da Unidade",
          },
        },
      },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Prezado (a) Senhor (a)" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Cumprimento-o cordialmente, ao tempo em que informo que a Fundação Luís Eduardo Magalhães (FLEM) integra a Coordenação do Projeto Primeiro Emprego, projeto de iniciativa do Excelentíssimo Governador do Estado Rui Costa, balizado pela Lei nº 14.395/2021.",
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Esta coordenação tem o compromisso de alocar, em diversos órgãos e entidades do Estado da Bahia, beneficiários da educação profissional. Desse modo, apresentamos, para alocação nesta unidade, em ",
      },
      { attributes: { bold: true }, insert: "09/06/2022, " },
      { insert: "às " },
      { attributes: { bold: true }, insert: "8h" },
      { insert: ":" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { insert: "Nome do Demandante: " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "sigl_demandante",
            value: "Sigla do Demandante",
          },
        },
      },
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Município da VAGA: " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "munic_vaga",
            value: "Município da Vaga",
          },
        },
      },
      { attributes: { bold: true }, insert: " - BA" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Nome Beneficiário: " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "nome_beneficiario",
            value: "Nome do Beneficiário",
          },
        },
      },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "#",
            id: "nome_beneficiario",
            value: "CÓDIGO_OFICIO",
          },
        },
      },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Formação: " },
      {
        attributes: { bold: true },
        insert: {
          mention: {
            index: "0",
            denotationChar: "@",
            id: "form_beneficiario",
            value: "Formação do Beneficiário",
          },
        },
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        attributes: { bold: true },
        insert:
          "Esta alocação atende à deliberação da COAPS, por intermédio do Sr. Ruy Braga, deliberou alteração de unidade de lotação. Ademais, informamos que o(a) egresso(a) já recebeu fardamento (duas camisas gola pólo para uso obrigatório) e se encontra com a Carteira de Trabalho e Previdência Social (CTPS) e o Contrato de Trabalho devidamente assinados.",
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        attributes: { bold: true },
        insert:
          "Seguindo os protocolos de segurança indispensável o uso da máscara e do comprovante de vacinação atualizado.",
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Informamos ainda que, as freqüências deverão ser registradas no ",
      },
      {
        attributes: { bold: true },
        insert: "Sistema de Registro de Freqüência (SRF)",
      },
      {
        insert:
          ". Ao final do mês, a folha deverá ser impressa e, após ser assinada pelo beneficiário e seu ponto focal (monitor), anexada no próprio sistema, por meio do link: ",
      },
      {
        attributes: { color: "#0563c1", link: "http://srf.flem.org.br/" },
        insert: "http:\\\\srf.flem.org.br",
      },
      { attributes: { color: "#0563c1", underline: true }, insert: "." },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Sobre o Curso de Aperfeiçoamento, comunicamos que o acesso é obrigatório, por meio do seguinte link: ",
      },
      {
        attributes: {
          color: "#0563c1",
          link: "http://primeiroempregobahia.flem.org.br/",
        },
        insert: "http:\\\\primeiroempregobahia.flem.org.br",
      },
      {
        insert:
          ". As dúvidas serão sanadas com a Equipe de Tutoria, disponível nos contatos: (71) 3103-7504/7505 ou pelo e-mail: ",
      },
      {
        attributes: {
          color: "#0563c1",
          link: "mailto:primeiroemprego.ava@flem.org.br",
        },
        insert: "primeiroemprego.ava@flem.org.br",
      },
      { insert: "." },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Dúvidas referentes a benefícios: salário, contracheque, auxílio-alimentação, auxílio-transporte, assistência médica, crachá, contrato, férias, entre outros, deverão ser tratadas com a Central de Relacionamento da FLEM, pelos números: (71) 3103 – 7567/7587 ou pelo e-mail: ",
      },
      {
        attributes: { color: "#0563c1", link: "mailto:crflem@flem.org.br" },
        insert: "crflem@flem.org.br",
      },
      { insert: "." },
      { attributes: { align: "justify" }, insert: "\n\n" },
      {
        insert:
          "Os assuntos relacionados às alocações e fardamento deverão ser tratados com a Central de Relacionamento e com a Área Administrativa do Projeto Primeiro Emprego, disponíveis nos seguintes contatos: (71) 3103 – 7567/7587 ou pelo e-mail: ",
      },
      {
        attributes: {
          color: "#0563c1",
          link: "mailto:primeiroemprego@flem.org.br",
        },
        insert: "primeiroemprego@flem.org.br",
      },
      { insert: "." },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        insert:
          "Atenciosamente,                                                                                          ",
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { insert: "Maria Carla Sena Lopes" },
      { attributes: { align: "justify" }, insert: "\n" },
      { attributes: { color: "black" }, insert: "Projeto Primeiro Emprego" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Fundação Luís Eduardo Magalhães (FLEM)" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      ,
    ],
  };

  //   quill?.setContents(delta);

  useEffect(() => {
    // if(window){
    //   window.print()
    // }
    if (quill) {
    }
  }, [quill]);

  const delta2 = {
    ops: [
      { insert: "Olá, " },
      {
        insert: {
          mention: {
            index: "0",
            denotationChar: "",
            id: "nome_beneficiario",
            value: "Acsa dos Santos Cerqueira",
          },
        },
      },
      { insert: " \n\nIsto é um teste.\n" },
    ],
  };

  //   delta.ops.forEach((obj, idx) => {
  //     if (obj.insert.mention) {
  //       console.log(obj);
  //       switch (obj.insert.mention.id) {
  //         case "nome_beneficiario":
  //           delta.ops[idx].insert.mention.denotationChar = "";
  //           delta.ops[idx].insert.mention.value = "Rodrigo Lima";
  //           break;

  //         default:
  //           break;
  //       }
  //     }
  //   });

  useEffect(() => {
    quill && quill.setContents(delta2);
  }, [delta]);

  //   console.log(quill && quill.getContents().ops.map((obj) => obj.insert.mention)[1].value)

  return (
    <Box justifyContent="center" bg="white" flex="1 1 0%">
      <Box
        className="page"
        ref={quillRef}
        fontSize={12}
        px={10}
        align="justify"
      />
    </Box>
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

Oficios.auth = false;
Oficios.dashboard = false;
