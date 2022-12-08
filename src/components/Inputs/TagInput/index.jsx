import { forwardRef, useCallback, useEffect, useState } from "react";
import {
  Input,
  Wrap,
  WrapItem,
  useToken,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import { maybeCall } from "./maybe";
import ChakraTagInputTag from "./Tag";

export default forwardRef(function ChakraTagInput(
  {
    colorScheme = "brand1",
    id,
    formControl: {
      trigger,
      formState: { errors },
      register,
      setValue,
    },
    required = "Obrigatório",
    label,
    //   tags = [],
    //   onTagsChange,
    onTagAdd,
    onTagRemove,
    vertical = false,
    addKeys = ["Enter"],
    wrapProps,
    wrapItemProps,
    tagProps,
    tagLabelProps,
    tagCloseButtonProps,
    mask,
    defaultValues,
    ...props
  },
  ref
) {
  const [color] = useToken("colors", [colorScheme]);

  const [tags, setTags] = useState(defaultValues || []);
  const onTagsChange = useCallback((event, tags) => {
    setTags(tags);
    setValue(id, tags);
  }, []);

  const addTag = useCallback(
    (event, tag) => {
      onTagAdd?.(event, tag);
      if (event.isDefaultPrevented()) return;

      onTagsChange?.(
        event,
        tags.concat(
          tag
            .split(",")
            .map((rawTag) => {
              const tag = rawTag.trim();
              if (tag.length <= 10) {
                return { value: tag, label: tag, isInvalid: false };
              } else if (tag.length === 11 || tag.length === 14) {
                return mask
                  ? { value: tag, label: mask(tag), isInvalid: false }
                  : { value: tag, label: tag, isInvalid: false };
              } else {
                return null;
              }
            })
            .filter((tag) => tag !== null)
        )
      );
    },
    [tags, onTagsChange, onTagAdd]
  );
  const removeTag = useCallback(
    (event, index) => {
      onTagRemove?.(event, index);
      if (event.isDefaultPrevented()) return;
      onTagsChange?.(event, [
        ...tags.slice(0, index),
        ...tags.slice(index + 1),
      ]);
    },
    [tags, onTagsChange, onTagRemove]
  );
  const handleRemoveTag = useCallback(
    (index) => (event) => {
      removeTag(event, index);
    },
    [removeTag]
  );
  const onKeyDown = props.onKeyDown;
  const handleKeyDown = useCallback(
    (event) => {
      onKeyDown?.(event);

      if (event.isDefaultPrevented()) return;
      if (event.isPropagationStopped()) return;

      const { currentTarget, key } = event;
      const { selectionStart, selectionEnd } = currentTarget;
      if (addKeys.indexOf(key) > -1 && currentTarget.value) {
        addTag(event, currentTarget.value);
        if (!event.isDefaultPrevented()) {
          currentTarget.value = "";
        }
        event.preventDefault();
      } else if (
        key === "Backspace" &&
        tags.length > 0 &&
        selectionStart === 0 &&
        selectionEnd === 0
      ) {
        removeTag(event, tags.length - 1);
      }
    },
    [addKeys, tags.length, addTag, removeTag, onKeyDown]
  );
  register(id, {
    validate: () => (required !== false ? tags.length > 0 || required : null),
  });

  useEffect(() => {
    trigger(id);
  }, [tags]);

  useEffect(() => {
    if (defaultValues) {
      setValue(id, tags);
      trigger(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box>
      <FormControl id={id} isInvalid={errors[id]}>
        {label && <FormLabel>{label}</FormLabel>}
        <Wrap align="center" {...wrapProps} px={0.5} py={label ? 1.5 : 0.5}>
          {tags &&
            tags.map((tag, index) => (
              <WrapItem {...maybeCall(wrapItemProps, false, index)} key={index}>
                <ChakraTagInputTag
                  onRemove={handleRemoveTag(index)}
                  tagLabelProps={maybeCall(tagLabelProps, tag.label, index)}
                  tagCloseButtonProps={maybeCall(
                    tagCloseButtonProps,
                    tag.label,
                    index
                  )}
                  colorScheme={tag.isInvalid ? "red" : color}
                  size={props.size}
                  {...maybeCall(tagProps, tag, index)}
                >
                  {tag.label}
                </ChakraTagInputTag>
              </WrapItem>
            ))}
          <WrapItem
            flexGrow={1}
            {...maybeCall(wrapItemProps, true, tags.length)}
          >
            <Box w="100%">
              <Input
                {...props}
                onKeyDown={handleKeyDown}
                ref={ref}
                colorScheme={color}
                shadow="md"
              />
              <FormErrorMessage>{errors[id]?.message}</FormErrorMessage>
            </Box>
          </WrapItem>
        </Wrap>
      </FormControl>
    </Box>
  );
});
