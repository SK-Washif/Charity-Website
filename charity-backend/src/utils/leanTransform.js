/**
 * Converts a plain object returned by a Mongoose `.lean()` query into the
 * same shape the schema-level `toJSON.transform` used to produce on a
 * hydrated Document (`{ id, ...fields }`, no `_id`/`__v`).
 *
 * `.lean()` skips Mongoose Document hydration (getters, virtuals, change
 * tracking) entirely, which is a meaningful speed-up on read-heavy list
 * endpoints — but it also means `.toJSON()` never runs, so callers need to
 * apply the same field mapping by hand. Using one shared helper keeps every
 * module's API response shape identical to before.
 */
function toClientDoc(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

module.exports = { toClientDoc };
