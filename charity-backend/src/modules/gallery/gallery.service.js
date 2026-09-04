const GalleryItem = require("./galleryItem.model");
const { toClientDoc } = require("../../utils/leanTransform");

async function listGallery() {
  const docs = await GalleryItem.find().sort({ createdAt: -1 }).lean();
  return docs.map(toClientDoc);
}

async function createGalleryItem(data) {
  const { id, _id, ...rest } = data || {};
  const doc = await GalleryItem.create(rest);
  return toClientDoc(doc.toObject());
}

async function updateGalleryItem(id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await GalleryItem.findByIdAndUpdate(id, { $set: rest }, { new: true }).lean();
  if (!doc) {
    const err = new Error("ছবি পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return toClientDoc(doc);
}

async function deleteGalleryItem(id) {
  const doc = await GalleryItem.findByIdAndDelete(id).lean();
  if (!doc) {
    const err = new Error("ছবি পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return { id };
}

module.exports = { listGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem };
