const mongoose = require("mongoose");

const listItemSchema = new mongoose.Schema(
  {
    collection: { type: String, required: true },
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


listItemSchema.index({ collection: 1, order: 1, createdAt: 1 });

module.exports = mongoose.model("ListItem", listItemSchema);
