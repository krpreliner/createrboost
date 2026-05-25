import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Optional for OAuth users
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined to not trigger unique index violation
  },
  youtubeAccessToken: {
    type: String,
  },
  youtubeRefreshToken: {
    type: String,
  },
  youtubeTokenExpiresAt: {
    type: Date,
  },
  displayName: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  plan: {
    type: String,
    enum: ["Starter", "Pro", "Agency"],
    default: "Starter",
  },
  aiCredits: {
    type: Number,
    default: 50,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
