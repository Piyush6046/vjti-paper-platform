
# VJTI Exams Platform

A platform for VJTI students to share and download previous years' exam papers, sell/buy books, and discuss academic topics.

## Features

- User authentication (register/login)
- Upload and download exam papers
- Filter papers by branch, semester, and year
- Rate and review papers
- Report inappropriate content
- Community discussion forum
- Buy/sell textbooks
- User profile management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/vjti-exams.git
   cd vjti-exams
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

4. Set up environment variables
   - Copy `.env.example` to `.env` in the project root
   - Update the values with your MongoDB connection string, JWT secret, etc.
   ```bash
   cp .env.example .env
   ```

5. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

6. Start the frontend development server
   ```bash
   # From the project root
   npm run dev
   ```

7. Navigate to `http://localhost:8080` in your browser

## Project Structure

```
vjti-exams/
├── public/            # Static assets
├── server/            # Backend code
│   ├── models/        # MongoDB schemas
│   ├── uploads/       # Uploaded files
│   └── index.js       # Server entry point
├── src/               # Frontend code
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── types/         # TypeScript type definitions
└── .env               # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user

### User
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Papers
- `GET /api/papers` - Get all papers (with filters)
- `GET /api/papers/:id` - Get paper by ID
- `GET /api/papers/user/:userId` - Get papers by user
- `POST /api/papers` - Upload a new paper
- `POST /api/papers/:id/download` - Increment download count

### Reviews
- `GET /api/papers/:id/reviews` - Get reviews for a paper
- `POST /api/papers/:id/reviews` - Add a review for a paper

### Reports
- `POST /api/papers/:id/report` - Report a paper

### Books
- `GET /api/books` - Get all books for sale
- `GET /api/books/user/:userId` - Get books listed by user
- `POST /api/books` - List a book for sale
- `PUT /api/books/:id/sold` - Mark a book as sold

### Messages
- `GET /api/messages` - Get community chat messages
- `POST /api/messages` - Post a message to community chat

## License

This project is licensed under the MIT License.
