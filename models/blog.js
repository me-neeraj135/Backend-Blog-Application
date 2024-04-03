/** @format */

let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;

let slug = require(`slugger`);

let blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },

    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: String, required: true },
    slug: { type: String },
  },
  { timestamps: true }
);

// slugs

blogSchema.pre(`save`, function (next) {
  let random = Math.floor(Math.random() * 10);
  let slr = this.title.split(` `).join(`-`).trim().concat(random);
  this.slug = slr;
  return next();
});

module.exports = mongoose.model(`Blog`, blogSchema);
