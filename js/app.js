// Breathing Exercise
const breathingCircle = document.querySelector('.breathing-circle');
const startBreathingBtn = document.getElementById('startBreathing');
let isBreathing = false;

startBreathingBtn.addEventListener('click', () => {
    if (!isBreathing) {
        isBreathing = true;
        breathingCircle.classList.add('breathing');
        startBreathingBtn.textContent = 'Stop Breathing';
        
        // Breathing animation timing
        setTimeout(() => {
            breathingCircle.classList.remove('breathing');
            setTimeout(() => {
                breathingCircle.classList.add('breathing');
            }, 4000);
        }, 4000);
    } else {
        isBreathing = false;
        breathingCircle.classList.remove('breathing');
        startBreathingBtn.textContent = 'Start Breathing';
    }
});

// Mood Tracker
const moodButtons = document.querySelectorAll('.mood-btn');
const moodHistory = [];

moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mood = button.dataset.mood;
        const timestamp = new Date().toLocaleString();
        moodHistory.push({ mood, timestamp });
        
        // Visual feedback
        moodButtons.forEach(btn => btn.style.transform = 'scale(1)');
        button.style.transform = 'scale(1.2)';
        
        // Store in localStorage
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        
        // Show feedback
        showNotification(`Mood recorded: ${mood}`);
    });
});

// Study Timer
const timerDisplay = document.querySelector('.timer-display');
const startTimerBtn = document.getElementById('startTimer');
const progressRing = document.querySelector('.progress-ring-circle-progress');
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerInterval;

// Set up the progress ring
const radius = 90; // Match the r attribute in the SVG
const circumference = radius * 2 * Math.PI;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const percent = (timeLeft / (25 * 60)) * 100;
    setProgress(percent);
}

startTimerBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        startTimerBtn.textContent = 'Start Timer';
        timerInterval = null;
    } else {
        timeLeft = 25 * 60;
        updateTimer();
        startTimerBtn.textContent = 'Stop Timer';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
            
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                startTimerBtn.textContent = 'Start Timer';
                timerInterval = null;
                showNotification('Time to take a break!');
            }
        }, 1000);
    }
});

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 end-0 m-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved mood history
    const savedMoodHistory = localStorage.getItem('moodHistory');
    if (savedMoodHistory) {
        moodHistory.push(...JSON.parse(savedMoodHistory));
    }
});

// Mental Health Statistics Graph
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('mentalHealthStats');
    if (ctx) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [
                    'Depression & Anxiety',
                    'Academic Stress',
                    'Sleep Issues',
                    'Social Isolation',
                    'Self-esteem Issues'
                ],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#FF6B6B',  // Soft red
                        '#4ECDC4',  // Teal
                        '#45B7D1',  // Light blue
                        '#96CEB4',  // Sage green
                        '#FFEEAD'   // Light yellow
                    ],
                    borderColor: '#FFFFFF',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
    }
});

// Profile visibility handling
document.addEventListener('DOMContentLoaded', function() {
    const profileSection = document.getElementById('profileSection');
    const profileLink = document.getElementById('profileLink');
    const loginBtn = document.getElementById('loginBtn');

    // Initially hide profile section
    if (profileSection) {
        profileSection.style.display = 'none';
    }

    // Hide profile link in nav when not logged in
    if (profileLink) {
        profileLink.style.display = 'none';
    }

    // Login form submission handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // After successful login:
            if (profileSection) {
                profileSection.style.display = 'block';
            }
            if (profileLink) {
                profileLink.style.display = 'block';
            }
            if (loginBtn) {
                loginBtn.textContent = 'Logout';
            }

            // Close login modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }
        });
    }

    // Logout handler
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            if (loginBtn.textContent === 'Logout') {
                e.preventDefault();
                
                // Hide profile section and link
                if (profileSection) {
                    profileSection.style.display = 'none';
                }
                if (profileLink) {
                    profileLink.style.display = 'none';
                }
                
                // Reset login button
                loginBtn.textContent = 'Login';
            }
        });
    }
});

// Login button click handler
document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Show profile section
    document.getElementById('profileSection').style.display = 'block';
    // Scroll to profile section
    document.getElementById('profileSection').scrollIntoView({ behavior: 'smooth' });
}); 