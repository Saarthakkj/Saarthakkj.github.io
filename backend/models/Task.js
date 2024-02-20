const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completionDate: { type: Date }
});

module.exports = mongoose.model('Task', taskSchema);
