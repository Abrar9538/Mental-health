const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true,
        enum: ['😊', '😐', '😔', '😤', '😫']
    },
    notes: {
        type: String,
        trim: true
    },
    activities: [{
        type: String,
        trim: true
    }],
    stressLevel: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
moodSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', moodSchema); 