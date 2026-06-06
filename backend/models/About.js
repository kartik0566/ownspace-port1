import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    phone: String,
    location: String,
    profileImage: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model('About', aboutSchema);
