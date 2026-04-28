import mongoose, { Document, Schema } from "mongoose";

export interface ILearningLogDocument extends Document {
  title: string;
  content: string;
  tags: string[];
  type: "daily" | "weekly" | "resource" | "milestone";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LearningLogSchema = new Schema<ILearningLogDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["daily", "weekly", "resource", "milestone"],
      default: "daily",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LearningLog =
  mongoose.models.LearningLog ||
  mongoose.model<ILearningLogDocument>("LearningLog", LearningLogSchema);

export default LearningLog;
