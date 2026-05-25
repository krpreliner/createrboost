import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // For faster queries when fetching user's library
  },
  type: {
    type: String,
    enum: ["idea", "hook", "script", "thumbnail"],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  scheduledDay: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Unscheduled"],
    default: "Unscheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);
