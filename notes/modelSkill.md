import mongoose, { Document, Schema } from "mongoose";

// ==========================================
// 1. স্কিল ডকুমেন্টের ইন্টারফেস (TypeScript)
// =========================================ে
// ISkillDocument ইন্টারফেসটি MongoDB তে স্কিল ডকুমেন্টের কাঠামো নির্ধারণ করে
export interface ISkillDocument extends Document {
  name: string;           // স্কিলের নাম (যেমন: "React", "Node.js", "MongoDB")
  icon?: string;          // স্কিলের আইকনের URL অথবা ক্লাস নাম (optional)
  category: "frontend" | "backend" | "database" | "devops" | "tools" | "other";  // স্কিলের ক্যাটাগরি
  proficiency: number;    // দক্ষতার মাত্রা (১ থেকে ১০০ পর্যন্ত)
  order: number;          // অর্ডার/পজিশন (কোন ক্রমে দেখাবে)
  createdAt: Date;        // কখন তৈরি হয়েছে (অটো)
  updatedAt: Date;        // কখন আপডেট হয়েছে (অটো)
}

// ==========================================
// 2. মঙ্গু্ওজ স্কিমা ডিফাইন করা
// =========================================ে
// SkillSchema - স্কিল ডাটাবেসের কাঠামো
const SkillSchema = new Schema<ISkillDocument>(
  {
    // -----------------------------
    // name ফিল্ড: স্কিলের নাম
    // -----------------------------
    name: {
      type: String,
      required: [true, "Skill name is required"],  // নাম দেওয়া বাধ্যতামূলক
      trim: true,                                  // স্পেস কেটে ফেলবে (যেমন: " React " -> "React")
      maxlength: [50, "Skill name cannot exceed 50 characters"],  // সর্বোচ্চ ৫০ অক্ষর
    },
    
    // -----------------------------
    // icon ফিল্ড: আইকন (অপশনাল)
    // -----------------------------
    icon: { 
      type: String,
      // optional field - required প্রপার্টি নেই
      // এটা হতে পারে:
      // 1. ফন্টawesome ক্লাস: "fab fa-react"
      // 2. ইমেজ URL: "/icons/react.png"
      // 3. ইমোজি: "⚛️"
    },
    
    // -----------------------------
    // category ফিল্ড: স্কিলের ধরন
    // -----------------------------
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools", "other"],
      // enum নিশ্চিত করে যে শুধু এই ভ্যালুগুলোই আসতে পারে
      // অন্য কিছু দিলে mongoose error দিবে
      required: [true, "Category is required"],  // ক্যাটাগরি দেওয়া বাধ্যতামূলক
    },
    
    // -----------------------------
    // proficiency ফিল্ড: দক্ষতার হার
    // -----------------------------
    proficiency: {
      type: Number,
      required: [true, "Proficiency is required"],  // বাধ্যতামূলক
      min: [1, "Minimum proficiency is 1"],         // সর্বনিম্ন ১
      max: [100, "Maximum proficiency is 100"],     // সর্বোচ্চ ১০০
      // ১ = খুব কম জানা, ১০০ = এক্সপার্ট লেভেল
    },
    
    // -----------------------------
    // order ফিল্ড: সাজানোর ক্রম
    // -----------------------------
    order: { 
      type: Number, 
      default: 0,
      // ছোট সংখ্যা আগে দেখাবে, বড় সংখ্যা পরে দেখাবে
      // manually কাস্টম অর্ডিং করার জন্য ব্যবহার হয়
    },
  },
  { 
    timestamps: true  // createdAt এবং updatedAt অটোমেটিক্যালি যোগ করবে
  }
);

// ==========================================
// 3. মডেল তৈরি করা (এক্সপোর্ট)
// =========================================ে
// আগে থেকে মডেল থাকলে সেটা ব্যবহার করবে, না থাকলে নতুন তৈরি করবে
// Next.js এর hot reloading এ একাধিক মডেল তৈরি হওয়া প্রতিরোধ করে
const Skill =
  mongoose.models.Skill || mongoose.model<ISkillDocument>("Skill", SkillSchema);

export default Skill;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================
/*
🔹 **এই Skill মডেলটি কী করে?**
এটি পোর্টফোলিও বা রিজিউমে দেখানোর জন্য প্রযুক্তিগত স্কিল ডাটাবেসে সংরক্ষণ করে।

🔹 **কেন আলাদা Skill মডেল দরকার?**
- ইউজার থেকে স্কিল আলাদা রাখা ভালো (normalization)
- এক জায়গায় সব স্কিল ম্যানেজ করা সহজ
- অ্যাডমিন প্যানেলে স্কিল CRUD করা যায়

🔹 **category enum কেন?**
```javascript
// ভ্যালিড ক্যাটাগরি:
"frontend"  // React, Vue, Angular
"backend"   // Node.js, Python, Java
"database"  // MongoDB, PostgreSQL
"devops"    // Docker, Kubernetes, AWS
"tools"     // Git, VS Code, Figma
"other"     // যেগুলো উপরোক্ত নয়

// invalid হবে:
category: "mobile"  // ❌ enum এ নেই → error দিবে


 proficiency এর ব্যবহার:

javascript
// ১-১০০ পর্যন্ত সংখ্যা
{
  name: "JavaScript",
  proficiency: 90  // উন্নত লেভেল
}
// ফ্রন্টএন্ডে progress bar বা百分比 দেখানোর জন্য
🔹 order ফিল্ড কেন দরকার?

javascript
// order ছাড়া sort করতে গেলে alphabetical sort হবে
// order দিয়ে কাস্টম অর্ডার করা যায়:

{ name: "React", order: 1 }     // প্রথমে দেখাবে
{ name: "Vue", order: 2 }       // দ্বিতীয়তে দেখাবে
{ name: "Angular", order: 3 }   // তৃতীয়তে দেখাবে

// ব্যাকএন্ডে ব্যবহার:
const skills = await Skill.find().sort('order');
🔹 ট্রিম() কেন ব্যবহার করি?

javascript
// ইউজার ইনপুট:
"  React  " → save করার আগে "React" হয়ে যায়
// এটি consistent ডাটা নিশ্চিত করে
🔹 ব্যবহারের উদাহরণ:

javascript
// নতুন স্কিল তৈরি করা
const reactSkill = new Skill({
  name: "React",
  icon: "fab fa-react",
  category: "frontend",
  proficiency: 85,
  order: 1
});
await reactSkill.save();

// সব ফ্রন্টএন্ড স্কিল পাওয়া (order অনুযায়ী সাজানো)
const frontendSkills = await Skill.find({ 
  category: "frontend" 
}).sort('order');

// হাই প্রফিসিয়েন্সি স্কিল খোঁজা
const expertSkills = await Skill.find({ 
  proficiency: { $gte: 80 } 
});

// আপডেট করা
await Skill.findByIdAndUpdate(skillId, {
  proficiency: 95
});
🔹 পোর্টফোলিওতে ইউজ:

jsx
// ফ্রন্টএন্ডে দেখানোর জন্য
{skills.map(skill => (
  <div key={skill._id}>
    {skill.icon && <i className={skill.icon}></i>}
    <span>{skill.name}</span>
    <progress value={skill.proficiency} max={100} />
  </div>
))}
🔹 ইন্ডেক্স করার পরামর্শ:

javascript
// category এবং order এ প্রায়ই search/sort করা হবে বলে:
SkillSchema.index({ category: 1, order: 1 });
// পারফরম্যান্স বুস্ট করবে
*/

text
