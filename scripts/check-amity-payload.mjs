import assert from "node:assert/strict";
import { normalizeAmityExternalPartnerPayload as normalize } from "../supabase/functions/_shared/amityExternalPartner.ts";

const url = "https://portal.amity.edu/onlineform/api/v1/ExternalPartner/create-profile";
const fields = { firstName: "Test", courseCode: "A01019", utmCampaign: "API", isInterNational: "false" };
assert.deepEqual(normalize(fields, url), { ...fields, isInterNational: false });
assert.equal(normalize({ isInterNational: "true" }, url).isInterNational, true);
assert.equal(normalize({}, url).isInterNational, false);
assert.equal(normalize(fields, "https://portal.amity.edu/NewOnlineForm/onlineforms/CampaignAdmissionAPI"), fields);
assert.equal(normalize(fields, "https://other.example/create-profile"), fields);
assert.equal(normalize(fields, "invalid"), fields);
