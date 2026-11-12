import assert from "node:assert/strict";
import { validateCustomHeader } from "../src/utils/customHeaders.ts";

assert.equal(validateCustomHeader("X-API-Key", "abc123", {}), null);
assert.equal(validateCustomHeader("X-Token", "value", { "x-token": "old" }), "This header is already added.");
assert.equal(validateCustomHeader("Bad Header", "value", {}), "Enter a valid HTTP header name.");
assert.equal(validateCustomHeader("X-Token", "line\nbreak", {}), "Enter a header value without line breaks.");
