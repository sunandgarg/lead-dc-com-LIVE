export function isProfileCreatedResponse(body: string): boolean {
  let response: unknown;
  try {
    response = JSON.parse(body);
  } catch {
    response = body;
  }

  const message = typeof response === "string"
    ? response
    : response && typeof response === "object" && !Array.isArray(response)
      ? (response as Record<string, unknown>).message ?? (response as Record<string, unknown>).Message
      : null;

  return typeof message === "string" && message.trim().toLowerCase() === "profile created successfully!!";
}
