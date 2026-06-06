import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    technologies: [String],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model('Experience', experienceSchema);
