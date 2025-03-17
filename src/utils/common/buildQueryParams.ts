export const buildQueryParams = (params: Record<string, any>) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null) // Filter out undefined or null values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  return queryString ? `&${queryString}` : '';
};
