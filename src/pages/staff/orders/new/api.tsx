// Define the GST Verification function
export const GstVerification = async (gstn: string): Promise<any> => {
  const response = await fetch(
    `https://cleartax.in/f/compliance-report/${gstn}`,
  );
  console.log({ response });

  // return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get models function
export const fetchModels = async (
  get: (url: string) => Promise<any>,
): Promise<any> => {
  const response = await get(`/api/models/?data=model_list`);

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
): Promise<any> => {
  const response = await get(`/api/print-types/`);

  return { data: response.data, status: response.status, ok: response.ok };
};

// Define the get item cost function
export const fetchItemCost = async (
  post: (url: string, payload: any) => Promise<any>,
  payload: any,
): Promise<any> => {
  const response = await post(`/itemcost/`, payload);

  return { data: response.data, status: response.status, ok: response.ok };
};
