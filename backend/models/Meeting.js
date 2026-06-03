const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    meetingCode: {
      type: String,
      unique: true,
    },

    hostName: {
      type: String,
      required: true,
      trim: true,
    },

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    scheduledFor: {
      type: Date,
    },

    participants: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
      },
    ],

    notes: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate meetingCode before saving if not provided
meetingSchema.pre("save", function (next) {
  if (!this.meetingCode) {
    this.meetingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Meeting", meetingSchema);
