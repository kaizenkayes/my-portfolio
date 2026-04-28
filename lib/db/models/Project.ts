import mongoose, { Document, Schema } from "mongoose";

export interface IProjectDocument extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  techStack: { name: string; color?: string }[];
  liveUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    longDescription: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    techStack: [
      {
        name: { type: String, required: true },
        color: { type: String },
      },
    ],
    liveUrl: { type: String },
    demoUrl: { type: String },
    githubUrl: { type: String },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      default: "completed",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ProjectSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

const Project =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;
