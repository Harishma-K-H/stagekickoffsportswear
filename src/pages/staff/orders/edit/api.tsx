// Define the orders details function
export const orderById = async (
  get: (url: string) => Promise<any>,
  orderId: number | string | null,
): Promise<any> => {
  const response = await get(`/order/details/${orderId}/`);

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

// Define the get item cost function
export const fetchItemCost = async (
  get: (url: string) => Promise<any>,
  payload: {
    modelId: number;
    materialId: number;
    printId: number;
    sleeveCase: string;
  },
): Promise<any> => {
  const { modelId, materialId, printId, sleeveCase } = payload;
  const response = await get(
    `/itemcost/?model=${modelId}&material=${materialId}&print_type=${printId}&sleevecase=${sleeveCase}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the orders details function
export const updateOrderById = async (
  put: (url: string, payload: any, config?: any) => Promise<any>,
  payload: any,
): Promise<any> => {
  const response = await put(`/update-order-item/`, payload, {
    'Content-Type': 'multipart/form-data',
  });

  return { data: response.data, status: response.status, ok: response.ok };
};
