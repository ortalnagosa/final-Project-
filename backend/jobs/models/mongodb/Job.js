const { link } = require("joi");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
  
    title: { type: String, required: true, minlength: 2, maxlength: 256 },
    subtitle: { type: String, maxlength: 256, default: "" },
    company: { type: String, required: true, minlength: 2, maxlength: 256 },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 1024,
    },
    phone: { type: String },
    email: { type: String },

    web: { type: String, required: true },

    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },

    address: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true },
      zip: { type: Number, required: false },
    },
    likes: [String],
    salary: { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicants: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        image: { url: String, alt: String }, // אופציונלי
        name: { first: String, last: String }, // אופציונלי
        email: String, // אופציונלי
        phone: String, // אופציונלי
        submittedAt: { type: Date, default: Date.now },
        resume: String,
        status: {
          type: String,
          enum: ["pending", "contacted"],
          default: "pending",
        },
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


const Job = mongoose.model("Job", jobSchema);
module.exports = Job;