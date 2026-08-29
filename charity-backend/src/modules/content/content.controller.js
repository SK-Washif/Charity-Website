const asyncHandler = require("../../utils/asyncHandler");
const { ok } = require("../../utils/apiResponse");
const service = require("./content.service");

function settingHandlers(key) {
  return {
    get: asyncHandler(async (req, res) => {
      const value = await service.getSetting(key);
      return ok(res, value);
    }),
    put: asyncHandler(async (req, res) => {
      const value = await service.putSetting(key, req.body);
      return ok(res, value);
    }),
  };
}

function listHandlers(collection) {
  return {
    getAll: asyncHandler(async (req, res) => {
      const items = await service.listAll(collection);
      return ok(res, items);
    }),
    create: asyncHandler(async (req, res) => {
      const item = await service.createItem(collection, req.body);
      return ok(res, item, 201);
    }),
    update: asyncHandler(async (req, res) => {
      const item = await service.updateItem(
        collection,
        req.params.id,
        req.body
      );
      return ok(res, item);
    }),
    remove: asyncHandler(async (req, res) => {
      const result = await service.deleteItem(collection, req.params.id);
      return ok(res, result);
    }),
  };
}

module.exports = { settingHandlers, listHandlers };