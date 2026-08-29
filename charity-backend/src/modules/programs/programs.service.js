const Program = require("./program.model");

async function listPrograms() {
  const docs = await Program.find().sort({ order: 1, createdAt: 1 });
  return docs.map((d) => d.toJSON());
}

async function createProgram(data) {
  const { id, _id, ...rest } = data || {};
  const doc = await Program.create(rest);
  return doc.toJSON();
}

async function updateProgram(id, data) {
  const { id: _ignored, _id, ...rest } = data || {};
  const doc = await Program.findByIdAndUpdate(id, { $set: rest }, { new: true });
  if (!doc) {
    const err = new Error("প্রোগ্রাম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return doc.toJSON();
}

async function deleteProgram(id) {
  const doc = await Program.findByIdAndDelete(id);
  if (!doc) {
    const err = new Error("প্রোগ্রাম পাওয়া যায়নি।");
    err.status = 404;
    throw err;
  }
  return { id };
}

module.exports = { listPrograms, createProgram, updateProgram, deleteProgram };