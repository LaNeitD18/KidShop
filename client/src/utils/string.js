import Moment from 'react-moment';

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
  const codeName = [code, name].join(code && name ? ' ' : '');
  return {
    code,
    name,
    message,
    codeName,
    combine: `${codeName} ${name && message ? ':' : ''} ${message}`,
  };
}

export const inputRuleNaN = (message = 'Vui lòng chỉ nhập số') => ({
  pattern: new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g),
  message: message,
});

export const currenyInt = (num) => {
  return num
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    .slice(0, -3);
};

export const currency = (num) => {
  return currenyInt(num) + ' VNĐ';
};

export const date = (time) => {
  return <Moment format="DD/MM/YYYY">{time}</Moment>;
};
