import {
  Box,
  chakra,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Logo } from "components/Logo";
import "quill/dist/quill.snow.css";
import { useQuill } from "react-quilljs";

// const QuillMention = dynamic(() => import("quill-mention"), { ssr: false });

/**
 * Renderiza a ferramenta de impressão de dados dentro do Editor de Texto
 * @method Print
 * @memberof module:templates-oficios
 * @param {Object} entity a "entidade" ou "localização" do Projeto Primeiro Emprego
 * @returns {Component} página renderizada
 */
export default function Oficios({ entity, ...props }) {
  const { isOpen: isLoaded, onOpen: onLoad, onClose } = useDisclosure();
  const router = useRouter();
  const { asPath } = router;
  const session = useSession();

  useEffect(() => {
    if (entity === null) {
      router.push("/ba/dashboard");
    } else {
      setTimeout(onLoad, 1000);
    }
  }, [asPath]);

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
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Ofício Nº " },
      { attributes: { bold: true }, insert: "{Ofício}" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { attributes: { bold: true }, insert: "À" },
      { attributes: { align: "justify" }, insert: "\n" },
      { attributes: { bold: true }, insert: "{Unidade de Lotação}" },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        attributes: { bold: true },
        insert:
          "{Logradouro da Unidade de Lotação}, {Bairro da Unidade de Lotação}",
      },
      { attributes: { align: "justify" }, insert: "\n" },
      { attributes: { bold: true }, insert: "{Município Vaga} - BA" },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { attributes: { bold: true }, insert: "Ilmo. (a) Senhor (a)" },
      { attributes: { align: "justify" }, insert: "\n" },
      { attributes: { bold: true }, insert: "{Ponto Focal na Unidade}" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: " " },
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
      { attributes: { bold: true }, insert: "{Sigla Demandante}" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Município da VAGA: " },
      { attributes: { bold: true }, insert: "{Município Vaga} - BA" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Nome Beneficiário: " },
      { attributes: { bold: true }, insert: "{Nome}" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Formação: " },
      { attributes: { bold: true }, insert: "{Formação Beneficiário}" },
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
        attributes: { color: "#0563c1", link: "http://srf.flem.org.br" },
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
          link: "http://primeiroempregobahia.flem.org.br",
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
      { insert: " " },
      { attributes: { align: "justify" }, insert: "\n" },
      {
        insert:
          "Atenciosamente,                                                                                          ",
      },
      { attributes: { align: "justify" }, insert: "\n\n" },
      { insert: "Maria Carla Sena Lopes" },
      { attributes: { align: "justify" }, insert: "\n" },
      { attributes: { color: "black" }, insert: "Projeto Primeiro Emprego" },
      { attributes: { align: "justify" }, insert: "\n" },
      { insert: "Fundação Luís Eduardo Magalhães (FLEM)" },
      { attributes: { align: "justify" }, insert: "\n" },
    ],
  };
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

  quill?.setContents(delta2);

  // useEffect(()=> {
  //   if(window){
  //     window.print()
  //   }
  // },[])

  return (
    <Flex justifyContent="center" bg="white" flex="1 1 0%">
      <Box w="210mm">
        <Box
          id="page-header"
          pos="fixed"
          top={0}
          w="210mm"
          h={100}
          zIndex="1000"
          bg="white"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            h="full"
            px={14}
            pt={14}
          >
            <Logo h={30} my={12} />

            <button type="button" onClick={() => window.print()}>
              Clique para Imprimir
            </button>
            <Image
              alt="LogoBA"
              src="https://www.planserv.ba.gov.br/wp-content/uploads/2022/07/Brasa%E2%95%A0ao-Horizontal_Cor.png"
              h={50}
            />
          </Flex>
        </Box>

        <Box id="page-footer" pos="fixed" bottom={0} w="full" h="70px">
          <Flex px={14}>
            <Box>
              <Text
                fontSize={9}
                borderTop="1px"
                borderTopColor="gray.300"
                borderTopStyle="dotted"
                pt={1}
              >
                <chakra.span fontWeight="bold">Endereço: </chakra.span> Rua
                Visconde de Itaborahy, 845, Amaralina, Salvador - BA 41900-000
              </Text>
              <Text fontSize={9}>
                <chakra.span fontWeight="bold">Contato: </chakra.span> (71)
                3103-7500
              </Text>
            </Box>
          </Flex>
        </Box>

        <table>
          <thead>
            <tr>
              <td>
                <Box h={100} id="page-header-space" />
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <Box
                  className="page"
                  ref={quillRef}
                  fontSize={12}
                  px={10}
                  align="justify"
                />
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                <Box h="70px" id="page-footer-space"></Box>
              </td>
            </tr>
          </tfoot>
        </table>
      </Box>
    </Flex>
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
