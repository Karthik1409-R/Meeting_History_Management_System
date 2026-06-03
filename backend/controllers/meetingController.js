const Meeting = require("../models/Meeting");

// @desc    Get all meetings for the logged-in user
// @route   GET /api/meetings
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single meeting by ID
// @route   GET /api/meetings/:id
exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new meeting
// @route   POST /api/meetings
exports.createMeeting = async (req, res) => {
  try {
    const { title, hostName, scheduledFor, participants, notes } = req.body;

    const meetingData = {
      title,
      hostName,
      participants,
      notes,
      user: req.user._id,
    };

    if (scheduledFor) {
      meetingData.scheduledFor = scheduledFor;
    } else {
      meetingData.startedAt = new Date();
    }

    const meeting = await Meeting.create(meetingData);

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meeting
// @route   PUT /api/meetings/:id
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meeting
// @route   DELETE /api/meetings/:id
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json({ message: "Meeting deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a meeting by meeting code
// @route   POST /api/meetings/join
exports.joinMeeting = async (req, res) => {
  try {
    const { meetingCode, name, email } = req.body;

    const meeting = await Meeting.findOne({ meetingCode });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Check if the participant is already in the meeting
    const alreadyJoined = meeting.participants.some(
      (p) => p.email === email
    );

    if (!alreadyJoined) {
      meeting.participants.push({ name, email });
      await meeting.save();
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
