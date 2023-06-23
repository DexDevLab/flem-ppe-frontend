import { Dropzone } from "components/Dropzone";
import { FormBox } from ".";
import { FormSwitch } from "./FormSwitch";

/**
 * Componente que monta o tipo de objeto de formulário dependendo da necessidade.
 * @method FormMaker
 * @memberof module:Form
 * @param {Object} children define as propriedades do componente-filho de atribuem as props necessárias de composição do objeto
 * @param {Object} unlockEdit define se é permitido editar o objeto
 * @param {Object} data define o valor padrão (se existente)
 * @param {Object} inlineForm parâmetros internos de formulário
 * @returns {Component} componente de objeto de Formulário
 */
export const FormMaker = ({ children, unlockEdit, data, inlineForm }) => {
  return children.map(
    (
      {
        id,
        label,
        placeholder,
        formControl,
        type,
        options,
        checkedLabel,
        mask,
        showIn = true,
        uploadProgress,
        setUploadProgress,
        controller,
        ...rest
      },
      idx
    ) => {
      if (!["switch", "file"].includes(type) && showIn) {
        return (
          <FormBox
            id={id}
            key={`formbox-${idx}-label-${label}`}
            label={label}
            placeholder={placeholder}
            formControl={formControl}
            type={type && type}
            options={options && options}
            unlockEdit={unlockEdit}
            mask={mask}
            defaultValue={data && data[id]}
            inlineForm={inlineForm}
            {...rest}
          />
        );
      }
      if (["switch"].includes(type) && showIn) {
        return (
          <FormSwitch
            id={id}
            key={`formswitch-${idx}-label-${label}`}
            label={label}
            placeholder={placeholder}
            formControl={formControl}
            checkedLabel={checkedLabel}
            unlockEdit={unlockEdit}
            defaultValue={data && data[id]}
            {...rest}
          />
        );
      }
      if (["file"].includes(type) && showIn) {
        return (
          <Dropzone
            key={`formdropzone-${idx}-label-${label}`}
            label={label}
            id={id}
            formControl={formControl}
            onUploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            uploadController={controller}
            {...rest}
          />
        );
      }
    }
  );
};
