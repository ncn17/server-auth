import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';

type AppFormType = {
  initialValues: object,
  validationSchema: object,
  children: React.ReactNode,
  onSubmit: ((
    values: object,
    formikHelpers: FormikHelpers<object>
  ) => void | Promise<any>) &
    React.FormEvent<Element>,
};

export const AppForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: AppFormType) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => <Form>{children}</Form>}
    </Formik>
  );
};
