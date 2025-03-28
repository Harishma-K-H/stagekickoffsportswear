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

// Define the orders details function
export const orderById = async (
  get: (url: string) => Promise<any>,
  orderId: number | string | null,
): Promise<any> => {
  const response = await get(`/order/details/${orderId}/`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the payment function
export const payment = async (
  post: (url: string, payload: any, config?: any) => Promise<any>,
  payload: any,
): Promise<any> => {
  const response = await post('/api/payment/', payload);

  return { data: response.data, status: response.status, ok: response.ok };
};
