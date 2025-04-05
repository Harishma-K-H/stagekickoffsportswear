// Define the get customers list with search function
export const getCustomers = async (
  get: (url: string) => Promise<any>,
  searchTerm?: string,
): Promise<any> => {
  const response = await get(
    `/customers/?data=customer_list&search=${searchTerm}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};
