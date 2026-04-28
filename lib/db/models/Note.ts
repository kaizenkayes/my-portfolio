import mongoose, { Document, Schema } from "mongoose";

export interface INoteDocument extends Document {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INoteDocument>(
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
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#1a1a2e",
    },
  },
  { timestamps: true }
);

const Note =
  mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;
