const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    text: { type: String, default: "" },
    icon: { type: String, default: "FaHandsHelping" },
    order: { type: Number, default: 0 },
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


programSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model("Program", programSchema);
