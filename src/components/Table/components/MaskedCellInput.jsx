import { Input } from "@chakra-ui/react";
import { cleanMask } from "masks-br";
import { useEffect, useState } from "react";

/**
 * Componente de checkbox customizado com entrada para máscara customizada.
 * @method MaskedCellInput
 * @memberof module:components
 * @param {Object} mask máscara de validação
 * @param {Function} updateMyData função handler para atualizar
 * @returns {Component} componente estilizado.
 */
export function MaskedCellInput({
  mask,
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, cleanMask(value));
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={mask && mask(value)}
      onChange={onChange}
      onBlur={onBlur}
      variant="flushed"
      w="36"
    />
  );
}
