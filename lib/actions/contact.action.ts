"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactState {
  success: boolean;
  error: string;
}

export async function sendContactEmail(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Invalid input",
    };
  }

  const { name, email, subject, message } = parsed.data;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@kaizenhub.dev",
      to: process.env.ADMIN_EMAIL ?? "admin@kaizenhub.dev",
      subject: `[KaizenHub] ${subject}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#818cf8;margin-bottom:8px;">New Contact Message</h2>
          <p style="color:#8a929c;font-size:14px;margin-bottom:24px;">From KaizenHub Portfolio</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#8a929c;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;width:80px;">Name</td>
              <td style="padding:8px 0;color:#ededee;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#8a929c;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Email</td>
              <td style="padding:8px 0;color:#ededee;">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#8a929c;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Subject</td>
              <td style="padding:8px 0;color:#ededee;">${subject}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0;" />
          <p style="color:#ededee;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    return { success: true, error: "" };
  } catch {
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
