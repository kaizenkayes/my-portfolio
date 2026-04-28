import mongoose, { Document, Schema } from "mongoose";

// ==========================================
// 1. নোট ডকুমেন্টের ইন্টারফেস (TypeScript)
// =========================================ে
// INoteDocument ইন্টারফেসটি নোট ডকুমেন্টের সম্পূর্ণ কাঠামো নির্ধারণ করে
export interface INoteDocument extends Document {
  title: string;        // নোটের শিরোনাম
  content: string;      // নোটের মূল কন্টেন্ট (টেক্সট বা মার্কডাউন)
  tags: string[];       // ট্যাগের অ্যারে (যেমন: ["react", "tutorial", "important"])
  isPinned: boolean;    // পিন করা নোট কিনা (সবসময় উপরে দেখাবে)
  color?: string;       // নোটের ব্যাকগ্রাউন্ড রঙ (হেক্স কোড)
  createdAt: Date;      // কখন তৈরি হয়েছে (অটো)
  updatedAt: Date;      // কখন আপডেট হয়েছে (অটো)
}

// ==========================================
// 2. মঙ্গু্ওজ স্কিমা ডিফাইন করা
// =========================================ে
const NoteSchema = new Schema<INoteDocument>(
  {
    // -----------------------------
    // title: নোটের শিরোনাম
    // -----------------------------
    title: {
      type: String,
      required: [true, "Title is required"],     // বাধ্যতামূলক (টাইটেল ছাড়া নোট ঠিক না)
      trim: true,                                // আগে-পিছের স্পেস কাটবে
      maxlength: [150, "Title cannot exceed 150 characters"],  // SEO এবং UI এর জন্য ১৫০ অক্ষর যথেষ্ট
    },
    
    // -----------------------------
    // content: নোটের মূল বিষয়বস্তু
    // -----------------------------
    content: {
      type: String,
      required: [true, "Content is required"],   // বাধ্যতামূলক
      // কোন maxlength নেই কারণ নোট অনেক বড় হতে পারে
      // Markdown support এর জন্য String টাইপ ই যথেষ্ট
    },
    
    // -----------------------------
    // tags: ট্যাগের তালিকা
    // -----------------------------
    tags: {
      type: [String],    // স্ট্রিংয়ের অ্যারে
      default: [],       // ডিফল্ট খালি অ্যারে
      // উদাহরণ: ["javascript", "work", "idea", "todo"]
    },
    
    // -----------------------------
    // isPinned: পিন করা নোট
    // -----------------------------
    isPinned: {
      type: Boolean,
      default: false,    // ডিফল্ট false, ইউজার manually true করবে গুরুত্বপূর্ণ নোটের জন্য
    },
    
    // -----------------------------
    // color: নোটের রঙ
    // -----------------------------
    color: {
      type: String,
      default: "#1a1a2e",  // ডিফল্ট গাঢ় রঙ (dark theme friendly)
      // অন্যান্য প্রিফাইন কালার: "#2d2d2d", "#1e1e2e", "#2a2a3e" ইত্যাদি
      // ইউজার ইচ্ছেমত হেক্স কালার সিলেক্ট করতে পারে
    },
  },
  { 
    timestamps: true      // createdAt এবং updatedAt অটোমেটিক্যালি যোগ করবে
  }
);

// ==========================================
// 3. মডেল তৈরি করা (এক্সপোর্ট)
// =========================================ে
// Next.js এর hot reloading এ একাধিক মডেল তৈরি হওয়া প্রতিরোধ করে
const Note =
  mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================
