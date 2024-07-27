export const formatDecimalInput = (text: string) => {
  // Remove any non-digit characters, except the decimal point
  text = text.replace(/[^0-9.]/g, "");

  // Match the first occurrence of a decimal point and limit to two decimal places
  const parts = text.split(".");
  if (parts.length > 2) {
    text = `${parts[0]}.${parts[1].slice(0, 2)}`;
  } else if (parts.length === 2) {
    text = `${parts[0]}.${parts[1].slice(0, 2)}`;
  }

  return text;
};
