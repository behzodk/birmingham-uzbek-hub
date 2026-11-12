const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")
const source = fs.readFileSync(path.join(__dirname, "../src/lib/formVisibility.ts"), "utf8")
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText
const loaded = { exports: {} }
new Function("module", "exports", code)(loaded, loaded.exports)
const { getVisibleFormFields } = loaded.exports

const fields = [
  { key: "root" },
  { key: "child", conditional: { field_key: "root", option: "Yes" } },
  { key: "grandchild", conditional: { field_key: "child", option: "Yes" } },
  { key: "greatGrandchild", conditional: { field_key: "grandchild", option: "Yes" } },
  { key: "independent" },
]
const visibleKeys = (answers) => getVisibleFormFields(fields, answers).map((field) => field.key)

test("hidden ancestors override stale descendant answers", () => {
  assert.deepEqual(visibleKeys({ root: "No", child: "Yes", grandchild: "Yes" }), ["root", "independent"])
})
test("matching ancestors reveal the complete chain", () => {
  assert.deepEqual(visibleKeys({ root: "Yes", child: "Yes", grandchild: "Yes" }), fields.map((field) => field.key))
})
test("intermediate mismatch hides only its descendants", () => {
  assert.deepEqual(visibleKeys({ root: "Yes", child: "No", grandchild: "Yes" }), ["root", "child", "independent"])
})
test("unanswered parent hides descendants", () => {
  assert.deepEqual(visibleKeys({}), ["root", "independent"])
})
test("matching strings are trimmed and non-string answers cannot reveal fields", () => {
  assert.deepEqual(visibleKeys({ root: " Yes ", child: true }), ["root", "child", "independent"])
})
test("orphan and cyclic conditions fail closed", () => {
  const malformed = [
    { key: "orphan", conditional: { field_key: "missing", option: "Yes" } },
    { key: "a", conditional: { field_key: "b", option: "Yes" } },
    { key: "b", conditional: { field_key: "a", option: "Yes" } },
  ]
  assert.deepEqual(getVisibleFormFields(malformed, { missing: "Yes", a: "Yes", b: "Yes" }), [])
})
test("toggling a parent recalculates visibility without mutating retained answers", () => {
  const answers = { root: "Yes", child: "Yes", grandchild: "Yes" }
  assert.equal(visibleKeys(answers).length, 5)
  answers.root = "No"
  assert.deepEqual(visibleKeys(answers), ["root", "independent"])
  assert.equal(answers.child, "Yes")
  answers.root = "Yes"
  assert.equal(visibleKeys(answers).length, 5)
})
