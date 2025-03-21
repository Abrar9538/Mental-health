class AuraChatbot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatContainer');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendMessage');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.initialize();
    }

    initialize() {
        // Initially hide the chat container
        this.chatContainer.style.display = 'none';

        // Event listeners
        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.chatContainer.style.display = 
            this.chatContainer.style.display === 'none' ? 'flex' : 'none';
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.userInput.value = '';

        // Show loading indicator
        this.addMessage('Thinking...', 'bot loading');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: message })
            });

            const data = await response.json();
            
            // Remove loading message
            this.removeLoadingMessage();
            
            // Add bot response
            this.addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.removeLoadingMessage();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot error');
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('aura-message', type);
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeLoadingMessage() {
        const loadingMessage = this.chatMessages.querySelector('.loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }
}

// Initialize chatbot when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuraChatbot();
});

// Add this function to handle navigation visibility
function updateNavVisibility() {
    const profileLink = document.getElementById('profileLink');
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');

    // Initially hide profile section
    if (profileSection) {
        profileSection.style.display = 'none';
    }

    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle visibility
        if (loginBtn.textContent === 'Login') {
            // Show login form (you can add your login form logic here)
            loginBtn.textContent = 'Logout';
            if (profileLink) profileLink.style.display = 'none';
            if (profileSection) profileSection.style.display = 'none';
        } else {
            // Handle logout
            loginBtn.textContent = 'Login';
            if (profileLink) profileLink.style.display = 'block';
            if (profileSection) profileSection.style.display = 'block';
        }
    });

    // Handle profile link click
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (profileSection) {
                profileSection.style.display = 
                    profileSection.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
}

// Call this function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    updateNavVisibility();
});

// Add this to your existing JavaScript
class AuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.loginBtn = document.getElementById('loginBtn');
        this.profileLink = document.getElementById('profileLink');
        this.profileSection = document.getElementById('profileSection');
        
        this.initialize();
    }

    initialize() {
        // Check if user is already logged in (you can use localStorage or session)
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.updateUI();
        
        // Add event listeners
        this.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLogin();
        });
        
        if (this.profileLink) {
            this.profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleProfile();
            });
        }
    }

    toggleLogin() {
        this.isLoggedIn = !this.isLoggedIn;
        localStorage.setItem('isLoggedIn', this.isLoggedIn);
        this.updateUI();
    }

    toggleProfile() {
        if (!this.isLoggedIn) return;
        
        if (this.profileSection) {
            const isVisible = this.profileSection.style.display !== 'none';
            this.profileSection.style.display = isVisible ? 'none' : 'block';
        }
    }

    updateUI() {
        // Update button text
        this.loginBtn.textContent = this.isLoggedIn ? 'Logout' : 'Login';
    }
} 