export function formatPhone(phone: string): string {
  // Remove any non-digit characters
  const clean = phone.replace(/\D/g, "");

  // Expecting a Brazilian number: country code (55), area code (2 digits), number (8 or 9 digits)
  // Make sure the clean string is long enough
  if (clean.length < 11) {
    return phone; // Return original if format is not as expected
  }

  // Extract parts:
  const country = clean.slice(0, 2); // "55"
  const area = clean.slice(2, 4); // "11"
  const numberPart = clean.slice(4); // remaining digits: "914199793" or "91419979"

  let firstPart;
  let secondPart;

  if (numberPart.length === 9) {
    // For 9-digit numbers (commonly cell numbers): first 5 digits, then dash, then 4 digits.
    firstPart = numberPart.slice(0, 5);
    secondPart = numberPart.slice(5);
  } else if (numberPart.length === 8) {
    // For 8-digit numbers: first 4 digits, then dash, then 4 digits.
    firstPart = numberPart.slice(0, 4);
    secondPart = numberPart.slice(4);
  } else {
    return phone; // if numberPart is not 8 or 9 digits, fallback
  }

  return `+${country} (${area}) ${firstPart}-${secondPart}`;
}

export function formatDecimal(value: string): string {
  // Remove all non-numeric characters except for `,`
  const cleanValue = value.replace(/[^0-9,]/g, "");

  // Split the input into the integer and decimal parts
  const [integerPart, decimalPart] = cleanValue.split(",");

  // Remove existing dots and reformat the integer part
  const formattedInteger = integerPart
    .replace(/\./g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Limit the decimal part to 2 characters
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart.slice(0, 2)}`;
  }

  // Append the decimal part if it exists
  if (decimalPart !== undefined) {
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

export function formatCurrency(
  value: string,
  currencySymbol: string = "R$"
): string {
  const formattedValue = formatDecimal(value);
  return `${currencySymbol} ${formattedValue}`;
}
