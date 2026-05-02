import mongoose, { Document, Schema } from "mongoose";

// ==========================================
// 1. লার্নিং লগ ডকুমেন্টের ইন্টারফেস (TypeScript)
// =========================================ে
// ILearningLogDocument ইন্টারফেসটি লার্নিং লগ ডকুমেন্টের সম্পূর্ণ কাঠামো নির্ধারণ করে
export interface ILearningLogDocument extends Document {
  title: string;        // লগের শিরোনাম (যেমন: "React Hooks শিখলাম")
  content: string;      // লগের মূল কন্টেন্ট (বিস্তারিত বর্ণনা)
  tags: string[];       // ট্যাগের অ্যারে (যেমন: ["react", "hooks", "learning"])
  type: "daily" | "weekly" | "resource" | "milestone";  // লগের ধরন
  date: Date;           // লগের সাথে সম্পর্কিত তারিখ (যেদিন শিখেছে বা ঘটনা ঘটেছে)
  createdAt: Date;      // ডাটাবেসে কখন তৈরি হয়েছে (অটো)
  updatedAt: Date;      // ডাটাবেসে কখন আপডেট হয়েছে (অটো)
}

// ==========================================
// 2. মঙ্গু্ওজ স্কিমা ডিফাইন করা
// =========================================ে
const LearningLogSchema = new Schema<ILearningLogDocument>(
  {
    // -----------------------------
    // title: লার্নিং লগের শিরোনাম
    // -----------------------------
    title: {
      type: String,
      required: [true, "Title is required"],     // বাধ্যতামূলক (প্রতিটি লগের একটি শিরোনাম থাকা উচিত)
      trim: true,                                // আগে-পিছের স্পেস কাটবে
      maxlength: [150, "Title cannot exceed 150 characters"],  // শিরোনাম খুব বড় হলে UI ঠিক থাকে না
    },
    
    // -----------------------------
    // content: লগের মূল বিষয়বস্তু
    // -----------------------------
    content: {
      type: String,
      required: [true, "Content is required"],   // বাধ্যতামূলক (কী শিখেছে তা বিস্তারিত লিখতে হবে)
      // কোন maxlength নেই কারণ লার্নিং জার্নাল অনেক বড় হতে পারে
      // এতে মার্কডাউন, কোড ব্লক, ইমেজ ইত্যাদি থাকতে পারে
    },
    
    // -----------------------------
    // tags: ট্যাগের তালিকা (শ্রেণীবিভাগের জন্য)
    // -----------------------------
    tags: {
      type: [String],    // স্ট্রিংয়ের অ্যারে
      default: [],       // ডিফল্ট খালি অ্যারে
      // উদাহরণ: ["javascript", "nextjs", "mongodb", "interview-prep"]
      // ট্যাগ দিয়ে সহজেই ক্যাটাগরিরাইজ এবং সার্চ করা যায়
    },
    
    // -----------------------------
    // type: লগের ধরন
    // -----------------------------
    type: {
      type: String,
      enum: ["daily", "weekly", "resource", "milestone"],
      // daily: প্রতিদিনের শেখার আপডেট
      // weekly: সাপ্তাহিক সারাংশ
      // resource: শেখার রিসোর্স সংরক্ষণ (বুকমার্কের মতো)
      // milestone: বড় অর্জন (যেমন: "প্রথম প্রোজেক্ট কমপ্লিট করলাম")
      default: "daily",   // ডিফল্ট টাইপ daily
    },
    
    // -----------------------------
    // date: লগের সাথে সম্পর্কিত তারিখ
    // -----------------------------
    date: {
      type: Date,
      default: Date.now,   // যদি না দেয়া হয় তাহলে বর্তমান তারিখ সেট হবে
      // এটি important কারণ কখন শিখেছে সেটা ট্র্যাক করতে চায়
      // উদাহরণ: "2024-01-15" এ রিয়্যাক্ট শিখা শুরু করেছিল
    },
  },
  { 
    timestamps: true      // createdAt এবং updatedAt অটোমেটিক্যালি যোগ করবে
  }
);

// ==========================================
// 3. অপশনাল: ভিন্ন ভিন্ন টাইপের জন্য ইন্ডেক্স
// =========================================ে
// কম্পাউন্ড ইন্ডেক্স - দ্রুত কুয়েরির জন্য
// LearningLogSchema.index({ type: 1, date: -1 });  // টাইপ অনুযায়ী সাজানো
// LearningLogSchema.index({ tags: 1 });             // ট্যাগ সার্চ দ্রুত করার জন্য

