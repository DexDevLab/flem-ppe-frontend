/**
 *  Componentes de Visualizador de Texto
 *  @module TextViewer
 */

import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";

import "@deevotechvn/quill-mention/dist/quill.mention.min.css";
import { Logo } from "components/Logo";
import "quill/dist/quill.bubble.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";

/**
 * Componente de Visualizador de Texto
 * @method TextViewer
 * @memberof module:TextViewer
 * @param {Function} setContent define o conteúdo do texto
 * @param {Object} id define o id do componente
 * @param {Object} label define a label do componente
 * @param {Object} placeholder placeholder do form interno
 * @param {Object} validate parâmetros de validação da entrada
 * @param {Function} onChange indica mudança de estado ao alterar o valor
 * @param {Object} value valor do objeto
 * @returns {Component} componente estilizado
 */
export function TextViewer({
  setContent,
  id,
  label,
  type = "text",
  placeholder,
  required = "Obrigatório",
  validate,
  isLoaded = true,
  onChange,
  value,
  loadOnEditor,
  ...props
}) {
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
        allowedChars: /.*$/,
        mentionDenotationChars: ["@"],
        attributes: { bold: true },
        source: async function (searchTerm, renderList) {
          const matchedPeople = await suggestPeople(searchTerm);
          renderList(matchedPeople);
        },
      },
    },
    theme: "bubble",
    readOnly: true,
  });

  if (Quill && !quill) {
    // For execute this line only once.
    const { Mention, MentionBlot } = require("@deevotechvn/quill-mention"); // Install with 'yarn add quill-magic-url'
    Quill.register("modules/mention", Mention);
    Quill.register(MentionBlot);
  }

  useEffect(() => {
    if (quill && loadOnEditor) {
      quill.setContents(JSON.parse(loadOnEditor));
    }
  }, [quill, loadOnEditor]);

  return (
    <Box pb={6}>
      <FormControl w="100%" h="100%">
        <FormLabel>{label}</FormLabel>
        <Flex justifyContent="center">
          <Box
            shadow="md"
            w="210mm"
            minH="296.5mm"
            border="1px"
            borderColor="gray.200"
            rounded="lg"
            px={14}
            py={4}
          >
            <VStack h="100%" spacing={0}>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                h="10%"
                w="100%"
                px={1}
              >
                <Logo h={30} my={12} />
                <Image
                  alt="LogoBA"
                  src="https://www.planserv.ba.gov.br/wp-content/uploads/2022/07/Brasa%E2%95%A0ao-Horizontal_Cor.png"
                  h={50}
                />
              </Flex>
              <Skeleton isLoaded={isLoaded} fadeDuration={0.5} w="100%" h="90%">
                <Input
                  as={Box}
                  type={type}
                  placeholder={placeholder}
                  {...props}
                  className="page"
                  ref={quillRef}
                  w="100%"
                  h="99%"
                  fontSize={14}
                  p={0}
                  shadow="none"
                  sx={{
                    border:
                      "2px dashed var(--chakra-colors-gray-200) !important",
                  }}
                />
              </Skeleton>

              <Box w="100%" h="5%">
                <Box>
                  <Text fontSize={9}>
                    <chakra.span fontWeight="bold">Endereço: </chakra.span>
                    Rua Visconde de Itaborahy, 845, Amaralina, Salvador - BA
                    41900-000
                  </Text>
                  <Text fontSize={9}>
                    <chakra.span fontWeight="bold">Contato: </chakra.span>
                    (71) 3103-7500
                  </Text>
                </Box>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </FormControl>
    </Box>
  );
}
