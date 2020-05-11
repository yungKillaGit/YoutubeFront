const capitalize = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const formatErrors = (errors) => {
  const formattedErrors = {};
  errors.forEach((error) => {
    if (!formattedErrors[error.propertyName]) {
      formattedErrors[error.propertyName] = error.errorMessage;
    }
  });
  return formattedErrors;
};

export const createValidationMessages = (fields) => {
  const validationMessages = {};
  fields.forEach((fieldName) => {
    const capitalizedField = capitalize(fieldName);
    validationMessages[capitalizedField] = { error: false, helperText: null };
  });
  return validationMessages;
};

export const validate = (fieldValues, validationMessages) => {
  const newValidationMessages = { ...validationMessages };
  let isOk = true;
  [...Object.keys(fieldValues)].forEach((fieldName) => {
    const capitalizedField = capitalize(fieldName);
    if (!fieldValues[fieldName]) {
      isOk = false;
      newValidationMessages[capitalizedField].error = true;
      newValidationMessages[capitalizedField].helperText = `${capitalizedField} не должен быть пустым`;
    } else {
      newValidationMessages[capitalizedField].error = false;
      newValidationMessages[capitalizedField].helperText = null;
    }
  });
  return {
    isOk,
    newValidationMessages,
  };
};

export const createValidationMessagesFromErrors = (errors, validationMessages) => {
  const newValidationMessages = { ...validationMessages };
  errors.forEach((error) => {
    newValidationMessages[error.propertyName].error = true;
    newValidationMessages[error.propertyName].helperText = error.errorMessage;
  });
  return newValidationMessages;
};
