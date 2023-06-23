import { Checkbox } from "@chakra-ui/react";
import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * Componente de checkbox customizado.
 * @method CellInput
 * @memberof module:components
 * @param {Boolean} indeterminate define o estado indeterminado do checkbox
 * @param {Function} onChange handler da mudança de dados do objeto
 * @param {Boolean} checked define o estado marcado ou não do objeto
 * @param {Boolean} isDisabled define se o objeto está desativado ou não
 * @param {Object} ref o ref do objeto
 * @returns {Component} componente estilizado.
 */
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

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";
