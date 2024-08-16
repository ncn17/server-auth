import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import { FC } from 'react';

type CustomTextFieldProps = TextFieldProps & {
  name: string,
  label: string,
};

/**
 * Build a custom textfield with formik based on mui
 * validation and settings
 * @returns TextField
 */
export const TextFieldForm: FC<CustomTextFieldProps> = ({
  name,
  label,
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      type="text"
      fullWidth
      variant="filled"
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
