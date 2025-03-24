// Define the orders list function
export const orders = async (
  get: (url: string) => Promise<any>,
  pageNumber: number,
  pageSize: number,
): Promise<any> => {
  const response = await get(
    `/api_order/?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};
