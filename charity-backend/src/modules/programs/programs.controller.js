const asyncHandler = require("../../utils/asyncHandler");
const { ok } = require("../../utils/apiResponse");
const service = require("./programs.service");

exports.getAll = asyncHandler(async (req, res) => {
  const items = await service.listPrograms();
  return ok(res, items);
});

exports.create = asyncHandler(async (req, res) => {
  const item = await service.createProgram(req.body);
  return ok(res, item, 201);
});

exports.update = asyncHandler(async (req, res) => {
  const item = await service.updateProgram(req.params.id, req.body);
  return ok(res, item);
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await service.deleteProgram(req.params.id);
  return ok(res, result);
});