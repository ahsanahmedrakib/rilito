export const PHONE_REGEX = /^01\d{9}$/;
export const MIN_PASSWORD_LENGTH = 6;

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export function validateName(name: string): boolean {
  return name.trim().length > 0;
}