const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 3 // Assuming a 3-day event
  },
  speakersOrJudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker'
  }]
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule; 