/** @format */

let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;
let commentSchema = new Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(`Comment`, commentSchema);
