import {
  Badge,
  Box,
  Flex,
  FormLabel,
  IconButton,
  Progress,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiDownload, FiTrash } from "react-icons/fi";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "gray.300";
};

export function Dropzone({
  colorScheme = "brand1",
  onSubmit,
  onUploadProgress,
  setUploadProgress,
  uploadController,
  label,
  id,
  defaultValue = [],
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  validate = (v) => true,
  maxFiles = 4,
  multiple = false,
  ...rest
}) {
  const [myFiles, setMyFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
      trigger(id);
    },
    [myFiles]
  );

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    maxFiles,
    multiple,
  });

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const removeAll = () => {
    setMyFiles([]);
    setUploadProgress(null);
  };

  useEffect(() => {
    if (defaultValue) {
      setMyFiles(defaultValue);
    }
    return () => {
      removeAll();
    };
  }, []);

  useEffect(() => {
    setValue(id, myFiles);
    trigger(id);
  }, [myFiles]);

  const files = myFiles.map((file) => (
    <Tag
      colorScheme={colorScheme}
      shadow="inner"
      rounded="full"
      variant="outline"
      border="1px"
      m={1}
      key={file.name + file.size}
    >
      <TagLabel display="flex" alignItems="center" ms={1}>
        {file.name}{" "}
        {defaultValue.find((def) => def.name === file.name) && (
          <IconButton
            colorScheme={colorScheme}
            icon={<FiDownload />}
            onClick={removeFile(file)}
            variant="ghost"
            rounded="full"
            size="sm"
            ms={1}
            _focus={{ bg: "transparent" }}
          />
        )}
        <IconButton
          colorScheme={colorScheme}
          icon={<FiTrash />}
          onClick={removeFile(file)}
          variant="ghost"
          rounded="full"
          size="sm"
          _focus={{ bg: "transparent" }}
        />
      </TagLabel>
    </Tag>
  ));
  return (
    <>
      {label && <FormLabel>{label}</FormLabel>}
      <Box
        p={4}
        alignItems="center"
        border="dashed 2px"
        bg="gray.200"
        color="gray.400"
        borderColor={() => getColor({ isFocused, isDragAccept, isDragReject })}
        rounded="lg"
        outline="none"
        transition="all .24s ease-in-out"
        {...getRootProps()}
        onClick={() => (myFiles.length > 0 ? null : open())}
        {...rest}
      >
        <Flex flexDir="column" alignItems="center">
          <input
            {...getInputProps()}
            {...register(id, {
              validate,
            })}
          />
          {files.length === 0 && (
            <Text align="center">
              Arraste e solte os arquivos aqui, ou clique para selecionar
            </Text>
          )}
          {files.length > 0 &&
            (myFiles.filter((file) =>
              defaultValue.find((def) => def.name === file.name)
            ).length === 0 ? (
              <Text>Arquivos para Upload</Text>
            ) : (
              <Text>Arquivos Anexados</Text>
            ))}
          <Box>{files.length > 0 && <>{files}</>}</Box>
        </Flex>
        {onUploadProgress && (
          <Progress
            value={onUploadProgress}
            h={6}
            my={4}
            hasStripe={onUploadProgress && onUploadProgress < 100}
            isAnimated={onUploadProgress && onUploadProgress < 100}
            isIndeterminate={!onUploadProgress && onUploadProgress < 100}
            colorScheme={
              (onUploadProgress && onUploadProgress < 100 && "brand1") ||
              (onUploadProgress && onUploadProgress === 100 && "green")
            }
            rounded="full"
            shadow="inner"
            position="relative"
          >
            <Flex
              position="absolute"
              bottom={0}
              top={0}
              zIndex="1000"
              w="100%"
              justifyContent="center"
            >
              <Flex alignItems="center">
                {onUploadProgress && (
                  <Badge
                    colorScheme={
                      (onUploadProgress &&
                        onUploadProgress < 100 &&
                        "brand1") ||
                      (onUploadProgress && onUploadProgress === 100 && "green")
                    }
                    rounded="full"
                    shadow="inner"
                  >
                    {onUploadProgress}%
                  </Badge>
                )}
              </Flex>
            </Flex>
          </Progress>
        )}
      </Box>
    </>
  );
}
