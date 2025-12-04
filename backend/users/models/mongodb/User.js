const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      first: { type: String, required: true, minlength: 2, maxlength: 256 },
      middle: { type: String, minlength: "", maxlength: 256, default: "" },
      last: { type: String, required: true, minlength: 2, maxlength: 256 },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    },

    password: { type: String, required: true, minlength: 6 },

    phone: { type: String, trim: true },
    age: { type: Number, min: 0 },
    image: {
      url: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    resume: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
    pendingEmployerRequest: {
      type: Boolean,
      default: false,
    },
    city: { type: String, minlength: 2, maxlength: 100 },
    birthDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      default: "2000-01-01",
    },
    armyUnit: { type: String },
    releaseDate: {
      type: String,
      match: /^\d{4}-\d{2}-\d{2}$/,
      default: "2000-01-01",
    },
    experience: [
      {
        title: { type: String },
        company: { type: String },
        from: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
        to: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
        description: { type: String },
      },
    ],

    skills: [{ type: String }],
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    about: { type: String, maxlength: 1024 , default: "" },
  },
  {
    timestamps: true, // תאריכי יצירה ועדכון אוטומטיים
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
  