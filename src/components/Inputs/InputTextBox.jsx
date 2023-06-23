import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Skeleton,
  Textarea,
} from "@chakra-ui/react";

/**
 * Caixa de Texto Customizada
 * @method CheckboxInput
 * @memberof module:Inputs
 * @param {Object} id define o id do componente
 * @param {Object} label define a label do componente
 * @param {Object} type tipo de input do objeto de formulário
 * @param {Object} placeholder label de dica de placeholder
 * @param {Object} validate valor a ser validado no formulário
 * @param {Function} onChange handler de modificação de dados do formulário
 * @param {Object} value o valor do input
 * @returns {Component} componente de Caixa de Texto
 */
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
    <Box px={0.5}>
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
