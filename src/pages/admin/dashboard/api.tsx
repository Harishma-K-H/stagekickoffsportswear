// Fetch orders by delivery date (today/tomorrow)
export const fetchDeliveryOrders = async (
  get: (url: string) => Promise<any>,
  date: 'today' | 'tomorrow',
): Promise<any> => {
  const response = await get(`/orders-by-date/?date=${date}`);
  return { data: response.data, status: response.status, ok: response.ok };
};
