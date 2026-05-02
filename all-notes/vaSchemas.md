import { z } from "zod";

// ==========================================
// ZOD ভ্যালিডেশন স্কিমা - সম্পূর্ণ ব্যাখ্যা
// =========================================ে
// Zod একটি টাইপ-সেইফ ভ্যালিডেশন লাইব্রেরি 
// এটি ডাটা ভ্যালিডেট করে এবং এর মাধ্যমে TypeScript টাইপও জেনারেট করে

// ==========================================
// ১. AUTH (অথেনটিকেশন) স্কিমা
// ==========================================

// লগইন ভ্যালিডেশন
export const loginSchema = z.object({
  // ইমেইল ভ্যালিডেশন
  email: z.string().email("Invalid email address"),
  // "invalid email address" এরর মেসেজ দিবে যদি ঠিক না হয়
  
  // পাসওয়ার্ড ভ্যালিডেশন  
  password: z.string().min(8, "Password must be at least 8 characters"),
  // অন্তত ৮ ক্যারেক্টার হতে হবে
});

// রেজিস্ট্রেশন ভ্যালিডেশন
export const registerSchema = z.object({
  // নাম ভ্যালিডেশন
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")  // ন্যূনতম ২ অক্ষর
    .max(60),  // সর্বোচ্চ ৬০ অক্ষর
  
  // ইমেইল ভ্যালিডেশন
  email: z.string().email("Invalid email address"),
  
  // পাসওয়ার্ড ভ্যালিডেশন (শক্তিশালী)
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")  // ৮ অক্ষর
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
    // রেগুলার এক্সপ্রেশন চেক করে:
    // (?=.*[a-z]) - কমপক্ষে ১টি ছোট হাতের অক্ষর
    // (?=.*[A-Z]) - কমপক্ষে ১টি বড় হাতের অক্ষর
    // (?=.*\d)    - কমপক্ষে ১টি সংখ্যা
});

// ==========================================
// ২. PROJECT (প্রোজেক্ট) স্কিমা
// ==========================================

export const projectSchema = z.object({
  // টাইটেল - বাধ্যতামূলক
  title: z
    .string()
    .min(1, "Title is required")   // খালি রাখা যাবে না
    .max(100),                     // ১০০ অক্ষরের বেশি নয়
  
  // স্লাগ - অপশনাল (সিস্টেম জেনারেট করবে)
  slug: z.string().optional(),
  
  // সংক্ষিপ্ত বিবরণ - বাধ্যতামূলক
  description: z
    .string()
    .min(1, "Description is required")
    .max(500),                     // SEO এর জন্য ৫০০ অক্ষর যথেষ্ট
  
  // বিস্তারিত বিবরণ - অপশনাল
  longDescription: z.string().optional(),
  
  // থাম্বনেইল - অপশনাল
  thumbnail: z.string().optional(),
  
  // টেক স্ট্যাক - অবজেক্টের অ্যারে
  techStack: z
    .array(
      z.object({
        name: z.string().min(1),     // টেকনোলজির নাম (React, Node.js)
        color: z.string().optional(), // রঙ (হেক্স কোড)
      })
    )
    .default([]),  // ডিফল্ট খালি অ্যারে
  
  // লাইভ ইউআরএল - অপশনাল কিন্তু ইউআরএল হোলেই ভ্যালিড হতে হবে
  liveUrl: z
    .string()
    .url("Invalid URL")    // URL ফরম্যাট চেক করবে
    .optional()
    .or(z.literal("")),    // খালি স্ট্রিংও অনুমোদিত
  
  // ডেমো ইউআরএল
  demoUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  
  // গিটহাব ইউআরএল
  githubUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  
  // ফিচার্ড প্রোজেক্ট?
  featured: z.boolean().default(false),
  
  // স্ট্যাটাস (শুধু এই ৩টি মান নিবে)
  status: z
    .enum(["completed", "in-progress", "archived"])
    .default("completed"),
  
  // অর্ডার নম্বর
  order: z.number().default(0),
});

// ==========================================
// ৩. SKILL (দক্ষতা) স্কিমা
// ==========================================

export const skillSchema = z.object({
  // স্কিলের নাম
  name: z
    .string()
    .min(1, "Name is required")
    .max(50),                    // "Advanced Machine Learning" পর্যন্ত যেতে পারে
  
  // আইকন - অপশনাল
  icon: z.string().optional(),
  
  // ক্যাটাগরি (শুধু ৬টি প্রিডিফাইনড মান)
  category: z.enum([
    "frontend",  // React, Vue, Angular
    "backend",   // Node.js, Python, Java
    "database",  // MongoDB, PostgreSQL
    "devops",    // Docker, Kubernetes
    "tools",     // Git, VS Code
    "other",     // অন্য সবকিছু
  ]),
  
  // দক্ষতার মাত্রা (১-১০০)
  proficiency: z
    .number()
    .min(1)    // ১ = বিগিনার
    .max(100), // ১০০ = এক্সপার্ট
  
  // অর্ডার
  order: z.number().default(0),
});

