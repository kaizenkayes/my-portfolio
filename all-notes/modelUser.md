import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";

// ==========================================
// 1. ইউজার ডকুমেন্টের ইন্টারফেস (TypeScript)
// =========================================ে
// IUserDocument ইন্টারফেসটি MongoDB ডকুমেন্টের আকৃতি নির্ধারণ করে
// এটি mongoose এর Document থেকে extend করে, তাই MongoDB এর সব built-in methods (save, findOne ইত্যাদি) পাওয়া যায়
export interface IUserDocument extends Document {
  name: string;              // ইউজারের নাম
  email: string;             // ইউজারের ইমেইল (unique হবে)
  password: string;          // হ্যাশড পাসওয়ার্ড (সাধারণত select করা যায় না)
  role: UserRole;            // ইউজারের রোল ("admin" অথবা "user")
  image?: string;            // প্রোফাইল ছবির URL (optional)
  createdAt: Date;           // অটোমেটিক্যালি তৈরি হবে (timestamps থেকে)
  updatedAt: Date;           // অটোমেটিক্যালি আপডেট হবে (timestamps থেকে)
  comparePassword(candidate: string): Promise<boolean>; // পাসওয়ার্ড কোম্পেয়ারের জন্য মেথড
}

// ==========================================
// 2. মঙ্গু্ওজ স্কিমা ডিফাইন করা
// =========================================ে
// Schema হলো ডাটাবেসের কাঠামো যা নির্ধারণ করে কোন ফিল্ড কি টাইপের হবে
const UserSchema = new Schema<IUserDocument>(
  {
    // -----------------------------
    // name ফিল্ড: ইউজারের নাম
    // -----------------------------
    name: {
      type: String,                     // স্ট্রিং টাইপ
      required: [true, "Name is required"], // বাধ্যতামূলক, না দিলে এই error message দেখাবে
      trim: true,                      // আগে-পিছের স্পেস কেটে ফেলবে
      maxlength: [60, "Name cannot exceed 60 characters"], // সর্বোচ্চ 60 ক্যারেক্টার
    },
    
    // -----------------------------
    // email ফিল্ড: ইউজারের ইমেইল
    // -----------------------------
    email: {
      type: String,
      required: [true, "Email is required"],   // বাধ্যতামূলক
      unique: true,                            // একই ইমেইল একবারই ব্যবহার করা যাবে
      lowercase: true,                         // সব অক্ষর ছোট হাতের করে নিবে (user@example.com -> user@example.com)
      trim: true,                             // স্পেস কেটে ফেলবে
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"], // রেগুলার এক্সপ্রেশন দিয়ে ইমেইল ভ্যালিডেশন
    },
    
    // -----------------------------
    // password ফিল্ড: ইউজারের পাসওয়ার্ড
    // -----------------------------
    password: {
      type: String,
      required: [true, "Password is required"],   // বাধ্যতামূলক
      minlength: [8, "Password must be at least 8 characters"], // কমপক্ষে ৮ ক্যারেক্টার
      select: false,  // যখন ডাটাবেস থেকে ইউজার খুঁজবি, তখন পাসওয়ার্ড ডিফল্টভাবে আনবি না (সুরক্ষার জন্য)
    },
    
    // -----------------------------
    // role ফিল্ড: ইউজারের টাইপ
    // -----------------------------
    role: {
      type: String,
      enum: ["admin", "user"],   // শুধুমাত্র এই দুইটি ভ্যালু নিতে পারবে
      default: "user",           // যদি role না দেয়া হয় তাহলে "user" সেট হয়ে যাবে
    },
    
    // -----------------------------
    // image ফিল্ড: প্রোফাইল ছবির URL
    // -----------------------------
    image: {
      type: String,    // স্ট্রিং টাইপ, অপশনাল (required নেই)
    },
  },
  {
    timestamps: true,  // createdAt এবং updatedAt অটোমেটিক্যালি যোগ করে দিবে
  }
);

