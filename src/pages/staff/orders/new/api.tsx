// Define the GST Verification function
export const GstVerification = async (gstn: string): Promise<any> => {
  const response = await fetch(
    `https://cleartax.in/f/compliance-report/${gstn}`,
  );
  return { data: response, status: response.status, ok: response.ok };
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

// Define the get customers list with search function
export const getCustomers = async (
  get: (url: string) => Promise<any>,
  searchTerm: string,
): Promise<any> => {
  const response = await get(`/customers/?search=${searchTerm}`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the create new customer function
export const newCustomer = async (
  post: (url: string, payload: any) => Promise<any>,
  payload: {
    name: string;
    address1: string;
    address2: string | null;
    mobile_number1: string;
    mobile_number2: string | null;
    email: string;
    gst_no: string | null;
    business_name: string;
  },
): Promise<any> => {
  const response = await post('/customers/', payload);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the generate new orderId function
export const generateOrderId = async (
  get: (url: string) => Promise<any>,
): Promise<any> => {
  const response = await get(`/order_no_generate/`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the new order function
export const newOrder = async (
  post: (url: string, payload: any, config?: any) => Promise<any>,
  payload: any,
): Promise<any> => {
  const response = await post('/api_order/', payload, {
    'Content-Type': 'multipart/form-data',
  });

  return { data: response.data, status: response.status, ok: response.ok };
};
