
export const arrayFind = (array, value, key = 'key') => {
  return array?.find((item) => item[key] === value);
};

export const withKeys = (array) => {
  return array.map((item) => ({ ...item, key: item.id }));
};
