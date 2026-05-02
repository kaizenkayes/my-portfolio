import { connectDB } from "@/lib/db/connect";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import LearningLog from "@/lib/db/models/LearningLog";

const ABOUT = `👋 Hi, I'm Kayes — a Full-Stack Developer (MERN Specialist).
I specialize in building scalable web applications using Next.js, React, TypeScript, Node.js, and MongoDB.
My focus is on clean code, performance optimization, and modern architecture.`;

const CONTACT = `📬 Contact Info:
• Email: kayesmia674@gmail.com
• Status: Available for freelance projects & collaborations.
Feel free to reach out!`;

const DEFAULT_SUGGESTIONS = [
  "🗂️ View Projects",
  "🛠️ Technical Skills",
  "👤 About Kayes",
  "📚 Current Learning",
  "📬 Contact Details",
];

interface ProjectDoc {
  title: string;
  status: string;
  featured?: boolean;
  description: string;
  techStack?: Array<{ name: string }>;
}

interface SkillDoc {
  name: string;
  category: string;
  proficiency: number;
}

interface LearningLogDoc {
  type: string;
  title: string;
  content: string;
}

export async function GET() {
  return Response.json({ suggestions: DEFAULT_SUGGESTIONS });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string };
    const message = body.message?.trim();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();

    const msg = message.toLowerCase();

    // About / Identity
    if (/about|who|profile|intro|kayes/i.test(msg)) {
      return Response.json({ reply: ABOUT });
    }

    // Contact / Hiring
    if (/contact|email|hire|freelance|reach|connect/i.test(msg)) {
      return Response.json({ reply: CONTACT });
    }

    // Projects
    if (/project|work|portfolio|build|develop/i.test(msg)) {
      const projects = (await Project.find({})
        .sort({ order: 1, createdAt: -1 })
        .limit(5)
        .lean()) as unknown as ProjectDoc[];

      if (!projects.length) {
        return Response.json({ reply: "No projects found at the moment." });
      }

      const reply = projects
        .map((p) => {
          const stack = Array.isArray(p.techStack)
            ? p.techStack.map((t) => t.name).join(", ")
            : "N/A";
          return `• ${p.title} [${p.status}]${p.featured ? " ⭐" : ""}\n  ${p.description}\n  Stack: ${stack}`;
        })
        .join("\n\n");

      return Response.json({
        reply: `Here are my recent projects:\n\n${reply}`,
      });
    }

    // Skills
    if (/skill|tech|stack|language|tool|expertise/i.test(msg)) {
      const skills = (await Skill.find({})
        .sort({ proficiency: -1 })
        .lean()) as unknown as SkillDoc[];

      if (!skills.length) {
        return Response.json({ reply: "Skills data is currently unavailable." });
      }

      const grouped = new Map<string, string[]>();
      for (const s of skills) {
        const cat = s.category || "General";
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(`${s.name} (${s.proficiency}%)`);
      }

      const reply = Array.from(grouped.entries())
        .map(([cat, items]) => `🔹 ${cat.toUpperCase()}: ${items.join(", ")}`)
        .join("\n");

      return Response.json({
        reply: `My technical expertise:\n\n${reply}`,
      });
    }

    // Learning
    if (/learn|study|current|now|reading/i.test(msg)) {
      const logs = (await LearningLog.find({})
        .sort({ date: -1 })
        .limit(3)
        .lean()) as unknown as LearningLogDoc[];

      if (!logs.length) {
        return Response.json({ reply: "No recent learning logs found." });
      }

      const reply = logs
        .map(
          (l) =>
            `• [${l.type.toUpperCase()}] ${l.title}\n  ${l.content.slice(0, 120)}...`
        )
        .join("\n\n");

      return Response.json({
        reply: `Here's what I've been focusing on lately:\n\n${reply}`,
      });
    }

    // Fallback
    return Response.json({
      reply: `I'm Kayes's portfolio assistant! I can tell you about his:\n\n${DEFAULT_SUGGESTIONS.join("\n")}\n\nJust ask! 😊`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}