/*
🔹 **এই Note মডেলটি কী করে?**
এটি একটি নোট অ্যাপ্লিকেশনের জন্য ডাটাবেস মডেল। ইউজাররা নোট তৈরি, এডিট, ডিলিট, ট্যাগ যোগ, পিন ইত্যাদি করতে পারে।

🔹 **কেন আলাদা Note মডেল দরকার?**
- ইউজারের সাথে রিলেশন থাকতে পারে (যেমন: প্রতিটি ইউজারের নিজস্ব নোট)
- এক জায়গায় সব নোট ম্যানেজ করা যায়
- সার্চ, ফিল্টার, সর্ট করা সহজ হয়

🔹 **tags অ্যারে কেন?**
```javascript
// এক নোটে একাধিক ট্যাগ থাকতে পারে
tags: ["work", "urgent", "frontend"]

// ট্যাগ দিয়ে সহজেই নোট ফিল্টার করা যায়
const workNotes = await Note.find({ tags: "work" });

// ট্যাগ ক্লাউড তৈরি করা যায়
const allTags = await Note.distinct("tags");


isPinned কিভাবে কাজ করে?

javascript
// পিন করা নোট সবসময় উপরে থাকবে
// ফ্রন্টএন্ডে সর্টিং:
const notes = await Note.find().sort({ isPinned: -1, createdAt: -1 });
// isPinned true যেগুলো প্রথমে আসবে, তারপর createdAt অনুযায়ী

// পিন টগল করা:
note.isPinned = !note.isPinned;
await note.save();
🔹 color ফিল্ড কেন দরকার?

javascript
// ইউজার প্রতিটি নোটের ব্যাকগ্রাউন্ড কাস্টমাইজ করতে পারে
color: "#ff6b6b"  // লাল (জরুরি নোট)
color: "#4ecdc4"  // নীল (আইডিয়া নোট)
color: "#ffe66d"  // হলুদ (রিমাইন্ডার)

// ফ্রন্টএন্ডে ব্যাকগ্রাউন্ড সেট করা:
<div style={{ backgroundColor: note.color }}>
  {note.title}
</div>
🔹 সব ফিল্ড ম্যান্ডেটরি নয় কেন?

tags: ডিফল্ট [], নোটের ট্যাগ না থাকলেও সমস্যা নেই

isPinned: ডিফল্ট false, সব নোট পিন করা লাগবে না

color: ডিফল্ট "#1a1a2e", ইউজার না দিলে ডিফল্ট কালার ব্যবহার হবে

🔹 timestamps কেন কাজে লাগে?

javascript
// createdAt: কখন নোট তৈরি করেছিল
// updatedAt: কখন শেষ আপডেট করেছিল

// সবচেয়ে রিসেন্ট নোট গুলো দেখাতে:
const recent = await Note.find().sort('-createdAt').limit(10);

// গতকাল আপডেট করা নোট গুলো:
const yesterdayUpdated = await Note.find({
  updatedAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
});
🔹 অপটিমাইজেশন টিপস:

javascript
// ১. ট্যাগে ইনডেক্স (দ্রুত সার্চের জন্য)
NoteSchema.index({ tags: 1 });

// ২. পিন + ক্রিয়েটেড এট কম্পাউন্ড ইনডেক্স
NoteSchema.index({ isPinned: -1, createdAt: -1 });

// ৩. টাইটেল টেক্সট সার্চ (যদি দরকার হয়)
NoteSchema.index({ title: "text", content: "text" });

// ৪. ইউজার রিলেশন থাকলে (ভবিষ্যতে যোগ করতে):
// userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
🔹 ব্যবহারের উদাহরণ:

javascript
// 1. নতুন নোট তৈরি
const note = new Note({
  title: "MongoDB Aggregation Pipeline",
  content: "Stage 1: $match, Stage 2: $group...",
  tags: ["mongodb", "database", "tutorial"],
  isPinned: true,
  color: "#2d2d5e"
});
await note.save();

// 2. সব পিন করা নোট (রিসেন্ট প্রথমে)
const pinnedNotes = await Note.find({ isPinned: true })
  .sort('-createdAt')
  .limit(20);

// 3. ট্যাগ দিয়ে নোট খোঁজা
const reactNotes = await Note.find({ 
  tags: { $in: ["react", "frontend"] } 
});

// 4. নোট আপডেট (পিন টগল)
await Note.findByIdAndUpdate(noteId, {
  $set: { isPinned: true },
  $addToSet: { tags: "important" }  // unique ট্যাগ যোগ করবে
});

// 5. পুরনো নোট ডিলিট (৩০ দিনের বেশি)
const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
await Note.deleteMany({ 
  createdAt: { $lt: thirtyDaysAgo },
  isPinned: false 
});

// 6. সার্চ ফাংশনালিটি
const searchQuery = "react tutorial";
const searchResults = await Note.find({
  $or: [
    { title: { $regex: searchQuery, $options: "i" } },
    { content: { $regex: searchQuery, $options: "i" } },
    { tags: { $in: [searchQuery] } }
  ]
});
🔹 ফ্রন্টএন্ড ইন্টিগ্রেশন উদাহরণ:

jsx
// নোট কার্ড কম্পোনেন্ট
const NoteCard = ({ note }) => (
  <div style={{ 
    backgroundColor: note.color,
    borderLeft: note.isPinned ? '4px solid gold' : 'none'
  }}>
    <h3>{note.title}</h3>
    <div className="tags">
      {note.tags.map(tag => <span key={tag}>#{tag}</span>)}
    </div>
    <p>{note.content.substring(0, 150)}...</p>
    <small>Updated: {new Date(note.updatedAt).toLocaleDateString()}</small>
  </div>
);
🔹 ভালো প্র্যাকটিস:

কনটেন্ট অনেক বড় হতে পারে, ফ্রন্টএন্ডে truncate করে দেখান

ট্যাগের জন্য অটোসাজেশন দিলে ইউজার এক্সপেরিয়েন্স ভালো হয়

কালার প্রিসেট অফার করুন (সীমিত কয়েকটি রঙ)

পিন করা নোট কখনো ডিলিট না করার অপশন রাখুন

রেগুলার ব্যাকআপ নিন (নোট গুরুত্বপূর্ণ ডাটা)
*/

text
