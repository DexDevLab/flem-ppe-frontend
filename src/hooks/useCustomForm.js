import { useDisclosure } from "@chakra-ui/react";
import { useForm, useFormState } from "react-hook-form";

export const useCustomForm = (props) => {
  const overlayForm = useDisclosure();
  const {
    isOpen: isLoading,
    onOpen: setLoading,
    onClose: setLoaded,
  } = useDisclosure();

  const { handleSubmit, ...control } = useForm({
    mode: "onChange",
    ...props,
  });

  const { isValid: validation } = useFormState({
    control: control.control,
  });

  const openOverlay = () => {
    overlayForm.onOpen();
  };

  const closeOverlay = () => {
    overlayForm.onClose();
    control.reset({});
  };

  const overlayIsOpen = overlayForm.isOpen;

  return {
    control,
    validation,
    isLoading,
    setLoading,
    setLoaded,
    openOverlay,
    closeOverlay,
    handleSubmit,
    overlayIsOpen,
  };
};
