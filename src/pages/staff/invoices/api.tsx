// Define the get Invoice list function
export const invoices = async (
  get: (url: string) => Promise<any>,
  pageNumber: number,
  pageSize: number,
): Promise<any> => {
  const response = await get(
    `/invoice_list/?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};
