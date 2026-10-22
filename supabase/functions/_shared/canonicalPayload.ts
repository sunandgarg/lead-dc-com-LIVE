export function isMappedCanonicalDuplicate(
  key: string,
  value: string,
  payload: Record<string, string>,
  fields: Array<{ fieldName: string; sourceType: string }>,
): boolean {
  if (!["name", "email", "mobile", "course"].includes(key)) return false;

  return fields.some((field) => {
    const target = field.fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return field.sourceType === "lead_data" && field.fieldName !== key &&
      (target.includes(key) || (key === "mobile" && target.includes("phone"))) &&
      payload[field.fieldName] === value;
  });
}
