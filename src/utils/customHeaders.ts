export function validateCustomHeader(
  name: string,
  value: string,
  headers: Record<string, string>,
): string | null {
  const key = name.trim();
  if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(key)) return "Enter a valid HTTP header name.";
  if (!value.trim() || /[\r\n]/.test(value)) return "Enter a header value without line breaks.";
  if (Object.keys(headers).some((existing) => existing.toLowerCase() === key.toLowerCase())) {
    return "This header is already added.";
  }
  return null;
}
