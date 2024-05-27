export const isEmptyObject = (obj: { [key: string]: unknown }) => {
  return Object.keys(obj).length === 0;
};
