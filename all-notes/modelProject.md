import mongoose, { Document, Schema } from "mongoose";

// ==========================================
// 1. প্রোজেক্ট ডকুমেন্টের ইন্টারফেস (TypeScript)
// =========================================ে
// IProjectDocument ইন্টারফেসটি প্রোজেক্ট ডকুমেন্টের সম্পূর্ণ কাঠামো নির্ধারণ করে
export interface IProjectDocument extends Document {
  title: string;                    // প্রোজেক্টের শিরোনাম
  slug: string;                     // URL ফ্রেন্ডলি সংস্করণ (যেমন: "my-awesome-project")
  description: string;              // সংক্ষিপ্ত বিবরণ (কার্ডে দেখানোর জন্য)
  longDescription?: string;         // বিস্তারিত বিবরণ (পূর্ণ পেজে দেখানোর জন্য)
  thumbnail?: string;               // প্রোজেক্টের থাম্বনেইল ছবি
  techStack: { name: string; color?: string }[];  // ব্যবহৃত টেকনোলজি
  liveUrl?: string;                 // লাইভ প্রোজেক্টের URL
  demoUrl?: string;                 // ডেমো লিংক (যদি আলাদা হয়)
  githubUrl?: string;               // গিটহাব রেপোজিটরির লিংক
  featured: boolean;                // ফিচার্ড প্রোজেক্ট কিনা (হোমপেজে দেখাবে)
  status: "completed" | "in-progress" | "archived";  // প্রোজেক্টের অবস্থা
  order: number;                    // অর্ডার/পজিশন (কি ক্রমে দেখাবে)
  createdAt: Date;                  // কখন তৈরি হয়েছে
  updatedAt: Date;                  // কখন শেষবার আপডেট হয়েছে
}

// ==========================================
// 2. মঙ্গু্ওজ স্কিমা ডিফাইন করা
// =========================================ে
const ProjectSchema = new Schema<IProjectDocument>(
  {
    // -----------------------------
    // title: প্রোজেক্টের নাম
    // -----------------------------
    title: {
      type: String,
      required: [true, "Title is required"],     // বাধ্যতামূলক
      trim: true,                                // আগে-পিছের স্পেস কাটবে
      maxlength: [100, "Title cannot exceed 100 characters"],  // সর্বোচ্চ ১০০ অক্ষর
    },
    
    // -----------------------------
    // slug: URL ফ্রেন্ডলি আইডেন্টিফায়ার
    // -----------------------------
    slug: {
      type: String,
      required: true,        // বাধ্যতামূলক (pre-validate middleware এ তৈরি হয়)
      unique: true,          // ইউনিক হতে হবে (একই slug দুবার থাকবে না)
      lowercase: true,       // সব ছোট হাতের অক্ষরে কনভার্ট করবে
      trim: true,           // স্পেস কাটবে
    },
    
    // -----------------------------
    // description: সংক্ষিপ্ত বিবরণ (কার্ড ভিউতে)
    // -----------------------------
    description: {
      type: String,
      required: [true, "Description is required"],  // বাধ্যতামূলক
      maxlength: [500, "Description cannot exceed 500 characters"],  // SEO ফ্রেন্ডলি রাখার জন্য ৫০০ অক্ষর
    },
    
    // -----------------------------
    // longDescription: বিস্তারিত বিবরণ (অপশনাল)
    // -----------------------------
    longDescription: {
      type: String,
      // পুরো প্রোজেক্ট পেজে বিস্তারিত বর্ণনা, মার্কডাউন সাপোর্ট করা যেতে পারে
    },
    
    // -----------------------------
    // thumbnail: প্রোজেক্টের কভার ইমেজ
    // -----------------------------
    thumbnail: {
      type: String,
      // পাথ অথবা URL: "/projects/react-dashboard.png"
    },
    
    // -----------------------------
    // techStack: ব্যবহৃত টেকনোলজির তালিকা
    // -----------------------------
    techStack: [
      {
        name: { 
          type: String, 
          required: true      // টেকনোলজির নাম বাধ্যতামূলক (যেমন: "React", "Node.js")
        },
        color: { 
          type: String        // টেকনোলজির রঙ (UI তে ব্যাকগ্রাউন্ড বা টেক্সট রঙের জন্য)
          // যেমন: "#61DAFB" (React এর জন্য), "#339933" (Node.js এর জন্য)
        },
      },
    ],
    
    // -----------------------------
    // liveUrl: লাইভ প্রোজেক্টের লিংক
    // -----------------------------
    liveUrl: { 
      type: String,
      // যেমন: "https://myapp.com"
    },
    
    // -----------------------------
    // demoUrl: ডেমো প্রোজেক্টের লিংক
    // -----------------------------
    demoUrl: { 
      type: String,
      // যদি লাইভ আর ডেমো আলাদা হয় (যেমন: স্টেজিং সার্ভার)
    },
    
    // -----------------------------
    // githubUrl: সোর্স কোডের লিংক
    // -----------------------------
    githubUrl: { 
      type: String,
      // যেমন: "https://github.com/username/project"
    },
    
    // -----------------------------
    // featured: ফিচার্ড প্রোজেক্ট কিনা
    // -----------------------------
    featured: {
      type: Boolean,
      default: false,     // ডিফল্ট false, শুধু বেস্ট ওয়ার্ক গুলো true করবি
    },
    
    // -----------------------------
    // status: প্রোজেক্টের বর্তমান অবস্থা
    // -----------------------------
    status: {
      type: String,
      enum: ["completed", "in-progress", "archived"],
      // completed: সম্পন্ন (পুরোপুরি ready)
      // in-progress: চলমান (ডেভেলপমেন্ট চলতেছে)
      // archived: আর্কাইভ (আর দেখানো হবে না, কিন্তু ডাটাবেসে আছে)
      default: "completed",
    },
    
    // -----------------------------
    // order: কাস্টম অর্ডার
    // -----------------------------
    order: {
      type: Number,
      default: 0,     // কম সংখ্যা আগে দেখাবে
    },
  },
  { 
    timestamps: true    // createdAt এবং updatedAt অটো
  }
);

