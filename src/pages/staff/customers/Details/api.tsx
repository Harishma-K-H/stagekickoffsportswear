export const getCustomerDetails = async (
    get: (url: string) => Promise<any>,
    pk: number, // the customer ID
    searchTerm: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<any> => {
    const response = await get(
      `/customer_details/${pk}/?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchTerm}`,
    );
  
    return { data: response.data, status: response.status, ok: response.ok };
  };