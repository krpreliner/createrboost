import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user doesn't exist to prevent email enumeration attacks
      return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." }, { status: 200 });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token to expire in 1 hour
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // For local testing, print the URL to the console
    console.log("=========================================");
    console.log("PASSWORD RESET LINK GENERATED:");
    console.log(resetUrl);
    console.log("=========================================");

    // Attempt to send email if SMTP credentials exist
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"CreatorBoost AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset for your CreatorBoost AI account.</p>
          <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#8b5cf6;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
    } else {
      console.log("SMTP credentials missing in .env.local. Skipping email send.");
    }

    return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." }, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
