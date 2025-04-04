// Define the login function
export const login = async (
  post: (url: string, payload: any) => Promise<any>,
  payload: { login_identifier: string; password: string },
): Promise<any> => {
  const response = await post('/token/', payload);

  return { data: response.data, status: response.status, ok: response.ok };
};
