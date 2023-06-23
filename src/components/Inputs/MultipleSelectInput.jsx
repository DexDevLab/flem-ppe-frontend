import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import Select from "react-select";

/**
 * Input Box multiuso.
 * @method MultipleSelectInput
 * @memberof module:Inputs
 * @param {Object} id define o id do componente
 * @param {Object} label define a label do componente
 * @param {Object} options as opções do input para o select
 * @returns {Component} componente de Input Box
 */
export function MultipleSelectInput({
  id,
  label,
  colorScheme = "blue",
  placeholder = "Selecione...",
  required = "Obrigatório",
  isLoaded = true,
  options,
  shadow = "md",
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  ...props
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box px={0.5}>
      <FormControl id={id} isInvalid={errors[id]}>
        <FormLabel>{label}</FormLabel>
        <Skeleton
          isLoaded={isLoaded}
          fadeDuration={0.5}
          rounded="lg"
          shadow={!isLoaded && "inner"}
        >
          <Input
            type="hidden"
            {...register(id, {
              required: required,
            })}
          />
          <Box
            border="1px solid"
            rounded="lg"
            shadow={isOpen ? "inner" : shadow}
            borderColor={
              isOpen
                ? `${colorScheme}.500`
                : errors[id]
                ? "#E53E3E"
                : "gray.200"
            }
            boxShadow={
              isOpen
                ? `0 0 0 1px var(--chakra-colors-${colorScheme}-500)`
                : errors[id]
                ? "0 0 0 1px #E53E3E"
                : `var(--chakra-shadows-${shadow})`
            }
            transition="all .2s"
            _hover={!isOpen && { borderColor: "gray.300" }}
          >
            <Select
              onChange={(e) => {
                setValue(id, e);
                trigger(id);
              }}
              options={options}
              border="1px solid"
              rounded="lg"
              shadow="md"
              borderColor="inherit"
              closeMenuOnSelect={false}
              isMulti
              noOptionsMessage={() => "Sem opções"}
              placeholder={placeholder}
              onFocus={onOpen}
              onBlur={onClose}
              styles={{
                control: (provided) => ({
                  ...provided,
                  border: "0px",
                  borderRadius: "var(--chakra-radii-lg)",
                  borderColor: "white",
                  boxShadow: "none",
                  ":hover": {
                    backgroundColor: "white",
                  },
                }),
              }}
              {...props}
            />
          </Box>
        </Skeleton>
        <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
