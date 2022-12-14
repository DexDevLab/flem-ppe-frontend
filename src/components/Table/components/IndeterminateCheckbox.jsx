import { Checkbox, chakra } from "@chakra-ui/react";
import { forwardRef, useEffect, useRef, useState } from "react";

export const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, onChange, checked, isDisabled, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;
    const [state, setState] = useState(checked);

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    useEffect(() => {
      setState(checked);
    }, [checked]);

    const handleOnChange = (e) => {
      setState(e.target.checked);
      onChange(e);
    };

    return (
      <>
        {/* <chakra.input
          type="checkbox"
          ref={resolvedRef}
          onChange={handleOnChange}
          checked={checked}
          {...rest}
        /> */}

        <Checkbox
          ref={resolvedRef}
          size="lg"
          colorScheme="brand1"
          onChange={handleOnChange}
          isChecked={state}
          isIndeterminate={indeterminate}
          isDisabled={isDisabled}
        />
      </>
    );
  }
);
