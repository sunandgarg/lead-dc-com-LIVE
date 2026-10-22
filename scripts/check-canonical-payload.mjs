import assert from "node:assert/strict";
import { isMappedCanonicalDuplicate } from "../supabase/functions/_shared/canonicalPayload.ts";

const fields = ["CandidateName", "CandidateEmail", "CandidateMobile", "CourseCode"].map((fieldName) => ({
  fieldName,
  sourceType: "lead_data",
}));
const payload = {
  CandidateName: "test",
  CandidateEmail: "testdc@dc.com",
  CandidateMobile: "8989878987",
  CourseCode: "A01019",
  AccessKey: "configured-static-value",
};

for (const [key, value] of Object.entries({
  name: "test",
  email: "testdc@dc.com",
  mobile: "8989878987",
  course: "A01019",
})) {
  assert.equal(isMappedCanonicalDuplicate(key, value, payload, fields), true, key);
}

assert.equal(isMappedCanonicalDuplicate("city", "New Delhi", payload, fields), false);
assert.equal(isMappedCanonicalDuplicate("course", "different course", payload, fields), false);
assert.equal(isMappedCanonicalDuplicate("name", "configured-static-value", payload, [
  { fieldName: "AccessKey", sourceType: "static" },
]), false);
