const { z } = require("zod");

const scholarshipSchema = z.object({
  submittedAt: z.string().optional(),
  studentNameEn: z.string().trim().min(1, "শিক্ষার্থীর নাম আবশ্যক।"),
  fatherNameEn: z.string().trim().optional().default(""),
  motherNameEn: z.string().trim().optional().default(""),
  studentMobile: z.string().trim().min(6, "সঠিক মোবাইল নম্বর দিন।").max(20),
  gender: z.string().trim().optional().default(""),
  permanentAddress: z.string().trim().optional().default(""),
  currentAddress: z.string().trim().optional().default(""),
  hscGroup: z.string().trim().optional().default(""),
  gpa: z.string().trim().optional().default(""),
  gpaWithout4th: z.string().trim().optional().default(""),
  guardianYearlyIncome: z.string().trim().optional().default(""),
  hasDisability: z.string().trim().optional().default(""),
  disabilityType: z.string().trim().optional().default(""),
  siblingsCount: z.string().trim().optional().default(""),
});

function validateScholarship(payload) {
  const result = scholarshipSchema.safeParse(payload);
  if (!result.success) {
    const err = new Error("ফর্মের তথ্য ঠিক নেই।");
    err.status = 422;
    err.details = result.error.flatten();
    throw err;
  }
  return result.data;
}

module.exports = { validateScholarship };