import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Languages', 'Tools'],
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: false,
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
