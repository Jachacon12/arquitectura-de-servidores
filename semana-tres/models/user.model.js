const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: String,
    active: Boolean,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', usersSchema);
