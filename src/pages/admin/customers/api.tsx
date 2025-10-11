// Define the get customers list with search function
export const getCustomers = async (
  get: (url: string) => Promise<any>,
  searchTerm: string,
  pageNumber: number,
  pageSize: number,
): Promise<any> => {
  const response = await get(
    `/customers/?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchTerm}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};
export const updateCustomer = async (
  put: any,
  customerId: number,
  payload: any,
) => {
  return await put(`/customers/${customerId}/`, payload);
};
// Define the get states list function
export const fetchStates = async (
  get: (url: string) => Promise<any>,
): Promise<any> => {
  const response = await get('/state_list/');

  return { data: response.data, status: response.status, ok: response.ok };
};
export const createCustomer = async (
  post: (url: string, data: any) => Promise<any>,
  payload: any,
) => {
  return await post('/customers/', payload);
};
