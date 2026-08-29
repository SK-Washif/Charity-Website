const { getAuth } = require("@clerk/express");
const { fail } = require("../../utils/apiResponse");

function requireAdmin(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) {
    return fail(res, 401, "অননুমোদিত — লগইন প্রয়োজন।");
  }
  req.adminUserId = userId;
  next();
}

module.exports = requireAdmin;