const SiteSetting = require("./siteSetting.model");
const ListItem = require("./listItem.model");

/* ---- singleton settings ---- */

async function getSetting(key) {
  const doc = await SiteSetting.findOne({ key });
  return doc ? doc.value : null;
}

async function putSetting(key, value) {
  const doc = await SiteSetting.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  );
  return doc.value;
}

/* ---- list-based collections ---- */

async function listAll(collection) {
  const docs = await ListItem.find({ collection }).sort({
    order: 1,
    createdAt: 1,
  });
  return docs.map((d) => d.toJSON());
}

async function createItem(collection, data) {
  const { id, _id, ...rest } = data || {};
  const doc = await ListItem.create({ collection, ...rest });
  return doc.toJSON();
}

async function updateItem(collection, id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await ListItem.findOneAndUpdate(
    { _id: id, collection },
    { $set: rest },
    { new: true }
  );
  if (!doc) {
    const err = new Error("আইটেম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return doc.toJSON();
}

async function deleteItem(collection, id) {
  const doc = await ListItem.findOneAndDelete({ _id: id, collection });
  if (!doc) {
    const err = new Error("আইটেম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return { id };
}

module.exports = {
  getSetting,
  putSetting,
  listAll,
  createItem,
  updateItem,
  deleteItem,
};