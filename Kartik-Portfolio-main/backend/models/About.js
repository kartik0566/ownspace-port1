import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
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

export default mongoose.model('About', aboutSchema);
