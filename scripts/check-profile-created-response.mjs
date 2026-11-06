import assert from "node:assert/strict";
import { isProfileCreatedResponse } from "../supabase/functions/_shared/profileCreatedResponse.ts";

for (const response of [
  "Profile Created successfully!! ",
  '"Profile Created successfully!!"',
  '{"message":"Profile Created successfully!!"}',
]) {
  assert.equal(isProfileCreatedResponse(response), true, response);
}

for (const response of [
  "Profile creation failed",
  "Profile Created unsuccessfully!!",
  '{"message":"Profile Created successfully!! but duplicate"}',
  "",
]) {
  assert.equal(isProfileCreatedResponse(response), false, response);
}
