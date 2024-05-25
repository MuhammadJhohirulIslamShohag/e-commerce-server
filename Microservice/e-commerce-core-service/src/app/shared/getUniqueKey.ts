export const getUniqueKey = (prefix: string) => {
  const timestamp = new Date().getTime();
  const toStringTimestamp = `${timestamp}`.slice(3, 13);
  const uniqueIdentifier = Math.floor(Math.random() * 1000);

  return `${
    prefix.slice(0, 3).toUpperCase() || 'UID'
  }${toStringTimestamp}${uniqueIdentifier}`;
};
