export const makePath = (...stringArr) => {
  const nonEmtpyStrings = stringArr.filter((s) => s)
  return nonEmtpyStrings.join('/')
}
