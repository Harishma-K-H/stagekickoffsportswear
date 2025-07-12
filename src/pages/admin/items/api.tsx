// Define the orders list function
export const items = async (
  get: (url: string) => Promise<any>,
  pageNumber: number,
  pageSize: number,
  branchId: number | string = '',
  modelId: number | string = '',
): Promise<any> => {
  const response = await get(
    `/api_item/?pageNumber=${pageNumber}&pageSize=${pageSize}&branch_search=${branchId}&model_search=${modelId}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get branches function
export const fetchBranches = async (
  get: (url: string) => Promise<any>,
): Promise<any> => {
  const response = await get(`/api_branch/?data=branch_list`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get models function
export const fetchModels = async (
  get: (url: string) => Promise<any>,
): Promise<any> => {
  const response = await get(`/models/?data=model_list`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get Materials function
export const fetchMaterial = async (
  get: (url: string) => Promise<any>,
  payload: number | string,
): Promise<any> => {
  const response = await get(`/material_list/${payload}/`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get Print Types function
export const fetchPrintTypes = async (
  get: (url: string) => Promise<any>,
  payload: number | string,
): Promise<any> => {
  const response = await get(`/print-types/?model_id=${payload}`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the create new item function
export const newItem = async (
  post: (url: string, payload: any) => Promise<any>,
  payload: any,
): Promise<any> => {
  const response = await post('/api_item/', payload);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the update item values function
export const updateItem = async (
  put: (url: string, payload: any) => Promise<any>,
  payload: any,
  itemId: number | string,
): Promise<any> => {
  const response = await put(`/api_item/${itemId}/`, payload);

  return { data: response.data, status: response.status, ok: response.ok };
};

//definr the deactivate function
// export const DeactivateItem = async (
//   put: (url: string, payload: any) => Promise<any>,
//   payload: any,
//   itemId: number | string,
// ): Promise<any> => {
//   // Use the correct URL format here
//   const response = await put(`api_item/${itemId}/`, payload);

//   return {
//     data: response.data,
//     status: response.status,
//     ok: response.status >= 200 && response.status < 300,
//   };
// };
// api.tsx or a service file
export const DeactivateItem = async (
  put: (url: string, payload: any) => Promise<any>,
  payload: { is_active: boolean },
  id: string,
) => {
  const response = await put(
    `/api_item/${id}/?status=status_updation`,
    payload,
  );

  return {
    data: response.data,
    status: response.status,
    ok: response.status >= 200 && response.status < 300,
  };
};
