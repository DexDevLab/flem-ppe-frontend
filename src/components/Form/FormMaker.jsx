import { Dropzone } from "components/Dropzone";
import { FormBox } from ".";
import { FormSwitch } from "./FormSwitch";

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
