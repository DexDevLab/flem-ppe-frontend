/**
 * Componentes de Inputs gerais.
 *  @module Inputs
 */

import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import CurrencyFormat from "react-currency-format";
import { Controller } from "react-hook-form";

/**
 * Cria um componente do Chakra utilizando a máscara de
 * currency provida pelo React.
 * @method ChakraCurrencyInput
 * @memberof module:Inputs
 * @param {Object} props parâmetros do componente
 * @returns {Component} componente personalizado do Chakra
 */
function ChakraCurrencyInput(props) {
  return <CurrencyFormat {...props} customInput={Input} />;
}

/**
 * Cria uma Inpux Box de currency (moeda).
 * @method CurrencyInputBox
 * @memberof module:Inputs
 * @param {String} id id do formulário
 * @param {Object} control manipula o formulário
 * @param {Function} errors manipula as mensagens de erro
 * @param {String} label label do formulário
 * @param {Object} validate validação do Input Box
 * @param {Function} setValueAs transforma o valor dentro dos campos
 * @param {Object} props parâmetros do componente
 * @param {Object} field conteúdo de dentro do campo e seus devidos
 * parâmetros
 * @returns {Component} componente estilizado com máscara de currency
 */
export function CurrencyInputBox({
  id,
  control,
  errors,
  label,
  validate,
  setValueAs,
  setMask,
  pattern,
  ...props
}) {
  return (
    <Box px={0.5}>
      <FormControl id={id} isInvalid={errors[id]}>
        <FormLabel>{label}</FormLabel>
        <Controller
          name={id}
          control={control}
          rules={{
            required: "Obrigatório",
            validate: validate,
            setValueAs: setValueAs,
          }}
          render={({ field }) => <ChakraCurrencyInput {...field} {...props} />}
        />
        <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
}
