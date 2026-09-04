const SiteSetting = require("./siteSetting.model");
const ListItem = require("./listItem.model");
const { toClientDoc } = require("../../utils/leanTransform");

/* ---- singleton settings ---- */

async function getSetting(key) {
  const doc = await SiteSetting.findOne({ key }).lean();
  return doc ? doc.value : null;
}

async function putSetting(key, value) {
  const doc = await SiteSetting.findOneAndUpdate(
    { key },
    { key, value },
    { upsert: true, new: true }
  ).lean();
  return doc.value;
}

/* ---- list-based collections ---- */

async function listAll(collection) {
  // .lean() skips full Mongoose document hydration on every row of every
  // list request — this is the endpoint every menu/section on the site
  // calls on load, so it's the biggest win for perceived page-to-page speed.
  const docs = await ListItem.find({ collection })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return docs.map(toClientDoc);
}

async function createItem(collection, data) {
  const { id, _id, ...rest } = data || {};
  const doc = await ListItem.create({ collection, ...rest });
  return toClientDoc(doc.toObject());
}

async function updateItem(collection, id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await ListItem.findOneAndUpdate(
    { _id: id, collection },
    { $set: rest },
    { new: true }
  ).lean();
  if (!doc) {
    const err = new Error("আইটেম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return toClientDoc(doc);
}

async function deleteItem(collection, id) {
  const doc = await ListItem.findOneAndDelete({ _id: id, collection }).lean();
  if (!doc) {
    const err = new Error("আইটেম পাওয়া যায়নি।");
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
