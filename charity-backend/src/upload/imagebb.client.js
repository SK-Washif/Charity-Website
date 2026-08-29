const axios = require("axios");
const FormData = require("form-data");
const env = require("../config/env");

async function uploadToImgbb(fileBuffer, filename) {
  if (!env.imagebbApiKey) {
    const err = new Error(
      "IMAGEBB_API_KEY কনফিগার করা নেই — backend-এর .env চেক করুন।"
    );
    err.status = 500;
    throw err;
  }

  const form = new FormData();
  form.append("image", fileBuffer, { filename });

  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${env.imagebbApiKey}`,
    form,
    { headers: form.getHeaders(), maxBodyLength: Infinity }
  );

  if (!data?.data?.url) {
    const err = new Error("ImgBB থেকে ছবির URL পাওয়া যায়নি।");
    err.status = 502;
    throw err;
  }

  return data.data.url;
}

module.exports = { uploadToImgbb };