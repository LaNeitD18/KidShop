export function idString(id = 0, idFormat = []) {
  const [prefix = '', digits = 6] = idFormat;
  return prefix.concat(id.toString().padStart(digits, '0'));
}

export function extractNumber(text) {
  return text
    ?.split('')
    ?.filter((c) => !isNaN(c))
    .join('')
    .replace(/^0+/, '');
}

export function errorString(err) {
  const code = err?.response?.status || err?.code;
  const name =
    err?.response?.data?.name || err?.request || err?.name || 'Đã xảy ra lỗi!';
  const message =
    err?.response?.data?.message ||
    err?.message ||
    'Yêu cầu của bạn đã không được thực hiện';
  return { code, name, message, codeName: `${code} ${name}` };
}
