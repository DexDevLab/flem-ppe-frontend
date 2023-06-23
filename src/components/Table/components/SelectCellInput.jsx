import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * Componente de input para select customizado
 * @method SelectCellInput
 * @memberof module:components
 * @param {Function} updateMyData função handler para atualizar
 * @param {Object} placeholder label de dica de placeholder
 * @param {Boolean} isInvalid define se o objeto é tratado como inválido
 * @param {Object} children componente-filho do objeto
 * @param {Object} defaultValue define o valor padrão do objeto
 * @returns {Component} componente estilizado.
 */
export function SelectCellInput({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  placeholder,
  isInvalid,
  children,
  defaultValue,
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Select
      bg={(value.includes("*") || value === "") && "red.200"}
      _hover={(value.includes("*") || value === "") && { cursor: "pointer" }}
      rounded="lg"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      variant="flushed"
      minW="36"
      placeholder={placeholder}
      isInvalid={value.includes("*") || value === ""}
      _focus
      maxW="80"
    >
      {children}
    </Select>
  );
}
