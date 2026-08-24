import { api } from "@/lib/api";


function joinAddressParts(division, district, upazila, municipality, village) {
  return [division, district, upazila, municipality, village]
    .map((v) => (v ?? "").toString().trim())
    .filter(Boolean)
    .join(", ");
}

export const submitScholarship = async (formData) => {
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
      hscGroup: formData.hscGroup || "",
      gpa: formData.gpa || "",
      gpaWithout4th: formData.gpaWithout4th || "",
      guardianYearlyIncome: formData.guardianYearlyIncome || "",
      hasDisability: formData.hasDisability || "",
      disabilityType: formData.disabilityType || "",
      siblingsCount: formData.siblingsCount || "",
    };

   
    await api.submitScholarship(payload);

    return { success: true, payload };
  } catch (error) {
    console.error("Error submitting scholarship:", error);
    const backendMessage = error?.response?.data?.error?.message;
    return { success: false, error: backendMessage || error.message };
  }
};
