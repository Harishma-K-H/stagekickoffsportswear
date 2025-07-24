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

// Define the Invoice details function
export const invoiceById = async (
  get: (url: string) => Promise<any>,
  invoiceId: number | string | null,
): Promise<any> => {
  const response = await get(`/invoices/${invoiceId}/`);

  return { data: response.data, status: response.status, ok: response.ok };
};
// Define the month-wise invoice list function
export const monthWiseInvoices = async (
  get: (url: string) => Promise<any>,
  month: number,
  year: number
): Promise<any> => {
  const response = await get(`/invoice_list/?month=${month}&year=${year}`);
  return {
    data: response.data,
    status: response.status,
    ok: response.ok,
  };
};
