// ================== GET CUSTOMERS ==================
export const getCustomers = async (
  get: (url: string) => Promise<any>,
  searchTerm: string,
  pageNumber: number,
  pageSize: number,
  branchIds?: number[] // 👈 NEW
): Promise<any> => {

  // Build query params safely
  const params = new URLSearchParams();

  params.append('pageNumber', String(pageNumber));
  params.append('pageSize', String(pageSize));

  if (searchTerm) {
    params.append('search', searchTerm);
  }

  if (branchIds && branchIds.length > 0) {
    params.append('branch_ids', branchIds.join(',')); 
    // backend receives: branch_ids=1,2,3
  }

  const response = await get(`/customers/?${params.toString()}`);

  return {
    data: response.data,
    status: response.status,
    ok: response.ok,
  };
};

// ================== UPDATE CUSTOMER ==================
export const updateCustomer = async (
  put: (url: string, data: any) => Promise<any>,
  customerId: number,
  payload: any
) => {
  return await put(`/customers/${customerId}/`, payload);
};

// ================== FETCH STATES ==================
export const fetchStates = async (
  get: (url: string) => Promise<any>
): Promise<any> => {
  const response = await get('/state_list/');

  return {
    data: response.data,
    status: response.status,
    ok: response.ok,
  };
};

// ================== CREATE CUSTOMER ==================
export const createCustomer = async (
  post: (url: string, data: any) => Promise<any>,
  payload: any
) => {
  return await post('/customers/', payload);
};
