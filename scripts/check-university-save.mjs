import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/pages/Index.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("Index.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let save;
let fetchDetails;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "handleSaveEdit") save = node.initializer.getText(ast);
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "fetchUniversityDetails") fetchDetails = node.initializer.getText(ast);
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(save);
const javascript = ts.transpileModule(`const save = ${save}; save;`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const saved = { id: "university", column_mapping: { name: "firstName" }, default_values: { utmCampaign: "API" } };
let updated;
let merged;
let closed = false;
const query = {
  update(value) { updated = value; return this; },
  eq() { return this; },
  select() { return this; },
  single: async () => ({ data: saved, error: null }),
  delete() { return this; },
};
const run = vm.runInNewContext(javascript, {
  supabase: { from: () => query },
  fetchUniversities: async () => {},
  mergeUniversityInState: (value) => { merged = value; },
  toast: () => {},
  closeEditModal: () => { closed = true; },
  console: { error: () => {} },
});
const form = { id: saved.id, programs: [], stateCities: [], courseSpecializations: [], columnMapping: saved.column_mapping, defaultValues: saved.default_values };
await run(form);
assert.equal(updated.column_mapping, saved.column_mapping);
assert.equal(updated.default_values, saved.default_values);
assert.equal(merged.column_mapping, saved.column_mapping);
assert.equal(closed, true);
closed = false;
query.single = async () => ({ data: null, error: new Error("Save denied") });
await assert.rejects(run(form), /Save denied/);
assert.equal(closed, false);

const cached = { ...saved, column_mapping: { name: "oldField" } };
query.single = async () => ({ data: saved, error: null });
const getDetails = vm.runInNewContext(ts.transpileModule(`const get = ${fetchDetails}; get;`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText, {
  useCallback: (callback) => callback,
  universities: [cached],
  selectedUploadUniversity: cached,
  hasUniversityDetails: () => true,
  supabase: { from: () => query },
  UNIVERSITY_DETAIL_COLUMNS: "id,column_mapping",
  mergeUniversityInState: (value) => value,
});
assert.equal((await getDetails(saved.id)).column_mapping, cached.column_mapping);
assert.equal((await getDetails(saved.id, true)).column_mapping, saved.column_mapping);
