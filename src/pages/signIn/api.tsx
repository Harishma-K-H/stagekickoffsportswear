// Define the login function
export const login = async (
  post: (url: string, payload: any) => Promise<any>,
  payload: { email: string; password: string },
): Promise<any> => {
  const response = await post('/auth/users/validate', payload);

  return { data: response.data, status: response.status, ok: response.ok };
};
