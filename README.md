# Mental Health Platform

A comprehensive web platform designed to support mental health and well-being through various tools and resources.

## Features

- User Authentication (Register/Login)
- Mood Tracking with Statistics
- Breathing Exercise Tool
- Study Timer
- Chat Support
- Resource Library
- Admin Dashboard

## Tech Stack

### Frontend
- HTML5
- CSS3 (with modern animations and effects)
- JavaScript (Vanilla)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Express Validator

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mental-health-platform.git
cd mental-health-platform
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in the backend directory
- Update the variables with your values

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- PUT `/api/users/change-password` - Change password
- DELETE `/api/users/account` - Delete user account

### Moods
- GET `/api/moods` - Get all moods for a user
- POST `/api/moods` - Create a new mood entry
- GET `/api/moods/stats` - Get mood statistics
- DELETE `/api/moods/:id` - Delete a mood entry

### Admin
- GET `/api/users/admin/users` - Get all users
- PUT `/api/users/admin/users/:id/role` - Update user role

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons from [Font Awesome](https://fontawesome.com/)
- Color scheme inspired by mental health awareness campaigns
- Design patterns from modern web applications

## Support

For support, email support@mentalhealthplatform.com or join our Slack channel. 