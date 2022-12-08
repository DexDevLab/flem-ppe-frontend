import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Skeleton,
  Textarea,
  Input,
} from "@chakra-ui/react";

export function InputTextBox({
  id,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  label,
  type,
  placeholder,
  required = "Obrigatório",
  validate,
  isLoaded = true,
  onChange,
  colorScheme = "brand1",
  shadow = "md",
  value,
  ...props
}) {
  value ? setValue(id, value) : null;
  return (
    <Box px={0.5} >
      <FormControl id={id} isInvalid={errors[id]}>
        <FormLabel>{label}</FormLabel>
        <Skeleton isLoaded={isLoaded} fadeDuration={0.5}>
          <Textarea
            type={type}
            placeholder={placeholder}
            {...register(id, {
              required: required,
              validate: validate,
              onChange: onChange,
            })}
            colorScheme={colorScheme}
            shadow={shadow}
            {...props}
           rows="6"
          />
        </Skeleton>
        <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
