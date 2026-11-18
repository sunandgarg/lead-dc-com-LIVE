export function normalizeAmityExternalPartnerPayload(payload: unknown, apiUrl: string): unknown {
  let url: URL;
  try {
    url = new URL(apiUrl);
  } catch {
    return payload;
  }
  if (url.hostname !== "portal.amity.edu" ||
    url.pathname.toLowerCase() !== "/onlineform/api/v1/externalpartner/create-profile" ||
    !payload || typeof payload !== "object" || Array.isArray(payload)) return payload;

  const record = payload as Record<string, unknown>;
  return { ...record, isInterNational: record.isInterNational === true || record.isInterNational === "true" };
}
