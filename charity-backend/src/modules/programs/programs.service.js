const Program = require("./program.model");
const { toClientDoc } = require("../../utils/leanTransform");

async function listPrograms() {
  const docs = await Program.find().sort({ order: 1, createdAt: 1 }).lean();
  return docs.map(toClientDoc);
}

async function createProgram(data) {
  const { id, _id, ...rest } = data || {};
  const doc = await Program.create(rest);
  return toClientDoc(doc.toObject());
}

async function updateProgram(id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await Program.findByIdAndUpdate(id, { $set: rest }, { new: true }).lean();
  if (!doc) {
    const err = new Error("প্রোগ্রাম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return toClientDoc(doc);
}

async function deleteProgram(id) {
  const doc = await Program.findByIdAndDelete(id).lean();
  if (!doc) {
    const err = new Error("প্রোগ্রাম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return { id };
}

module.exports = { listPrograms, createProgram, updateProgram, deleteProgram };
