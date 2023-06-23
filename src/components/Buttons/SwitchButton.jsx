/**
 * Componente de Botões
 * @module Buttons
 */

import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

/**
 * Componente de switch de botão
 * @method SwitchButton
 * @memberof module:Buttons
 * @param {Object} id o id do botão
 * @param {Object} formControl os dados do FormControl para interação
 * @param {Object} label o rótulo do botão
 * @param {Object} size o tamanho do botão
 * @param {Object} role a 'role' do botão no form
 * @returns {Component} componente de botão
 */
export const SwitchButton = ({
  id,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  label,
  colorScheme = "brand1",
  size,
  role,
  ...props
}) => {
  return (
    <FormControl
      id={id}
      isInvalid={errors[id]}
      display="flex"
      alignItems="center"
      role={role}
    >
      {label && (
        <FormLabel mb="0" fontSize={size} role={role}>
          {label}
        </FormLabel>
      )}
      <Switch
        colorScheme={colorScheme}
        role={role}
        {...register(id)}
        {...props}
        onClick={() => trigger(id)}
        size={size}
      />
    </FormControl>
  );
};
