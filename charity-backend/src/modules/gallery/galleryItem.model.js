const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("GalleryItem", galleryItemSchema);