export const formatErrors = (errors) => {
  const formattedErrors = {};
  errors.forEach((error) => {
    if (!formattedErrors[error.propertyName]) {
      formattedErrors[error.propertyName] = error.errorMessage;
    }
  });
  return formattedErrors;
};
