const asyncHandler = require("../../utils/asyncHandler");
const { ok } = require("../../utils/apiResponse");
const service = require("./gallery.service");

exports.getAll = asyncHandler(async (req, res) => ok(res, await service.listGallery()));
exports.create = asyncHandler(async (req, res) => ok(res, await service.createGalleryItem(req.body), 201));
exports.update = asyncHandler(async (req, res) => ok(res, await service.updateGalleryItem(req.params.id, req.body)));
exports.remove = asyncHandler(async (req, res) => ok(res, await service.deleteGalleryItem(req.params.id)));