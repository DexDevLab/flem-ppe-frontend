import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Skeleton,
  Text,
  useBoolean,
  VStack,
} from "@chakra-ui/react";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import "@deevotechvn/quill-mention/dist/quill.mention.min.css";
import { useCallback, useEffect, useState } from "react";
import { Logo } from "components/Logo";

export function EmailEditor({
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  setContent,
  id,
  label,
  title = "Title",
  type = "text",
  placeholder,
  required = "Obrigatório",
  isLoaded = true,
  loadOnEditor,
  colorScheme = "brand1",
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
  }, [quill, loadOnEditor]);

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
      <Box p={0.5} h="full">
        <FormControl id={id} isInvalid={errors[id]} w="100%" h="100%">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            w="100%"
            px={1}
          >
            <Heading size="md" color="gray.500">
              {title}
            </Heading>
            <Logo h={30} my={4} />
          </Flex>
          <Input
            as={Box}
            type={type}
            placeholder={placeholder}
            {...register(id, {
              required,
              validate: (e) => e.length() > 2 || "Digite um template válido",
            })}
            {...props}
            colorScheme={colorScheme}
            className="page"
            ref={quillRef}
            w="100%"
            minH={60}
            h="100%"
            fontSize={14}
            p={0}
            shadow="none"
            sx={{
              border: "2px dashed var(--chakra-colors-gray-200) !important",
            }}
          />
          <FormErrorMessage fontWeight="bold">
            {errors[id]?.message}
          </FormErrorMessage>
        </FormControl>
      </Box>
    </>
  );
}
