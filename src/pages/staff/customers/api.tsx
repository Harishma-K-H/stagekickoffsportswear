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
