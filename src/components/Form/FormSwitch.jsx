import { FormControl, FormLabel, HStack, Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * Componente de Botão de Formulário
 * @method FormSwitch
 * @memberof module:Form
 * @param {Object} id define o id do componente
 * @param {Object} label define a label do componente
 * @param {Object} checkedLabel define a label do componente quando está marcado
 * @param {Object} validate define as entradas de validação do formulário
 * @param {Object} defaultValue valor default do objeto
 * @param {Function} onChange handler da mudança de dados do objeto
 * @returns {Component} componente de objeto de Formulário
 */
export const FormSwitch = ({
  id,
  label,
  checkedLabel,
  unlockEdit = true,
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  validate,
  required = false,
  defaultValue,
  onChange,
}) => {
  const [checked, setChecked] = useState(defaultValue || false);

  const handleOnChange = (e) => {
    if (unlockEdit) {
      setChecked(e.target.checked);
      setValue(id, e.target.checked);
      trigger(id);

      if (_.isFunction(onChange)) {
        onChange(e);
      }
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(id, defaultValue);
      trigger(id);
    }
  }, [defaultValue]);

  return (
    <FormControl
      display={{ base: "block", md: "flex" }}
      alignItems="center"
      py={2}
      onChange={handleOnChange}
      isReadOnly={!unlockEdit}
      isInvalid={errors[id]}
    >
      <FormLabel w={{ base: "full", md: "full" }} mb={{ base: 2, md: 0 }}>
        {label}
      </FormLabel>
      <HStack flex="1 1 0%">
        <Switch
          colorScheme="brand1"
          isChecked={checked}
          {...register(id, { validate, required })}
        />
        {checkedLabel && (
          <FormLabel color="brand1.600" size="sm">
            {checked ? checkedLabel.true : checkedLabel.false}
          </FormLabel>
        )}
      </HStack>
    </FormControl>
  );
};
