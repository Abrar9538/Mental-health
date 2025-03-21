// Mental Health Assessment Scoring
const assessmentScores = {
    excellent: 4,
    good: 3,
    okay: 2,
    down: 1,
    low: 4,
    moderate: 3,
    high: 2,
    very_high: 1,
    strong: 4,
    limited: 2,
    none: 1,
    poor: 1,
    struggling: 2
};

// Mental Health Assessment
let currentQuestion = 1;
const totalQuestions = 5;
const questionnaireModal = new bootstrap.Modal(document.getElementById('questionnaireModal'));
const questionnaireForm = document.getElementById('questionnaireForm');
const nextButton = document.getElementById('nextQuestion');
const prevButton = document.getElementById('prevQuestion');

// Show questionnaire when Get Started is clicked
document.querySelector('.hero-section .btn-primary').addEventListener('click', function(e) {
    e.preventDefault();
    questionnaireModal.show();
});

// Handle next question
nextButton.addEventListener('click', function() {
    if (currentQuestion < totalQuestions) {
        // Validate current question
        const currentQuestionElement = document.getElementById(`question${currentQuestion}`);
        const selectedOption = currentQuestionElement.querySelector('input[type="radio"]:checked');
        
        if (!selectedOption) {
            showAlert('Please select an option before proceeding.', 'warning');
            return;
        }

        // Hide current question
        currentQuestionElement.style.display = 'none';
        
        // Show next question
        currentQuestion++;
        document.getElementById(`question${currentQuestion}`).style.display = 'block';
        
        // Update buttons
        prevButton.style.display = 'block';
        if (currentQuestion === totalQuestions) {
            nextButton.textContent = 'Submit';
        }
        
        // Update progress bar
        updateProgress();
    } else {
        // Submit questionnaire
        submitQuestionnaire();
    }
});

// Handle previous question
prevButton.addEventListener('click', function() {
    if (currentQuestion > 1) {
        // Hide current question
        document.getElementById(`question${currentQuestion}`).style.display = 'none';
        
        // Show previous question
        currentQuestion--;
        document.getElementById(`question${currentQuestion}`).style.display = 'block';
        
        // Update buttons
        if (currentQuestion === 1) {
            prevButton.style.display = 'none';
        }
        nextButton.textContent = 'Next';
        
        // Update progress bar
        updateProgress();
    }
});

// Update progress bar
function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}

// Calculate mental health score
function calculateMentalHealthScore(responses) {
    let totalScore = 0;
    let maxScore = 0;
    
    // Calculate score for each response
    Object.values(responses).forEach(response => {
        totalScore += assessmentScores[response] || 0;
        maxScore += 4; // Maximum possible score per question
    });
    
    // Convert to percentage
    return (totalScore / maxScore) * 100;
}

// Get personalized recommendations
function getRecommendations(score, responses) {
    const recommendations = [];
    
    // Mood-based recommendations
    if (responses.mood === 'down' || responses.mood === 'okay') {
        recommendations.push({
            title: 'Mood Improvement',
            suggestions: [
                'Try our guided meditation exercises',
                'Practice gratitude journaling',
                'Engage in physical activity',
                'Connect with friends or family'
            ]
        });
    }
    
    // Sleep-based recommendations
    if (responses.sleep === 'poor' || responses.sleep === 'fair') {
        recommendations.push({
            title: 'Sleep Quality',
            suggestions: [
                'Establish a regular sleep schedule',
                'Create a relaxing bedtime routine',
                'Limit screen time before bed',
                'Try our breathing exercises'
            ]
        });
    }
    
    // Stress-based recommendations
    if (responses.stress === 'high' || responses.stress === 'very_high') {
        recommendations.push({
            title: 'Stress Management',
            suggestions: [
                'Practice mindfulness meditation',
                'Use our study timer for better time management',
                'Take regular breaks during study sessions',
                'Try progressive muscle relaxation'
            ]
        });
    }
    
    // Academic performance recommendations
    if (responses.academic === 'poor' || responses.academic === 'struggling') {
        recommendations.push({
            title: 'Academic Support',
            suggestions: [
                'Connect with academic advisors',
                'Join study groups',
                'Use our study timer for focused sessions',
                'Consider tutoring services'
            ]
        });
    }
    
    // Support system recommendations
    if (responses.support === 'limited' || responses.support === 'none') {
        recommendations.push({
            title: 'Building Support',
            suggestions: [
                'Join campus support groups',
                'Connect with counseling services',
                'Participate in social activities',
                'Use our chat support feature'
            ]
        });
    }
    
    return recommendations;
}

// Submit questionnaire
function submitQuestionnaire() {
    const formData = new FormData(questionnaireForm);
    const responses = {
        mood: formData.get('mood'),
        sleep: formData.get('sleep'),
        stress: formData.get('stress'),
        academic: formData.get('academic'),
        support: formData.get('support')
    };

    // Calculate mental health score
    const score = calculateMentalHealthScore(responses);
    
    // Get personalized recommendations
    const recommendations = getRecommendations(score, responses);
    
    // Show results
    showResults(score, recommendations);
}