// ==========================================
// ৪. LEARNING LOG (শেখার ডায়েরি) স্কিমা
// ==========================================

export const learningLogSchema = z.object({
  // টাইটেল
  title: z
    .string()
    .min(1, "Title is required")
    .max(150),
  
  // কন্টেন্ট
  content: z
    .string()
    .min(1, "Content is required"),
    // আপার লিমিট নেই - নোট অনেক বড় হতে পারে
  
  // ট্যাগ (স্ট্রিং এর অ্যারে)
  tags: z.array(z.string()).default([]),
  
  // টাইপ (৪ ধরনের)
  type: z
    .enum(["daily", "weekly", "resource", "milestone"])
    .default("daily"),
    // daily: প্রতিদিনের আপডেট
    // weekly: সপ্তাহিক সারাংশ
    // resource: লিংক/টিউটোরিয়াল সংরক্ষণ
    // milestone: বড় অর্জন
  
  // তারিখ (স্ট্রিং অথবা ডেট অবজেক্ট)
  date: z
    .string()
    .or(z.date())
    .default(() => new Date().toISOString()),
    // ফাংশন কল করে বর্তমান তারিখ সেট করে
});

// ==========================================
// ৫. NOTE (নোট) স্কিমা
// ==========================================

export const noteSchema = z.object({
  // টাইটেল
  title: z
    .string()
    .min(1, "Title is required")
    .max(150),
  
  // কন্টেন্ট
  content: z
    .string()
    .min(1, "Content is required"),
  
  // ট্যাগ
  tags: z.array(z.string()).default([]),
  
  // পিন করা আছে কিনা
  isPinned: z.boolean().default(false),
  
  // রঙ (হেক্স কোড)
  color: z.string().optional(),
  // যেমন: "#ff6b6b", "#4ecdc4"
});

// ==========================================
// ৬. CONTACT (যোগাযোগ ফর্ম) স্কিমা
// ==========================================

export const contactSchema = z.object({
  // নাম
  name: z
    .string()
    .min(2, "Name is required")
    .max(60),
  
  // ইমেইল
  email: z
    .string()
    .email("Invalid email"),
  
  // সাবজেক্ট
  subject: z
    .string()
    .min(5, "Subject is required")
    .max(100),
  
  // মেসেজ
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000),  // স্প্যাম প্রতিরোধের জন্য সীমা
});

// ==========================================
// টাইপ এক্সপোর্ট (TypeScript এর জন্য)
// ==========================================
// Zod স্কিমা থেকে TypeScript টাইপ জেনারেট করে
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type LearningLogInput = z.infer<typeof learningLogSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

// ==========================================
// SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================

