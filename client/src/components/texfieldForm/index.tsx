import { TextField } from '@mui/material';
import { useField } from 'formik';

type TextFieldType = {
  name: string,
  label: string,
};

/**
 * Build a custom textfield with formik based on mui
 * validation and settings
 * @returns TextField
 */
export const TextFieldForm = ({
  name,
  label,
  ...props
}: TextFieldType): JSX.Element => {
  const [field, meta] = useField(name);

  return (
    <TextField
      fullWidth
      variant="filled"
      type="text"
      label={label}
      onBlur={field.onBlur}
      onChange={field.onChange}
      value={meta.value}
      name={name}
      error={!!meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      {...props}
    />
  );
};