// Show assessment results
function showResults(score, recommendations) {
    const modalBody = document.querySelector('.modal-body');
    const form = document.getElementById('questionnaireForm');
    
    // Create results HTML
    let resultsHTML = `
        <div class="assessment-results">
            <h4 class="mb-4">Your Mental Health Assessment Results</h4>
            <div class="score-circle mb-4">
                <div class="score-value">${Math.round(score)}%</div>
                <div class="score-label">Mental Health Score</div>
            </div>
            <div class="recommendations">
                <h5 class="mb-3">Personalized Recommendations</h5>
                ${recommendations.map(rec => `
                    <div class="recommendation-card mb-3">
                        <h6 class="text-primary">${rec.title}</h6>
                        <ul class="list-unstyled">
                            ${rec.suggestions.map(suggestion => `
                                <li><i class="fas fa-check-circle text-success me-2"></i>${suggestion}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Replace form with results
    form.style.display = 'none';
    modalBody.insertAdjacentHTML('beforeend', resultsHTML);
    
    // Add restart button
    const restartButton = document.createElement('button');
    restartButton.className = 'btn btn-primary mt-4';
    restartButton.textContent = 'Take Assessment Again';
    restartButton.onclick = () => {
        location.reload();
    };
    modalBody.appendChild(restartButton);
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.insertBefore(alertDiv, questionnaireForm);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Breathing Exercise
const breathingCircle = document.querySelector('.breathing-circle');
const startBreathingBtn = document.getElementById('startBreathing');
const stopBreathingBtn = document.getElementById('stopBreathing');
let breathingInterval;

function startBreathingExercise() {
    // Update UI
    breathingCircle.classList.add('breathing');
    startBreathingBtn.style.display = 'none';
    stopBreathingBtn.style.display = 'block';
    
    // Breathing animation timing
    const inhaleTime = 4000; // 4 seconds
    const holdTime = 4000;   // 4 seconds
    const exhaleTime = 4000; // 4 seconds
    
    // Start the breathing cycle
    breathingInterval = setInterval(() => {
        // Inhale
        breathingCircle.style.transform = 'scale(1.5)';
        breathingCircle.querySelector('.breathing-text').textContent = 'Inhale';
        
        // Hold
        setTimeout(() => {
            breathingCircle.querySelector('.breathing-text').textContent = 'Hold';
        }, inhaleTime);
        
        // Exhale
        setTimeout(() => {
            breathingCircle.style.transform = 'scale(1)';
            breathingCircle.querySelector('.breathing-text').textContent = 'Exhale';
        }, inhaleTime + holdTime);
        
        // Reset for next cycle
        setTimeout(() => {
            breathingCircle.querySelector('.breathing-text').textContent = 'Breathe';
        }, inhaleTime + holdTime + exhaleTime);
    }, inhaleTime + holdTime + exhaleTime);
}

function stopBreathingExercise() {
    // Clear the interval
    clearInterval(breathingInterval);
    
    // Reset UI
    breathingCircle.classList.remove('breathing');
    breathingCircle.style.transform = 'scale(1)';
    breathingCircle.querySelector('.breathing-text').textContent = 'Breathe';
    startBreathingBtn.style.display = 'block';
    stopBreathingBtn.style.display = 'none';
}

// Event listeners
startBreathingBtn.addEventListener('click', startBreathingExercise);
stopBreathingBtn.addEventListener('click', stopBreathingExercise);

// Profile Management
const profileSection = document.getElementById('profileSection');
const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileForm = document.getElementById('profileForm');
const profileImageInput = document.getElementById('profileImageInput');
const changePasswordForm = document.getElementById('changePasswordForm');

// Load user profile
async function loadUserProfile() {
    try {
        const response = await fetch('/api/profile/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load profile');
        
        const user = await response.json();
        updateProfileUI(user);
    } catch (error) {
        console.error('Error loading profile:', error);
        showAlert('Failed to load profile', 'danger');
    }
}

// Update profile UI
function updateProfileUI(user) {
    profileImage.src = user.profileImage;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    
    // Update form values
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
}

// Handle profile update
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(profileForm);
    
    try {
        const response = await fetch('/api/profile/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email')
            })
        });
        
        if (!response.ok) throw new Error('Failed to update profile');
        
        const user = await response.json();
        updateProfileUI(user);
        showAlert('Profile updated successfully', 'success');
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile', 'danger');
    }
});

// Handle profile image upload
profileImageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
        const response = await fetch('/api/profile/update-image', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error('Failed to update profile image');
        
        const user = await response.json();
        updateProfileUI(user);
        showAlert('Profile image updated successfully', 'success');
    } catch (error) {
        console.error('Error updating profile image:', error);
        showAlert('Failed to update profile image', 'danger');
    }
});

// Handle password change
changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(changePasswordForm);
    
    try {
        const response = await fetch('/api/profile/change-password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: formData.get('currentPassword'),
                newPassword: formData.get('newPassword')
            })
        });
        
        if (!response.ok) throw new Error('Failed to change password');
        
        showAlert('Password changed successfully', 'success');
        changePasswordForm.reset();
    } catch (error) {
        console.error('Error changing password:', error);
        showAlert('Failed to change password', 'danger');
    }
});

// Load profile when user is logged in
if (localStorage.getItem('token')) {
    loadUserProfile();
} 