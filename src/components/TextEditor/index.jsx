/**
 *  Componentes de Editor de Texto
 *  @module TextEditor
 */

import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import "@deevotechvn/quill-mention/dist/quill.mention.min.css";
import { Logo } from "components/Logo";
import _ from "lodash";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { useQuill } from "react-quilljs";

/**
 * Componente de Editor de texto
 * @method TextEditor
 * @memberof module:TextEditor
 * @param {Object} formControl os dados do FormControl para interação
 * @param {Function} setContent define o conteúdo do texto
 * @param {Object} id define o id do componente
 * @param {Object} label define a label do componente
 * @param {Object} placeholder placeholder do form interno
 * @param {Object} loadOnEditor indica se será carregado ao editar
 * @param {Object} parametros parâmetros utilizados para realizar sugestões e edições
 * @returns {Component} componente de Editor de texto
 */
export function TextEditor({
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
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
  parametros,
  ...props
}) {
  async function suggestPeople(searchTerm) {
    return parametros.filter((parametro) => {
      return parametro.value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(
          searchTerm
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        );
    });
  }

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
          if (_.isArray(parametros)) {
            const matchedPeople = await suggestPeople(searchTerm);
            renderList(matchedPeople);
          }
        },
      },
    },
  });

  if (Quill && !quill) {
    // For execute this line only once.
    const { Mention, MentionBlot } = require("@deevotechvn/quill-mention"); // Install with 'yarn add quill-magic-url'
    Quill.register("modules/mention", Mention);
    Quill.register(MentionBlot);
  }

  quill &&
    quill.on("text-change", (delta) => {
      setValue(id, quill.getContents());
      trigger(id);
    });

  useEffect(() => {
    if (quill && loadOnEditor) {
      quill.setContents(JSON.parse(loadOnEditor));
    }
  }, [quill, quillRef, loadOnEditor]);

  return (
    // <Input
    //   as={Box}
    //   {...register("template", {
    //     onChange: (e) => console.log(e.target.value),
    //     setValue: setValue,
    //   })}
    //   type="text"
    //   id="template"
    //   className="page"
    //   ref={quillRef}
    //   w="100%"
    //   h="92%"
    //   fontSize={14}
    //   sx={{ border: "none !important" }}
    //   shadow="none"
    //   p={0}
    // />

    // <Box>
    <>
      <FormControl id={id} isInvalid={errors[id]} w="100%" h="100%">
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
                  src="https://www.bahia.ba.gov.br/wp-content/uploads/2023/01/LOGO-HEADER-COR_272x90px.png"
                  h={50}
                  alt="BHGovLogo"
                />
              </Flex>
              <Input
                as={Box}
                type={type}
                placeholder={placeholder}
                {...register(id, {
                  validate: (e) =>
                    quill.getLength() > 2 || "Digite um template válido",
                })}
                {...props}
                className="page"
                ref={quillRef}
                w="100%"
                h="91%"
                fontSize={14}
                p={0}
                shadow="none"
                sx={{
                  border: "2px dashed var(--chakra-colors-gray-200) !important",
                }}
              />
              <FormErrorMessage pb={2} fontWeight="bold" alignSelf="flex-start">
                {errors[id]?.message}
              </FormErrorMessage>
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
    </>
  );
}
