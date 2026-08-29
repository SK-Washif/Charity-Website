const mongoose = require("mongoose");

const listItemSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    strict: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("ListItem", listItemSchema);