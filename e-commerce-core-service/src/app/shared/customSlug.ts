export const customSlug = (payload: string) => {
  return payload
    ?.toLowerCase()
    ?.replace(/[!@#$%^&*:;,]/g, '')
    ?.split(/\s+/g)
    ?.join('-');
};
