import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    gpa: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Education', educationSchema);