// ==========================================
// 3. মিডলওয়্যার: স্লাগ অটো-জেনারেট করা
// =========================================ে
// pre("validate") - ডকুমেন্ট ভ্যালিডেশনের আগে এই কোড রান করবে
// এটি স্বয়ংক্রিয়ভাবে title থেকে slug তৈরি করে দেয়
ProjectSchema.pre("validate", function (next) {
  // যদি title থাকে এবং slug না থাকে, তাহলে slug তৈরি করো
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()          // সব অক্ষর ছোট হাতের করো
      .replace(/[^a-z0-9]+/g, "-")  // অক্ষর আর সংখ্যা ছাড়া সব কিছুকে "-" দিয়ে replace করো
      .replace(/(^-|-$)/g, "");     // শুরু আর শেষের "-" কেটে ফেলো
  }
  next();
});

// ==========================================
// 4. মডেল তৈরি করা (এক্সপোর্ট)
// =========================================ে
const Project =
  mongoose.models.Project ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);

export default Project;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================
/*
🔹 **এই Project মডেলটি কী করে?**
এটি পোর্টফোলিওর প্রোজেক্ট গুলো ডাটাবেসে সংরক্ষণ এবং পরিচালনা করে।

🔹 **slug কেন দরকার? URL এ ব্যবহারের জন্য:**
```javascript
// title: "My Awesome React Project"
// slug হয়ে যাবে: "my-awesome-react-project"
// URL: /projects/my-awesome-react-project

// pre("validate") middleware এটি auto-generate করে

// কেন slug ইউনিক হতে হবে?
// কারণ একই slug বারবার আসলে URL conflict হবে

 techStack কেন array of objects?

javascript
// প্রতিটি টেকনোলজির নাম এবং রঙ স্টোর করা যায়
techStack: [
  { name: "React", color: "#61DAFB" },
  { name: "Tailwind", color: "#38BDF8" },
  { name: "MongoDB", color: "#47A248" }
]

// UI তে দেখাবে:
{techStack.map(tech => (
  <span style={{ backgroundColor: tech.color }}>
    {tech.name}
  </span>
))}
🔹 তিন ধরনের status কেন?

javascript
// 1. "completed" - সম্পন্ন প্রোজেক্ট, পুরো show করবে
// 2. "in-progress" - ডেভেলপমেন্টে, "Coming Soon" ব্যাজ দেখাবে
// 3. "archived" - পুরনো প্রোজেক্ট, লিস্টে দেখাবে না কিন্তু রেখে দিবে

// ফ্রন্টএন্ডে ফিল্টার:
const activeProjects = await Project.find({ 
  status: { $ne: "archived" } 
});
🔹 description vs longDescription:

javascript
// description: সংক্ষিপ্ত (কার্ডে দেখানোর জন্য)
// maxlength 500 - SEO এবং কার্ড UI এর জন্য perfect

// longDescription: বিস্তারিত (পূর্ণ প্রোজেক্ট পেজে)
// unlimited length - মার্কডাউন, ছবি, ভিডিও এম্বেড করা যায়
🔹 featured ফিল্ডের ব্যবহার:

javascript
// হোমপেজে শুধু ফিচার্ড প্রোজেক্ট দেখাবে
const featuredProjects = await Project.find({ 
  featured: true 
}).sort('order');

// সাবস্ট্রাকচার:
// - বড় কোম্পানি বা চ্যালেঞ্জিং প্রোজেক্ট গুলো featured করা হয়
// - পোর্টফোলিওর হাইলাইট হিসেবে কাজ করে
🔹 তিন ধরনের URL কেন?

javascript
// liveUrl: আসল প্রোডাকশন লিংক (ইউজাররা এটা দেখবে)
// demoUrl: ডেমো ভার্সন (যদি স্টেজিং বা টেস্ট এনভায়রনমেন্ট থাকে)
// githubUrl: সোর্স কোড (ওপেন সোর্স হলে দরকার)

// ফ্রন্টএন্ডে চেক করবি:
{liveUrl && <a href={liveUrl}>Live Demo</a>}
{githubUrl && <a href={githubUrl}>GitHub</a>}
🔹 স্লাগ জেনারেটরের নিয়ম:

javascript
// "My React App!" → "my-react-app"
// "What's up?" → "whats-up"
// "Hello   World" → "hello-world"
// "JavaScript & TypeScript" → "javascript-typescript"

// regex ব্যাখ্যা:
// [^a-z0-9] → a-z বা 0-9 না থাকলে replace করবে
// /g → সব জায়গায় replace করবে
🔹 ব্যবহারের উদাহরণ:

javascript
// 1. নতুন প্রোজেক্ট তৈরি
const newProject = new Project({
  title: "AI Image Generator",
  description: "Generate images using DALL-E API",
  techStack: [
    { name: "Next.js", color: "#000000" },
    { name: "OpenAI", color: "#10A37F" }
  ],
  liveUrl: "https://ai-image-gen.com",
  githubUrl: "https://github.com/username/ai-image-gen",
  featured: true,
  status: "completed",
  order: 1
});
await newProject.save();
// slug auto-generate হবে: "ai-image-generator"

// 2. সব ফিচার্ড প্রোজেক্ট পাওয়া
const featured = await Project.find({ 
  featured: true, 
  status: "completed" 
}).sort('order');

// 3. স্লাগ দিয়ে একটি প্রোজেক্ট পাওয়া
const project = await Project.findOne({ 
  slug: "ai-image-generator" 
});

// 4. ইন-প্রোগ্রেস প্রোজেক্ট গুলো আপডেট করা
await Project.updateMany(
  { status: "in-progress" },
  { $inc: { order: 1 } }
);

// 5. টেকস্ট্যাক অনুযায়ী খোঁজা
const reactProjects = await Project.find({
  "techStack.name": "React"
});
🔹 ইন্ডেক্সিং সুপারিশ:

javascript
// slug এ index দাও (কারণ প্রায়ই search হবে)
ProjectSchema.index({ slug: 1 });

// featured + status + order এ compound index
ProjectSchema.index({ featured: 1, status: 1, order: 1 });
*/

text
