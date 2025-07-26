export const InvoiceReportsGet = async (
  get: (url: string) => Promise<any>,
  pageNumber: number,
  pageSize: number,
  branchId?: number | string, // optional for admin
): Promise<any> => {
  let url =  `/invoice_reports/?data=unpaid_invoices&pageNumber=${pageNumber}&pageSize=${pageSize}`;

  // Add branch_id if provided (for Admin)
  if (branchId) {
    url += `&branch_id=${branchId}`;
  }

  const response = await get(url);

  return {
    data: response.data,
    status: response.status,
    ok: response.ok,
  };
};

// Get invoice details by ID
export const invoiceById = async (
  get: (url: string) => Promise<any>,
  invoiceId: number | string | null,
): Promise<any> => {
  const response = await get(`/invoices/${invoiceId}/`);
  return { data: response.data, status: response.status, ok: response.ok };
};
export const getBranchList = async (get: (url: string) => Promise<any>) => {
  const response = await get('/api_branch/?data=branch_list');
  return { data: response.data, status: response.status, ok: response.ok };
};