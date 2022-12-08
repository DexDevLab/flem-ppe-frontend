import { useEffect, useState } from "react";
import { Select } from "@chakra-ui/react";

export function SelectCellInput({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  placeholder,
  isInvalid,
  children,
  defaultValue
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
