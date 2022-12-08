import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import _ from "lodash";

export const FormBox = ({
  id,
  label,
  placeholder = "",
  formControl: {
    trigger,
    formState: { errors },
    register,
    setValue,
  },
  type,
  options,
  unlockEdit = true,
  mask,
  defaultValue,
  validate,
  required = false,
  inputLeftElement,
  inputRightElement,
  customInputProps,
  inlineForm,
  readOnly = false,
  onChange,
  ...rest
}) => {
  id = readOnly ? `${id}_readOnly` : id;
  const [newId, idx] = id.split(".");
  const [invalid, setInvalid] = useState(false);
  
  const handleOnChange = (e) => {
    if (mask) {
      setValue(id, mask(e.target.value));
    } else {
      setValue(id, e.target.value);
    }
    trigger(id);

    if (_.isFunction(onChange)) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (type === "date") {
      setValue(id, DateTime.fromISO(defaultValue).toFormat("yyyy-MM-dd"));
    } else {
      setValue(id, defaultValue);
    }
    trigger(id);
  }, [defaultValue, unlockEdit]);

  useEffect(() => {
    if (Array.isArray(errors[newId])) {
      setInvalid(errors[newId][idx]);
    } else {
      setInvalid(errors[newId]);
    }
  }, [errors[newId]]);

  return (
    <FormControl
      display={inlineForm && { base: "block", md: "flex" }}
      alignItems="center"
      py={{ base: 2, md: 1 }}
      isReadOnly={!unlockEdit}
      onChange={handleOnChange}
      isInvalid={invalid}
      justifyContent="space-between"
    >
      {label && (
        <FormLabel
          w={inlineForm && { base: "full", md: "50%", lg: "30%" }}
          mb={{ base: 0, md: 2 }}
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        {inputLeftElement && (
          <InputLeftElement>{inputLeftElement}</InputLeftElement>
        )}
        {type !== "select" && type !== "textarea" && (
          <Input
            variant={inlineForm && "flushed"}
            placeholder={placeholder}
            type={type}
            {...register(id, {
              validate,
              required,
              disabled: readOnly,
            })}
            {...(customInputProps && customInputProps())}
            {...rest}
          />
        )}
        {type === "textarea" && (
          <Textarea
            variant={inlineForm && "flushed"}
            placeholder={placeholder}
            type={type}
            {...register(id, { validate, required })}
            {...rest}
          />
        )}

        {type === "select" && options && (
          <Select
            variant={inlineForm && "flushed"}
            placeholder={placeholder}
            type={type}
            {...register(id, { validate, required })}
            isDisabled={!unlockEdit}
            // icon={<ChevronDownIcon me={errors[id]?.message && 32} />}
            defaultValue={defaultValue}
          >
            {options &&
              options.map(({ value, label }, idx) => (
                <option
                  key={`select-option-${idx}-label-${label}`}
                  value={value}
                >
                  {label}
                </option>
              ))}
          </Select>
        )}
        {type === "select" && !options && (
          <Select variant={inlineForm && "flushed"} placeholder={placeholder}>
            <option value="carregando">Carregando...</option>
          </Select>
        )}
        {(invalid?.message || inputRightElement) && (
          <InputRightElement
            // w={!inlineForm && invalid?.message ? 230 : 100}
            justifyContent="flex-end"
            // zIndex="hide"
          >
            {!inlineForm && invalid?.message && (
              <FormErrorMessage alignSelf="flex-start" pt={1} pe={4}>
                {invalid?.message}
              </FormErrorMessage>
            )}
            {inputRightElement && inputRightElement}
          </InputRightElement>
        )}
        {inlineForm && invalid?.message && (
          <FormErrorMessage zIndex="hide">{invalid?.message}</FormErrorMessage>
        )}
      </InputGroup>
    </FormControl>
  );
};
