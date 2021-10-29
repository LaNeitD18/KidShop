export const getByKey = (array, key) => {
  return array.find((item) => item.key === key)
}

export const withKeys = (array) => {
  return array.map((item) => ({ ...item, key: item.id }))
}
