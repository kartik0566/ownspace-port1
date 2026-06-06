import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    links: {
      github: {
        type: String,
        default: "",
      },
      live: {
        type: String,
        default: "",
      },
      npm: {
        type: String,
        default: "",
      },
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);