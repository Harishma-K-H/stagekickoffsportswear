import { message } from 'antd'; // Import Ant Design message for notifications

export const handleApiResponse = (response: any) => {
  if (response.status >= 400) {
    switch (response.status) {
      case 400:
        message.error(
          'Bad Request: The server could not understand the request due to invalid syntax.',
        );
        break;
      case 401:
        message.error('Unauthorized: Please log in to access this resource.');
        break;
      case 403:
        message.error(
          'Forbidden: You do not have permission to access this resource.',
        );
        break;
      case 404:
        message.error('Not Found: The requested resource could not be found.');
        break;
      case 409:
        message.error(
          'Conflict: There was a conflict with the current state of the resource.',
        );
        break;
      case 500:
        message.error(
          'Internal Server Error: An unexpected error occurred on the server.',
        );
        break;
      case 503:
        message.error(
          'Service Unavailable: The server is currently unable to handle the request.',
        );
        break;
      default:
        message.error('An unknown error occurred. Please try again later.');
        break;
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  } else {
    response.ok = true;

    return response; // Return the processed data if successful
  }
};
