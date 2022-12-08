import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";

export function CellInput({
  value: initialValue,
  row: { index },
  column: { id },
  mask,
  required,
  updateMyData, // This is a custom function that we supplied to our table instance
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    if (mask) {
      setValue(mask(e.target.value));
    } else {
      setValue(e.target.value);
    }
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
    <Input
      value={value.toString().length ? value.toString().replace("*", "") : ""}
      onChange={onChange}
      onBlur={onBlur}
      variant="flushed"
      w="36"
      rounded="md"
      bgColor={
        ((value.length && value.includes("*")) || (required && value === "")) &&
        "red.200"
      }
      isInvalid={
        (value.length && value.includes("*")) || (required && value === "")
      }
    />
  );
}