// ==========================================
// 4. মডেল তৈরি করা (এক্সপোর্ট)
// =========================================ে
const LearningLog =
  mongoose.models.LearningLog ||
  mongoose.model<ILearningLogDocument>("LearningLog", LearningLogSchema);

export default LearningLog;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================
/*
🔹 **এই LearningLog মডেলটি কী করে?**
এটি একটি লার্নিং জার্নাল সিস্টেম যেখানে ইউজাররা তাদের শেখার যাত্রা ট্র্যাক করতে পারে। ডেভেলপার, স্টুডেন্ট বা যেকোনো ব্যক্তি যিনি নতুন কিছু শিখছেন তাদের জন্য উপযোগী।

🔹 **চার ধরনের লগ কেন আলাদা করা হয়েছে?**
```javascript
// 1. "daily": প্রতিদিনের শেখার ছোট ছোট আপডেট
{
  title: "আজ JavaScript Closure শিখলাম",
  type: "daily",
  date: new Date("2024-01-15")
}

// 2. "weekly": সপ্তাহের সারাংশ এবং প্রগ্রেস
{
  title: "সপ্তাহ ৩: MongoDB মাস্টারি",
  type: "weekly",
  content: "এই সপ্তাহে aggregation pipeline শিখেছি...",
  date: new Date("2024-01-20")
}

// 3. "resource": মূল্যবান রিসোর্স সংরক্ষণ
{
  title: "GitHub Actions Tutorial",
  type: "resource",
  content: "https://docs.github.com/en/actions",
  tags: ["devops", "ci-cd", "resource"]
}

// 4. "milestone": বড় অর্জন উদযাপন
{
  title: "🔥 ফুলস্ট্যাক ডেভেলপার হিসেবে ফার্স্ট জব পেয়েছি!",
  type: "milestone",
  content: "৩ মাসের কঠোর পরিশ্রমের ফল...",
  date: new Date("2024-02-01")
}


কেন date ফিল্ড আলাদা? (timestamps থেকে ভিন্ন)

javascript
// timestamps: createdAt, updatedAt (ডাটাবেস অপারেশনের সময়)
// date: ইউজার ম্যানুয়ালি দেয় (শেখার ঘটনা যেদিন ঘটেছিল)

// বাস্তব উদাহরণ:
{
  title: "গতকাল যা শিখলাম",
  date: new Date("2024-01-14"),  // যেদিন শিখেছিল
  createdAt: new Date("2024-01-15") // যেদিন লগ লিখেছিল (একদিন পরে)
}
🔹 কোথায় ব্যবহার করবে?

javascript
// 1. ডেভেলপমেন্ট জার্নাল (দেখো কতটুকু এগিয়েছো)
const dailyLogs = await LearningLog.find({ 
  type: "daily",
  date: { $gte: startDate, $lte: endDate }
}).sort({ date: -1 });

// 2. পোর্টফোলিও সেকশন (বড় অর্জন গুলো দেখাও)
const milestones = await LearningLog.find({ 
  type: "milestone" 
}).sort({ date: -1 }).limit(5);

// 3. রিসোর্স লাইব্রেরি (শেখার লিংক সংরক্ষণ)
const reactResources = await LearningLog.find({ 
  type: "resource",
  tags: { $in: ["react", "tutorial"] }
});

// 4. সাপ্তাহিক প্রোগ্রেস রিপোর্ট
const lastWeek = new Date(Date.now() - 7*24*60*60*1000);
const weeklySummary = await LearningLog.find({ 
  type: "weekly",
  date: { $gte: lastWeek }
});
🔹 ট্যাগের ব্যবহার (শক্তিশালী ফিচার):

javascript
// ট্যাগ দিয়ে ইন্টেলিজেন্ট ক্যাটাগরিরাইজেশন
tags: ["react", "hooks", "useEffect", "deep-dive"]

// ট্রেন্ডিং ট্যাগ গণনা
const popularTags = await LearningLog.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// নির্দিষ্ট ট্যাগের সব লগ
const allReactLogs = await LearningLog.find({ 
  tags: "react" 
}).sort("-date");
🔹 প্র্যাকটিক্যাল ব্যবহারের উদাহরণ:

javascript
// 1. নতুন লগ তৈরি করা
const todayLog = new LearningLog({
  title: "Prisma ORM শেখা শুরু করলাম",
  content: `
    আজকে Prisma এর বেসিক শিখেছি:
    - Schema তৈরি করা
    - Migrations
    - CRUD অপারেশন
  `,
  tags: ["prisma", "database", "orm"],
  type: "daily",
  date: new Date()
});
await todayLog.save();

// 2. সাপ্তাহিক সারাংশ তৈরি করা
const lastWeekLogs = await LearningLog.find({
  createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd },
  type: { $ne: "weekly" } // সাপ্তাহিক সারাংশ বাদ দাও
});

const weeklyReport = new LearningLog({
  title: `শেখার প্রগ্রেস - সপ্তাহ ${weekNumber}`,
  content: generateWeeklySummary(lastWeekLogs),
  tags: ["weekly-summary", "progress"],
  type: "weekly",
  date: new Date()
});
await weeklyReport.save();

// 3. মাইলস্টোন চেক করা (মোটিভেশনের জন্য)
const totalMilestones = await LearningLog.countDocuments({ 
  type: "milestone" 
});

const recentMilestones = await LearningLog.find({ 
  type: "milestone",
  date: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
}).sort("-date");

// 4. ক্যালেন্ডার ভিউ তৈরি (প্রতিদিনের অ্যাক্টিভিটি)
const calendarData = await LearningLog.aggregate([
  {
    $match: {
      type: "daily",
      date: { $gte: startOfYear, $lte: endOfYear }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      count: { $sum: 1 }
    }
  }
]);

// 5. পার্সোনালাইজড ড্যাশবোর্ড API
app.get('/api/learning/dashboard', async (req, res) => {
  const stats = await Promise.all([
    LearningLog.countDocuments({ type: "daily", date: { $gte: today } }),
    LearningLog.countDocuments({ type: "milestone" }),
    LearningLog.aggregate([{ $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
    LearningLog.find({ type: "resource", createdAt: { $gte: lastWeek } }).sort("-createdAt").limit(10)
  ]);
  
  res.json({
    todayLogs: stats[0],
    totalMilestones: stats[1],
    topTags: stats[2],
    recentResources: stats[3]
  });
});
🔹 ভালো প্র্যাকটিস এবং টিপস:

javascript
// 1. ভিন্ন টাইপের জন্য ভিন্ন ভ্যালিডেশন
LearningLogSchema.pre("validate", function(next) {
  if (this.type === "resource" && !this.content.match(/^https?:\/\//)) {
    next(new Error("Resource type log must contain a valid URL"));
  }
  next();
});

// 2. অটো ট্যাগিং (কন্টেন্ট থেকে কি-ওয়ার্ড এক্সট্রাক্ট)
LearningLogSchema.pre("save", function(next) {
  if (this.isModified("content") && this.tags.length === 0) {
    // NLP বা কীওয়ার্ড এক্সট্রাকশন লজিক
    const keywords = extractKeywords(this.content);
    this.tags = keywords.slice(0, 5);
  }
  next();
});

// 3. মাইলস্টোনে ইমোজি যোগ করা
LearningLogSchema.pre("save", function(next) {
  if (this.type === "milestone" && !this.title.match(/^[\u{1F300}-\u{1F9FF}]/u)) {
    this.title = "🏆 " + this.title;
  }
  next();
});
🔹 ফ্রন্টএন্ড ইন্টিগ্রেশন:

jsx
// টাইমলাইন ভিউ কম্পোনেন্ট
const LearningTimeline = ({ logs }) => (
  <div className="timeline">
    {logs.map(log => (
      <div key={log._id} className={`timeline-item type-${log.type}`}>
        <div className="date">{formatDate(log.date)}</div>
        <div className="content">
          <h3>{log.title}</h3>
          <div className="tags">
            {log.tags.map(tag => <span key={tag}>#{tag}</span>)}
          </div>
          <p>{log.content}</p>
          {log.type === "resource" && (
            <a href={log.content} target="_blank">View Resource →</a>
          )}
        </div>
      </div>
    ))}
  </div>
);
🔹 এই মডেলের বিশেষ সুবিধা:

শেখার যাত্রা ট্র্যাকিং - কতটুকু শিখেছো সেটা দেখা যায়

মাইলস্টোন উদযাপন - বড় অর্জন গুলো রেকর্ড করা যায়

রিসোর্স সংরক্ষণ - টিউটোরিয়াল, আর্টিকেল সংরক্ষণ

প্রগ্রেস ভিজুয়ালাইজেশন - চার্ট এবং গ্রাফ তৈরি করা যায়

মোটিভেশন বুস্ট - কতটুকু এগিয়েছো দেখে অনুপ্রাণিত হওয়া যায়
*/

text
