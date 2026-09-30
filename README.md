# Movie App

A full-stack movie management application built with **React.js**, **Node.js**, **Express.js**, **Prisma ORM**, and **MongoDB**.

The project contains both the frontend and backend in a single repository.

## Project Structure

```text
movie-app/
│
├── backend/          # Node.js + Express.js API
│   ├── controllers/
│   ├── routes/
│   ├── prisma/
│   ├── uploads/
│   ├── app.js
│   └── package.json
│
├── frontend/         # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Technologies

### Frontend

- React.js
- React Router
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- Prisma ORM
- MongoDB
- JWT Authentication
- bcrypt
- Multer
- REST API

## Features

- User registration and login
- JWT-based authentication
- Movie listing
- Movie details
- Movie categories
- Category filtering
- Movie sorting
- Add movies
- Edit movies
- Movie image upload
- Admin movie deletion
- User profile
- Logout
- RESTful API

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-app.git
```

```bash
cd movie-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other environment variables required by the backend.

### 4. Start the Backend

For development:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## API

The backend provides REST API endpoints for:

- Authentication
- Users
- Movies
- Categories

Example:

```text
GET /movies
GET /categories
POST /auth/register
POST /auth/login
```

## Environment Variables

Environment files containing secrets are not included in the repository.

Use `.env.example` to document required environment variables.

Example:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

## Development

This project uses a monorepo-style structure where the frontend and backend are maintained in the same Git repository.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Git

The repository intentionally excludes:

- `node_modules`
- `.env` files
- Build files
- Logs
- Temporary files
- User-uploaded files

These files should not be committed to GitHub.

## License

This project is for learning and development purposes.
