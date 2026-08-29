"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const empty = {
  studentNameBn: "",
  studentNameEn: "",
  fatherNameBn: "",
  fatherNameEn: "",
  motherNameBn: "",
  motherNameEn: "",
  studentMobile: "",
  gender: "",
  hscGroup: "",
  permanentDivision: "",
  permanentDistrict: "",
  permanentUpazila: "",
  permanentMunicipality: "",
  permanentVillage: "",
  currentDivision: "",
  currentDistrict: "",
  currentUpazila: "",
  currentMunicipality: "",
  currentVillage: "",
  gpa: "",
  gpaWithout4th: "",
  guardianYearlyIncome: "",
  hasDisability: "",
  disabilityType: "",
  siblingsCount: "",
};

function Cell({ children, className = "", label = false, ...rest }) {
  return (
    <td
      className={`border border-black px-1.5 py-1 align-top font-body text-[14px] leading-tight ${
        label ? "w-[26%] font-medium" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </td>
  );
}

function SectionRow({ left, right }) {
  return (
    <tr>
      <td
        colSpan={2}
        className="border border-black bg-neutral-100 py-1 text-center font-body text-[12px] font-bold"
      >
        {left}
      </td>
      <td
        colSpan={2}
        className="border border-black bg-neutral-100 py-1 text-center font-body text-[12px] font-bold"
      >
        {right}
      </td>
    </tr>
  );
}

function GenderMark({ current, option }) {
  return (
    <span className={current === option ? "font-bold underline" : ""}>
      {option}
    </span>
  );
}

export default function ScholarshipPrintPage() {
  const router = useRouter();
  const [data, setData] = useState(empty);
  const [loaded, setLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef1 = useRef(null);
  const printRef2 = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("scholarshipFormData");
      console.log("📥 Raw data from localStorage:", raw);
      
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log("📥 Parsed data:", parsed);
        setData({ ...empty, ...parsed });
      } else {
        console.log("ℹ️ No data found in localStorage, redirecting to form...");
        router.push("/scholarship");
      }
    } catch (e) {
      console.error("❌ Error loading data:", e);
      router.push("/scholarship");
    }
    setLoaded(true);
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.push("/scholarship");
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    
    try {
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas-pro")).default;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ✅ Page 1
      const el1 = document.getElementById("scholarship-print-page-1");
      if (el1) {
        const canvas1 = await html2canvas(el1, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: el1.scrollWidth,
          height: el1.scrollHeight,
          windowWidth: el1.scrollWidth,
          windowHeight: el1.scrollHeight,
          onclone: (clonedDoc) => {
            // ✅ Ensure tables are properly rendered in clone
            const tables = clonedDoc.querySelectorAll("table");
            tables.forEach(table => {
              table.style.borderCollapse = "collapse";
            });
          }
        });
        const imgData1 = canvas1.toDataURL("image/png");
        pdf.addImage(imgData1, "PNG", 0, 0, 210, 297);
      }

      // ✅ Page 2
      const el2 = document.getElementById("scholarship-print-page-2");
      if (el2) {
        pdf.addPage();
        const canvas2 = await html2canvas(el2, {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: el2.scrollWidth,
          height: el2.scrollHeight,
          windowWidth: el2.scrollWidth,
          windowHeight: el2.scrollHeight,
          onclone: (clonedDoc) => {
            const tables = clonedDoc.querySelectorAll("table");
            tables.forEach(table => {
              table.style.borderCollapse = "collapse";
            });
          }
        });
        const imgData2 = canvas2.toDataURL("image/png");
        pdf.addImage(imgData2, "PNG", 0, 0, 210, 297);
      }

      pdf.save("নুরুল-বাছেরা-শিক্ষাবৃত্তি-আবেদন-ফর্ম.pdf");
    } catch (err) {
      console.error("PDF generate error:", err);
      alert(
        `দুঃখিত, PDF তৈরি করতে সমস্যা হয়েছে। বিস্তারিত: ${
          err?.message || "অজানা সমস্যা"
        }`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-ink-muted">লোড হচ্ছে...</p>
      </div>
    );
  }

  const hasData = Object.values(data).some(value => value !== "");
  if (!hasData && loaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-ink-muted text-lg">কোনো ডেটা পাওয়া যায়নি।</p>
        <button
          onClick={handleBack}
          className="mt-4 rounded-md bg-stamp px-6 py-2.5 font-body font-semibold text-white hover:opacity-90 transition"
        >
          ফর্মে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { background: white; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          nav, header, footer { display: none !important; }
          #scholarship-print-page-1, #scholarship-print-page-2 {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            width: 100% !important;
            height: 100% !important;
            page-break-after: always;
          }
        }
        /* ✅ Print styles for table */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
        }
        td, th {
          border: 1px solid black !important;
        }
      `}</style>

      {/* Print Controls */}
      <div className="no-print mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="rounded-md border border-stamp/30 px-4 py-2 font-body text-sm text-ink hover:bg-stamp/10"
          >
            ← ফিরে যান
          </button>
          <p className="font-body text-sm text-ink-muted">
            নিচের ফর্মটি প্রি-ফিল করা হয়েছে। প্রিন্ট করে বাকি ঘরগুলো হাতে পূরণ করুন।
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handlePrint}
            className="rounded-md bg-stamp px-6 py-2.5 font-body font-semibold text-white hover:opacity-90 transition"
          >
            🖨️ প্রিন্ট করুন
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="rounded-md border border-stamp px-6 py-2.5 font-body font-semibold text-stamp hover:bg-stamp/10 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? "তৈরি হচ্ছে..." : "⬇️ PDF ডাউনলোড করুন"}
          </button>
        </div>
      </div>

      {/* ================= PAGE 1 ================= */}
      <div
        id="scholarship-print-page-1"
        ref={printRef1}
        className="mx-auto w-[210mm] h-[297mm] overflow-hidden bg-white p-[10mm] print:break-after-page print:p-[10mm] print:shadow-none shadow-lg text-ink"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 text-center">
            <h1 className="font-display text-xl font-bold">
              নুরুল-বাছেরা শিক্ষা-বৃত্তি প্রকল্প
            </h1>
            <p className="mt-0.5 font-body text-sm">
              (ঐকতান ফাউন্ডেশনের আওতাধীন একটি প্রকল্প)
            </p>
            <p className="mt-1 font-body text-xs">
              ঠিকানা: হোল্ডিং নম্বর: ৯৭১-০০ ওয়ার্ড নম্বর: ০২
            </p>
            <p className="font-body text-xs">কাটিয়া সরকার পাড়া, সাতক্ষীরা</p>
          </div>
          <div className="ml-4 flex h-[24mm] w-[20mm] shrink-0 items-center justify-center border border-black text-center font-body text-[10px]">
            পাসপোর্ট<br/>সাইজের<br/>ছবি
          </div>
        </div>

        <table className="mt-2 w-full border-collapse">
          <tbody>
            <tr>
              <td
                colSpan={4}
                className="border border-black bg-neutral-100 py-1 text-center font-body text-[12px] font-bold"
              >
                ব্যক্তিগত তথ্য
              </td>
            </tr>

            <tr>
              <Cell label>শিক্ষার্থীর নাম (বাংলা)</Cell>
              <Cell colSpan={3}>{data.studentNameBn || ""}</Cell>
            </tr>
            <tr>
              <Cell label>শিক্ষার্থীর নাম (ইংরেজি)</Cell>
              <Cell colSpan={3}>{data.studentNameEn || ""}</Cell>
            </tr>
            <tr>
              <Cell label>জন্ম তারিখ</Cell>
              <Cell></Cell>
              <Cell label>লিঙ্গ (সঠিকটিতে √ দিন)</Cell>
              <Cell>
                <GenderMark current={data.gender} option="পুরুষ" /> /{" "}
                <GenderMark current={data.gender} option="মহিলা" /> /{" "}
                <GenderMark current={data.gender} option="অন্যান্য" />
              </Cell>
            </tr>
            <tr>
              <Cell label="পিতার নাম (বাংলা)" className="align-middle">
                {data.fatherNameBn || ""}
              </Cell>
              <Cell></Cell>
              <Cell label>শিক্ষার্থীর মোবাইল নম্বর</Cell>
              <Cell>{data.studentMobile || ""}</Cell>
            </tr>
            <tr>
              <Cell label>পিতার নাম (ইংরেজি)এন.আই.ডি নম্বর</Cell>
              <Cell>{data.fatherNameEn || ""}</Cell>
              <Cell label>মাতার নাম (বাংলা)</Cell>
              <Cell>{data.motherNameBn || ""}</Cell>
            </tr>
            <tr>
              <Cell label>পিতার এন.আই.ডি নম্বর</Cell>
              <Cell></Cell>
              <Cell label>মাতার নাম (ইংরেজি)</Cell>
              <Cell>{data.motherNameEn || ""}</Cell>
            </tr>
            <tr>
              <Cell label>পিতার মোবাইল নম্বর</Cell>
              <Cell></Cell>
              <Cell></Cell>
              <Cell></Cell>
            </tr>

            <SectionRow left="স্থায়ী ঠিকানা" right="বর্তমান ঠিকানা" />
            <tr>
              <Cell label>বিভাগ</Cell>
              <Cell>{data.permanentDivision || ""}</Cell>
              <Cell label>বিভাগ</Cell>
              <Cell>{data.currentDivision || ""}</Cell>
            </tr>
            <tr>
              <Cell label>জেলা</Cell>
              <Cell>{data.permanentDistrict || ""}</Cell>
              <Cell label>জেলা</Cell>
              <Cell>{data.currentDistrict || ""}</Cell>
            </tr>
            <tr>
              <Cell label>উপজেলা</Cell>
              <Cell>{data.permanentUpazila || ""}</Cell>
              <Cell label>উপজেলা</Cell>
              <Cell>{data.currentUpazila || ""}</Cell>
            </tr>
            <tr>
              <Cell label>পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন</Cell>
              <Cell>{data.permanentMunicipality || ""}</Cell>
              <Cell label>পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন</Cell>
              <Cell>{data.currentMunicipality || ""}</Cell>
            </tr>
            <tr>
              <Cell label>গ্রাম</Cell>
              <Cell>{data.permanentVillage || ""}</Cell>
              <Cell label>গ্রাম</Cell>
              <Cell>{data.currentVillage || ""}</Cell>
            </tr>

            <SectionRow
              left="পূর্ববর্তী শিক্ষা তথ্য (এস.এস.সি)"
              right="বর্তমান শিক্ষা তথ্য"
            />
            <tr>
              <Cell label>প্রতিষ্ঠানের নাম</Cell>
              <Cell></Cell>
              <Cell label>বিভাগ</Cell>
              <Cell>{data.hscGroup || ""}</Cell>
            </tr>
            <tr>
              <Cell label>উত্তীর্ণ হওয়ার বছর</Cell>
              <Cell></Cell>
              <Cell label colSpan={2}>প্রতিষ্ঠানের নাম:</Cell>
            </tr>
            <tr>
              <Cell label>শিক্ষাবোর্ড</Cell>
              <Cell></Cell>
              <Cell colSpan={2}></Cell>
            </tr>
            <tr>
              <Cell label>রোল নম্বর</Cell>
              <Cell></Cell>
              <Cell label>একাদশ শ্রেণিতে ভর্তির বছর</Cell>
              <Cell></Cell>
            </tr>
            <tr>
              <Cell label>রেজি: নম্বর</Cell>
              <Cell></Cell>
              <Cell label>রোল নম্বর</Cell>
              <Cell></Cell>
            </tr>
            <tr>
              <Cell label>ফলাফল (জিপিএ)</Cell>
              <Cell>{data.gpa || ""}</Cell>
            </tr>
            <tr>
              <Cell label>ফলাফল (জিপিএ) — ৪র্থ বিষয় ছাড়া</Cell>
              <Cell>{data.gpaWithout4th || ""}</Cell>
            </tr>

            <SectionRow left="অভিভাবকের তথ্য" right="অন্যান্য তথ্য" />
            <tr>
              <Cell label>
                সম্পর্ক নির্বাচন করুন
                <br />
                (সঠিকটিতে √ দিন)
              </Cell>
              <Cell>পিতা / মাতা/ভাই/বোন/ অন্যান্য</Cell>
              <Cell label>কে পড়াশোনার খরচ বহন করে?</Cell>
              <Cell>পিতা/ মাতা/ অভিভাবক/ নিজ/অন্যান্য</Cell>
            </tr>
            <tr>
              <Cell label>নাম (বাংলা)</Cell>
              <Cell></Cell>
              <Cell
                label
                className="align-middle"
              >
                আবেদনকারীর কি কোনো শারীরিক প্রতিবন্ধকতা আছে? থাকলে কি ধরনের
                প্রতিবন্ধকতা?
              </Cell>
              <Cell>
                {data.hasDisability || ""}
                {data.hasDisability === "হ্যাঁ" && data.disabilityType
                  ? ` — ${data.disabilityType}`
                  : ""}
              </Cell>
            </tr>
            <tr>
              <Cell label>নাম (ইংরেজি)</Cell>
              <Cell></Cell>
              <Cell label>
                আবেদনকারী কি অন্য কোনো উৎস হতে বৃত্তি/উপবৃত্তি পান?
              </Cell>
              <Cell>হ্যাঁ / না</Cell>
            </tr>
            <tr>
              <Cell label>অভিভাবকের NID নম্বর</Cell>
              <Cell></Cell>
              <Cell label>অভিভাবকের বাৎসরিক আয় (টাকায়)</Cell>
              <Cell>{data.guardianYearlyIncome || ""}</Cell>
            </tr>
            <tr>
              <Cell label>ঠিকানা</Cell>
              <Cell></Cell>
              <Cell label>অভিভাবকের মোবাইল নম্বর</Cell>
              <Cell></Cell>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div
        id="scholarship-print-page-2"
        ref={printRef2}
        className="mx-auto w-[210mm] h-[297mm] overflow-hidden bg-white p-[12mm] print:p-[12mm] print:shadow-none shadow-lg text-ink"
      >
        <p className="border border-black bg-neutral-100 px-3 py-2 font-body text-[13px]">
          আবেদনকারীর অন্যান্য ভাই/বোন অধ্যয়ন করলে তাদের নাম ও কোন শ্রেণিতে
          অধ্যয়ন করে এবং তাদের পড়াশোনার খরচ কে বহন করে তা নীচে উল্লেখ করুন
          {data.siblingsCount
            ? ` (মোট ভাই-বোন সংখ্যা: ${data.siblingsCount})`
            : ""}:
        </p>

        {/* ✅ Fixed Table with proper borders */}
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="w-[10%] border border-black py-1.5 font-body text-[13px] font-bold text-center">
                ক্র:নং
              </th>
              <th className="w-[30%] border border-black py-1.5 font-body text-[13px] font-bold text-center">
                নাম
              </th>
              <th className="w-[30%] border border-black py-1.5 font-body text-[13px] font-bold text-center">
                অধ্যয়নকৃত শ্রেণি
              </th>
              <th className="w-[30%] border border-black py-1.5 font-body text-[13px] font-bold text-center">
                কে পড়াশোনার খরচ বহন করে?
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((n) => (
              <tr key={n}>
                <td className="border border-black px-1.5 py-3 text-center font-body text-[14px]">
                  {n}
                </td>
                <td className="border border-black px-1.5 py-3 font-body text-[14px]"></td>
                <td className="border border-black px-1.5 py-3 font-body text-[14px]"></td>
                <td className="border border-black px-1.5 py-3 font-body text-[14px]"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-8 font-body text-[14px] leading-relaxed">
          আমি প্রতিজ্ঞা পূর্বক বলছি যে, উপরে উল্লেখিত বিবরণাদি আমার জ্ঞান ও
          বিশ্বাস মতে সত্য এবং কোনও বিষয় অসত্য প্রমাণিত হলে আমার বৃত্তি
          বাতিল বলে গণ্য হবে এবং গৃহীত বৃত্তির টাকা ফেরত দিতে বাধ্য থাকবো।
        </p>

        <div className="mt-20 flex justify-between font-body text-[14px]">
          <div>
            <p>আবেদনকারীর স্বাক্ষর</p>
            <p className="mt-1">তারিখ:</p>
          </div>
          <div>
            <p>অভিভাবকের স্বাক্ষর</p>
            <p className="mt-1">তারিখ:</p>
          </div>
        </div>

        <h2 className="mt-12 font-body text-[14px] font-bold underline">
          আবেদন ফর্ম পূরণের নির্দেশাবলীঃ
        </h2>
        <ul className="mt-3 list-none space-y-2 font-body text-[13px] leading-relaxed">
          <li>
            ➤ আবেদনকারী শিক্ষার্থী অত্যন্ত সতর্কতার সাথে তথ্যের সঠিকতা
            নিশ্চিত হয়ে ফর্ম পূরণ করবেন;
          </li>
          <li>➤ আবেদনকারী স্বহস্তে ফর্ম পূরণ করবেন;</li>
          <li>
            ➤ ফর্মের সাথে নিম্নোক্ত কাগজপত্র অবশ্যই সংযুক্ত করতে হবে:
            <ul className="ml-6 mt-2 list-none space-y-1.5">
              <li>▪ পাসপোর্ট সাইজের (সদ্যতোলা) ছবি ০১ কপি;</li>
              <li>▪ পিতার (NID) জাতীয় পরিচয়পত্রের ফটোকপি;</li>
              <li>
                ▪ এস.এস.সি পরীক্ষার বিষয়ভিত্তিক মার্কশিট এবং এডমিট কার্ডের
                ফটোকপি:
              </li>
              <li>
                ▪ পৌরসভার মেয়র/ইউনিয়ন পরিষদের চেয়ারম্যান কর্তৃক অভিভাবকের
                বাৎসরিক আয়ের প্রত্যায়ন পত্র;
              </li>
              <li>
                ▪ একাদশ শ্রেণির ভর্তি হওয়ার প্রমাণ / ভর্তির রিসিটের ফটোকপি, ও
              </li>
              <li>▪ অন্যান্য আনুষঙ্গিক তথ্য (যদি থাকে)</li>
            </ul>
          </li>
          <li>
            ➤ সংযুক্ত সকল ফটোকপিগুলো অবশ্যই স্পষ্ট এবং A4 সাইজ পেপারে হতে
            হবে; এবং
          </li>
          <li>
            ➤ নীতিমালা অনুযায়ী প্রকল্প কর্তৃপক্ষ বৃত্তিরজন্য শিক্ষার্থী
            নির্বাচনের ব্যবস্থা করবে এবং প্রকল্প কর্তৃপক্ষের সিদ্ধান্ত
            চূড়ান্ত বলে গণ্য হবে।
          </li>
        </ul>
      </div>
    </>
  );
}