export const InvoiceReportsGet = async (
  get: (url: string) => Promise<any>,
  pageNumber: number,
  pageSize: number,
): Promise<any> => {
  const response = await get(
    `/invoice_reports/?data=unpaid_invoices&page=${pageNumber}&pageSize=${pageSize}`
  );

  return { data: response.data, status: response.status, ok: response.ok };
};



// Get invoice details by ID
export const invoiceById = async (
  get: (url: string) => Promise<any>,
  invoiceId: number | string | null
): Promise<any> => {
  const response = await get(`/invoices/${invoiceId}/`);
  return { data: response.data, status: response.status, ok: response.ok };
};
