export const arrayFind = (array, value, key = 'key') => {
  return array?.find((item) => item[key]?.toString() === value?.toString());
};

export const withKeys = (array) => {
  return array.map((item) => ({ ...item, key: item.id }));
};

export const autoSorter = (a, b) => {
  if (isNaN(a) || isNaN(b)) return a?.toString().localeCompare(b?.toString());
  return a > b;
};
