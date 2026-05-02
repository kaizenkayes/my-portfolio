import mongoose from "mongoose";

// ==========================================
// 1. MongoDB URI কনফিগারেশন
// =========================================ে
// env ফাইল থেকে MongoDB connection string নেওয়া হচ্ছে
const MONGODB_URI = process.env.MONGODB_URI!;

// যদি URI না থাকে তাহলে error throw করা হচ্ছে
// এটি নিশ্চিত করে যে ডাটাবেস কানেকশন ছাড়া app চলবে না
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

// ==========================================
// 2. ক্যাশিং স্ট্রাকচার ডিফাইন করা
// =========================================ে
// TypeScript interface যা ক্যাশের আকৃতি নির্ধারণ করে
// conn: mongoose connection instance (null যদি না থাকে)
// promise: ongoing connection promise (null যদি না থাকে)
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ==========================================
// 3. গ্লোবাল টাইপ ডিক্লেয়ারেশন
// =========================================ে
// Next.js এর hot reloading এ多次 connection তৈরি না করার জন্য
// global object এ mongoose ক্যাশ রাখা হচ্ছে
declare global {
  var mongoose: MongooseCache | undefined;
}

// ==========================================
// 4. ক্যাশ ইনিশিয়ালাইজেশন
// =========================================ে
// global.mongoose থাকলে সেটা ব্যবহার করবে, নাহলে নতুন খালি ক্যাশ তৈরি করবে
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// যদি global.mongoose না থাকে তাহলে সেটাকে ক্যাশ দিয়ে assign করে দিচ্ছি
// এটি নিশ্চিত করে যে সব requests একই ক্যাশ শেয়ার করবে
if (!global.mongoose) {
  global.mongoose = cached;
}

// ==========================================
// 5. মেইন কানেকশন ফাংশন
// =========================================ে
// এই ফাংশন একবার কল করলেই ডাটাবেস কানেক্ট হবে
// পরবর্তী সব কল একই connection ব্যবহার করবে (singleton pattern)
export async function connectDB(): Promise<typeof mongoose> {
  // স্টেপ 1: যদি আগেই connection তৈরি হয়ে থাকে, তাহলে সেটাই রিটার্ন করবে
  // এটি multiple connections প্রতিরোধ করে
  if (cached.conn) {
    return cached.conn;
  }

  // স্টেপ 2: যদি কোনো ongoing promise না থাকে, তাহলে নতুন connection initiate করবে
  if (!cached.promise) {
    // bufferCommands: false মানে হচ্ছে - ডাটাবেস কানেক্ট না থাকলে 
    // queries queue হবে না, সাথে সাথে error দিবে
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  // স্টেপ 3: connection সম্পূর্ণ হওয়ার জন্য wait করবে
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // error হলে promise কে null সেট করে দিচ্ছি
    // যাতে পরবর্তী attempt এ নতুন করে connect করার চেষ্টা করে
    cached.promise = null;
    throw e;
  }

  // স্টেপ 4: established connection রিটার্ন করবে
  return cached.conn;
}

// ==========================================
// SUMMARY (বাংলায়):
// ==========================================
/*
এই কোডটি MongoDB কানেকশন manage করার জন্য একটি singleton pattern ব্যবহার করে।

🔹 **কেন এই প্যাটার্ন দরকার?**
- প্রতিটি API request এর জন্য নতুন connection তৈরি করলে resource浪費 হয়
- Next.js এর serverless environment এ multiple connections সমস্যা তৈরি করতে পারে
- Database connection টাই expensive operation

🔹 **কীভাবে কাজ করে?**
1. প্রথমবার connectDB() কল করলে actual connection তৈরি হবে
2. সেই connection কে global object এ cache করে রাখবে
3. পরবর্তী সব কল সেই cached connection return করবে
4. App lifecycle এ শুধু একটি connection থাকে

🔹 **bufferCommands: false কেন?**
- ডাটাবেস disconnected থাকলে queries execute না করে সাথে সাথে error দিবে
- Serverless environment এ এটি preferable কারণ queue করে রাখলে memory leak হতে পারে

🔹 **ব্যবহারের নিয়ম:**
```javascript
// কোনো API route বা serverless function এ
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  await connectDB(); // প্রথমবার connect করবে, পরের বার cached return করবে
  // আপনার database operation করুন
}


🔹 কেন global variable?

Next.js development এ hot reloading হয়

Production এ multiple serverless instances থাকে

Global variable নিশ্চিত করে সব instance একই connection share করবে
*/



**মূল পয়েন্ট:** এই প্যাটার্নটি MongoDB connection-কে **lazy**, **cached**, এবং **singleton** করে তোলে - যার ফলে পারফরম্যান্স ভালো হয় এবং resource কমে।