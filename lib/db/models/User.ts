/**
 * User Model — MongoDB-তে user store
 * registerUser() → User.create() → pre-save hook password hash → login-এ comparePassword()
 */
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name cannot exceed 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // default query-তে password আসে না — login-এ "+password" দিয়ে নিতে হয়
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// register-এ User.create() হলে password plain text → bcrypt hash (12 rounds)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// login-এ auth.ts authorize() এই method দিয়ে plain vs hashed password match করে
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
