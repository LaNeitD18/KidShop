export function idString(id = 0, prefix = '', digits = 6) {
  return prefix.concat(id.toString().padStart(digits, '0'));
}
