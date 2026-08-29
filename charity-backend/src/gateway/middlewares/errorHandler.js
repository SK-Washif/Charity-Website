const { fail } = require("../../utils/apiResponse");
const env = require("../../config/env");

function errorHandler(err, req, res, next) {
  console.error("[error]", err);

  if (err.name === "ValidationError") {
    return fail(res, 400, "ইনপুট ভ্যালিডেশন ব্যর্থ হয়েছে।", err.errors);
  }
  if (err.name === "CastError") {
    return fail(res, 400, "ভুল ID ফরম্যাট।");
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && env.isProd
      ? "সার্ভারে একটা সমস্যা হয়েছে।"
      : err.message || "অপ্রত্যাশিত এরর।";

  return fail(res, status, message);
}

function notFoundHandler(req, res) {
  return fail(res, 404, `Route পাওয়া যায়নি: ${req.method} ${req.originalUrl}`);
}

module.exports = { errorHandler, notFoundHandler };