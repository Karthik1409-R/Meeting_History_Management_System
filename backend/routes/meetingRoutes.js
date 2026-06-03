const express = require("express");

const {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
} = require("../controllers/meetingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All meeting routes require authentication
router.use(protect);

router.post("/join", joinMeeting);

router.route("/").get(getMeetings).post(createMeeting);

router.route("/:id").get(getMeeting).put(updateMeeting).delete(deleteMeeting);

module.exports = router;
