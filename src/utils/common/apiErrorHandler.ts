import { notify } from '@components/Common/Toastify';
export const apiErrorHandler = (
  error: any,
  form: any,
  errorMsg?: string,
  errorType?: 'success' | 'error' | 'info' | 'warning',
) => {
  const errorData = error?.response?.data; // API error object
  if (errorData && typeof errorData === 'object') {
    const fieldErrors = Object.keys(errorData)?.map((field) => ({
      name: field, // Use API field names directly (mobile_number1, email)
      errors: errorData[field], // Array of error messages
    }));
    form.setFields(fieldErrors);
  } else {
    notify(
      errorMsg
        ? errorMsg
        : 'Failed to submit form: ' + (error?.message || 'Unknown error'),
      errorType ? errorType : 'error',
    );
  }
};
