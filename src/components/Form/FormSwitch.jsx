import { FormControl, FormLabel, HStack, Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
}) => {
  const [checked, setChecked] = useState(defaultValue || false);

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
      onChange={({ target: { checked } }) => unlockEdit && setChecked(checked)}
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
