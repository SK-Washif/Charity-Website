const test = require("node:test");
const assert = require("node:assert");
const { validateScholarship } = require("../../src/modules/scholarship/validator");

test("খালি নাম দিয়ে সাবমিট করলে validation error হয়", () => {
  assert.throws(() => {
    validateScholarship({ studentNameEn: "", studentMobile: "01700000000" });
  }, /তথ্য ঠিক নেই/);
});

test("সঠিক payload validate হয়ে যায়", () => {
  const result = validateScholarship({ studentNameEn: "Rahim Uddin", studentMobile: "01700000000" });
  assert.strictEqual(result.studentNameEn, "Rahim Uddin");
  assert.strictEqual(result.gender, "");
});
