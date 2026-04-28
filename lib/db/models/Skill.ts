import mongoose, { Document, Schema } from "mongoose";

export interface ISkillDocument extends Document {
  name: string;
  icon?: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools" | "other";
  proficiency: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [50, "Skill name cannot exceed 50 characters"],
    },
    icon: { type: String },
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools", "other"],
      required: [true, "Category is required"],
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency is required"],
      min: [1, "Minimum proficiency is 1"],
      max: [100, "Maximum proficiency is 100"],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Skill =
  mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", SkillSchema);

export default Skill;
