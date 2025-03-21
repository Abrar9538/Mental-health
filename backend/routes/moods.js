const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

// Get all moods for a user
router.get('/', protect, async (req, res) => {
    try {
        const moods = await Mood.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: moods.length,
            data: moods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching moods',
            error: error.message
        });
    }
});

// Create a new mood entry
router.post('/',
    protect,
    [
        body('mood').isIn(['😊', '😐', '😔', '😤', '😴']).withMessage('Invalid mood value'),
        body('notes').optional().trim(),
        body('activities').optional().isArray(),
        body('stressLevel').optional().isInt({ min: 1, max: 5 }).withMessage('Stress level must be between 1 and 5')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { mood, notes, activities, stressLevel } = req.body;

            const moodEntry = await Mood.create({
                user: req.user.id,
                mood,
                notes,
                activities,
                stressLevel
            });

            res.status(201).json({
                success: true,
                data: moodEntry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating mood entry',
                error: error.message
            });
        }
    }
);

// Get mood statistics
router.get('/stats', protect, async (req, res) => {
    try {
        const stats = await Mood.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: '$mood',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalMoods = stats.reduce((acc, curr) => acc + curr.count, 0);
        const moodPercentages = stats.map(stat => ({
            mood: stat._id,
            percentage: (stat.count / totalMoods) * 100
        }));

        res.json({
            success: true,
            data: {
                totalMoods,
                moodPercentages
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching mood statistics',
            error: error.message
        });
    }
});

// Delete a mood entry
router.delete('/:id', protect, async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);

        if (!mood) {
            return res.status(404).json({
                success: false,
                message: 'Mood entry not found'
            });
        }

        // Make sure user owns the mood entry
        if (mood.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this mood entry'
            });
        }

        await mood.remove();

        res.json({
            success: true,
            message: 'Mood entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting mood entry',
            error: error.message
        });
    }
});

module.exports = router; 