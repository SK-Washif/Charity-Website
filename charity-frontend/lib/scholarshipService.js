// lib/scholarshipService.js

const API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL;

// ঠিকানার ৫টা আলাদা ফিল্ড (বিভাগ, জেলা, উপজেলা, পৌরসভা/ইউনিয়ন, গ্রাম)
// কমা দিয়ে জুড়ে একটাই স্ট্রিং বানায়, খালি অংশ বাদ দিয়ে।
function joinAddressParts(division, district, upazila, municipality, village) {
  return [division, district, upazila, municipality, village]
    .map((v) => (v ?? "").toString().trim())
    .filter(Boolean)
    .join(", ");
}

export const submitScholarship = async (formData) => {
  if (!API_URL) {
    console.error(
      "[scholarshipService] NEXT_PUBLIC_GOOGLE_SHEETS_API_URL সেট করা নেই — .env.local চেক করুন।"
    );
    return { success: false, error: "API URL configured নেই" };
  }

  try {
    const permanentAddress = joinAddressParts(
      formData.permanentDivision,
      formData.permanentDistrict,
      formData.permanentUpazila,
      formData.permanentMunicipality,
      formData.permanentVillage
    );

    const currentAddress = joinAddressParts(
      formData.currentDivision,
      formData.currentDistrict,
      formData.currentUpazila,
      formData.currentMunicipality,
      formData.currentVillage
    );

    // Mobile number clean
    const cleanMobile = (formData.studentMobile || "").replace(/[^0-9]/g, "");

    const payload = {
      submittedAt: new Date().toISOString(),
      studentNameEn: formData.studentNameEn || "",
      fatherNameEn: formData.fatherNameEn || "",
      motherNameEn: formData.motherNameEn || "",
      studentMobile: cleanMobile,
      gender: formData.gender || "",
      permanentAddress,
      currentAddress,
      hscGroup: formData.hscGroup || "", // ✅ নতুন
      gpa: formData.gpa || "",
      gpaWithout4th: formData.gpaWithout4th || "",
      guardianYearlyIncome: formData.guardianYearlyIncome || "",
      hasDisability: formData.hasDisability || "",
      disabilityType: formData.disabilityType || "",
      siblingsCount: formData.siblingsCount || "",
    };

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return { success: true, payload };
  } catch (error) {
    console.error("Error submitting scholarship:", error);
    return { success: false, error: error.message };
  }
};