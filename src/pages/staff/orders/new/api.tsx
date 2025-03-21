// Define the GST Verification function
export const GstVerification = async (
  get: (url: string) => Promise<any>,
  payload: { gstn: string },
): Promise<any> => {
  const response = await get(
    `https://sheet.gstincheck.co.in/check/1995eb6bebfbdc799942256517d2a954/${payload.gstn}`,
  );

  return { data: response.data, status: response.status, ok: response.ok };
};
