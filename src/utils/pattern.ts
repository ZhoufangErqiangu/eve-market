/**
 * id number pattern
 */
export const IdNumPattern = /^[0-9]{17}[0-9Xx]$/;

/**
 * phone number pattern
 */
export const PhonePattern =
  /^(\+\d{2}[-, ]*)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/;

/**
 * email pattern
 */
export const EmailPattern = /^.+@.+\..+$/i;
