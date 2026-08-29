const GalleryItem = require("./galleryItem.model");

async function listGallery() {
  const docs = await GalleryItem.find().sort({ createdAt: -1 });
  return docs.map((d) => d.toJSON());
}

async function createGalleryItem(data) {
  const { id, _id, ...rest } = data || {};
  const doc = await GalleryItem.create(rest);
  return doc.toJSON();
}

async function updateGalleryItem(id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await GalleryItem.findByIdAndUpdate(id, { $set: rest }, { new: true });
  if (!doc) {
    const err = new Error("ছবি পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return doc.toJSON();
}

async function deleteGalleryItem(id) {
  const doc = await GalleryItem.findByIdAndDelete(id);
  if (!doc) {
    const err = new Error("ছবি পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return { id };
}

module.exports = { listGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem };