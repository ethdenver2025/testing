import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Storage', 'Processing', 'Verification', 'Computation'],
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
  },
  client: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  reward: {
    type: String,
    required: true,
  },
});

export const Task = mongoose.model('Task', taskSchema);