/*
🔹 **Zod কী এবং কেন ব্যবহার করছি?**

Zod একটি TypeScript-first ভ্যালিডেশন লাইব্রেরি। এটি:
1. ডাটা ভ্যালিডেট করে (সঠিক ফরম্যাটে আছে কিনা দেখে)
2. TypeScript টাইপ জেনারেট করে
3. UI থেকে ব্যাকএন্ড পর্যন্ত কনসিস্টেন্ট ভ্যালিডেশন নিশ্চিত করে

🔹 **ভ্যালিডেশন কেন দরকার?**

```javascript
// ভ্যালিডেশন ছাড়া:
const userInput = { email: "wrong", password: "123" };
// এই ভুল ডাটা ডাটাবেসে ঢুকে যাবে 😱

// Zod ভ্যালিডেশন সহ:
const result = loginSchema.safeParse(userInput);
if (!result.success) {
  // "Invalid email address" error দেখাবে
  // পাসওয়ার্ডের কথা বলবে: "Password must be 8 chars"
}


কীভাবে ব্যবহার করবেন?

১. API রাউটে ভ্যালিডেশন:

typescript
// app/api/projects/route.ts
import { projectSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  
  // ভ্যালিডেশন চেক
  const result = projectSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json({ 
      error: result.error.issues  // কোন ফিল্ডে কী ভুল
    }, { status: 400 });
  }
  
  const validatedData = result.data; // টাইপ-সেইফ ডাটা
  // ডাটাবেসে সেভ করুন
}
২. রিয়্যাক্ট কম্পোনেন্টে (ফ্রন্টএন্ড):

typescript
// components/ProjectForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const { register, handleSubmit } = useForm({
  resolver: zodResolver(projectSchema)  // Zod রুলস নিজেই ফলো করবে
});
৩. ক্লায়েন্ট-সাইড ভ্যালিডেশন:

typescript
// নতুন প্রোজেক্ট যোগ করার সময়
const newProject = {
  title: "My App",
  description: "A cool app",
  techStack: [{ name: "React" }],
  liveUrl: "not-a-url"  // ❌ ভুল URL
};

const validation = projectSchema.safeParse(newProject);
if (!validation.success) {
  console.log(validation.error.format());
  // { liveUrl: { _errors: ["Invalid URL"] } }
}
🔹 প্রত্যেক স্কিমার বিশেষত্ব:

loginSchema: সাধারণ লগইনের জন্য
registerSchema: পাসওয়ার্ডে ইউজারনেম/ইমেইল ব্যবহার না করার জন্য রেগুলার এক্সপ্রেশন চেক
projectSchema: URL গুলো অপশনাল কিন্তু দিলে ভ্যালিড হতে হবে
skillSchema: প্রোফিসিয়েন্সি ১-১০০ এর মধ্যে - প্রোগ্রেস বার এ দেখানোর জন্য
learningLogSchema: ডেট ফিল্ড স্ট্রিং বা ডেট দুইই হতে পারে - ফ্রন্টএন্ড থেকে আসা স্ট্রিং পার্স করে
noteSchema: রঙ অপশনাল - প্রি-ডিফাইন কালার প্যালেট অফার করবেন
contactSchema: মেসেজের জন্য ১০-২০০০ অক্ষর - খুব ছোট বা খুব বড় স্প্যাম ফিল্টার করে

🔹 রেগুলার এক্সপ্রেশন ব্যাখ্যা:

javascript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
// ^ - শুরু থেকে শুরু কর
// (?=.*[a-z]) - এর পরে যেকোনো জায়গায় ছোট হাতের অক্ষর আছে?
// (?=.*[A-Z]) - যেকোনো জায়গায় বড় হাতের অক্ষর আছে?
// (?=.*\d) - যেকোনো জায়গায় সংখ্যা আছে?

// উদাহরণ:
"password"     // ❌ (ক্যাপিটাল লেটার নেই, নাম্বার নেই)
"Password"     // ❌ (নাম্বার নেই)  
"Password123"  // ✅ (সব আছে)
🔹 সেফপার্স() বনাম পার্স():

typescript
// parse() - error throw করবে (ব্যাকএন্ডের জন্য ভালো)
try {
  const data = loginSchema.parse(userInput);
} catch(e) {
  // error handling
}

// safeParse() - error throws না, বরং অবজেক্ট রিটার্ন করে (ফ্রন্টএন্ডের জন্য ভালো)
const result = loginSchema.safeParse(userInput);
if (result.success) {
  // result.data - ভ্যালিড ডাটা
} else {
  // result.error - এরর মেসেজ
}
🔹 অপশনাল ফিল্ডের সঠিক হ্যান্ডলিং:

typescript
// ভুল উপায়:
url: z.string().optional()  // undefined অনুমোদিত, কিন্তু "" (খালি) অনুমোদিত না

// সঠিক উপায়:
url: z.string().url().optional().or(z.literal(""))
// মানে: হয় URL হবে, অথবা undefined, অথবা খালি স্ট্রিং
🔹 ডিফল্ট ভ্যালু:

typescript
// ইউজার যদি না দেয় তাহলে ডিফল্ট সেট হবে
featured: z.boolean().default(false)  // না দিলে false
type: z.enum([...]).default("daily")  // না দিলে "daily"
order: z.number().default(0)          // না দিলে 0
🔹 ইন্টিগ্রেশন উদাহরণ (ফুল স্ট্যাক):

typescript
// ব্যাকএন্ড API
export async function POST(req: Request) {
  const body = await req.json();
  const validated = await projectSchema.parseAsync(body);
  const project = new Project(validated);
  await project.save();
  return Response.json(project);
}

// ফ্রন্টএন্ড ফর্ম
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(projectSchema)
});

<input {...register("title")} />
{errors.title && <span>{errors.title.message}</span>}
🔹 কেন Zod MongoDB স্কিমার থেকে আলাদা?

MongoDB (মঙ্গু্ওজ): ডাটাবেস কাঠামো

Zod: ডাটা ভ্যালিডেশন (ইউজার ইনপুট চেক করার জন্য)

দুইটাই দরকার: ডাটাবেস লেভেল + অ্যাপ্লিকেশন লেভেল ভ্যালিডেশন
*/

text