// ==========================================
// 3. মিডলওয়্যার: পাসওয়ার্ড হ্যাশ করা (save করার আগে)
// =========================================ে
// pre("save") মিডলওয়্যারটি ইউজার ডাটাবেসে save করার আগে চলবে
// এটি পাসওয়ার্ডকে হ্যাশ করে এবং আসল পাসওয়ার্ডকে ওভাররাইট করে দেয়
UserSchema.pre("save", async function (next) {
  // check করা হচ্ছে: পাসওয়ার্ড ফিল্ড কি পরিবর্তন হয়েছে?
  // যদি পরিবর্তন না হয়ে থাকে (যেমন নাম আপডেট করছি) তাহলে হ্যাশ না করে next() কল করবি
  if (!this.isModified("password")) return next();
  
  // পাসওয়ার্ড হ্যাশ করা: bcrypt.hash(পাসওয়ার্ড, সল্ট_রাউন্ড)
  // 12 সল্ট রাউন্ড মানে 2^12 বার হ্যাশিং অপারেশন হবে (সুরক্ষার জন্য)
  this.password = await bcrypt.hash(this.password, 12);
  
  next(); // পরবর্তী মিডলওয়্যার বা সেভ অপারেশনে যাও
});

// ==========================================
// 4. কাস্টম মেথড: পাসওয়ার্ড কোম্পেয়ার
// =========================================ে
// ইউজার লগইনের সময় কাঁচা পাসওয়ার্ড এবং ডাটাবেসের হ্যাশড পাসওয়ার্ড তুলনা করার জন্য
UserSchema.methods.comparePassword = async function (
  candidate: string  // ইউজার যেই পাসওয়ার্ড ইনপুট দিয়েছে
): Promise<boolean> {
  // bcrypt.compare() নিজেই হ্যাশিং এবং তুলনা করে
  // true মানে পাসওয়ার্ড মিলেছে, false মানে মেলেনি
  return bcrypt.compare(candidate, this.password);
};

// ==========================================
// 5. মডেল তৈরি করা (এক্সপোর্ট করার জন্য)
// =========================================ে
// mongoose.models.User: যদি আগেই মডেল তৈরি থাকে (Next.js hot reloading এ)
// তাহলে সেটাই use করবি, নাহলে নতুন মডেল তৈরি করবি
// এটি "OverwriteModelError" প্রতিরোধ করে
const User =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================
/*
🔹 **এই User মডেলটি কী করে?**
এটি MongoDB তে ইউজার সংরক্ষণ, পরিচালনা এবং authenticate করার জন্য একটি সম্পূর্ণ schema.

🔹 **কেন আলাদা করে পাসওয়ার্ড হ্যাশ করতে হবে?**
- পাসওয়ার্ড কখনো plain text এ ডাটাবেসে রাখা উচিত না (security risk)
- bcrypt একমুখী হ্যাশিং অ্যালগরিদম ব্যবহার করে
- pre("save") middleware স্বয়ংক্রিয়ভাবে save করার আগে হ্যাশ করে ফেলে

🔹 **select: false কেন পাসওয়ার্ডে?**
```javascript
// যখন ইউজার find করবি:
const user = await User.findById(id); // পাসওয়ার্ড আসবে না

// পাসওয়ার্ড আনতে চাইলে স্পেসিফিক বলতে হবে:
const user = await User.findById(id).select('+password');


এটা ডিফল্টভাবে পাসওয়ার্ড লিক হওয়া থেকে রক্ষা করে

🔹 comparePassword() মেথড কেন দরকার?
লগইন প্রক্রিয়ায়:

javascript
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.comparePassword(plainPassword);
if(isMatch) {
  // পাসওয়ার্ড সঠিক → লগইন সফল
}
🔹 enum role কেন?
রোল শুধুমাত্র "admin" অথবা "user" হতে পারে - অন্য কিছু দিলে error দিবে
এটি ভুল ডাটা এন্ট্রি প্রতিরোধ করে

🔹 mongoose.models.User কেন চেক করি?
Next.js এর development mode এ hot reloading হলে mongoose.model()
একাধিকবার কল হতে পারে যা "OverwriteModelError" দেয়।
এই চেকটি সেই error প্রতিরোধ করে।

🔹 ব্যবহারের উদাহরণ:

javascript
// নতুন ইউজার তৈরি
const user = new User({
  name: "John Doe",
  email: "john@example.com", 
  password: "secret12345"  // এটি auto-hash হবে
});
await user.save();

// লগইন ভেরিফিকেশন
const existingUser = await User.findOne({ email }).select('+password');
const valid = await existingUser.comparePassword("secret12345");
*/

text
