## YouTube Clone - MERN Stack

A full-stack YouTube Clone application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).
This project allows users to register/login, explore videos, watch videos, create channels, upload/manage videos, and interact through comments.

## Features
- Frontend Features
- Responsive YouTube-like UI
- Toggle Sidebar Navigation
- Video Grid Layout
- Search Videos by Title
- Filter Videos by Category
- User Authentication (Login/Register)
- JWT Authentication Handling
- Video Player Page
- Like & Dislike Functionality
- Comment System (CRUD)
- Channel Creation
- Manage Videos (Create/Edit/Delete)
- Mobile Responsive Design
- Backend Features
- REST API using Express.js
- MongoDB Database Integration
- JWT Authentication & Protected Routes
- Video CRUD APIs
- Channel CRUD APIs
- Comment CRUD APIs
- User Authentication APIs
- MongoDB Models using Mongoose

## Tech Stack
- Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React Icons
- Vite
- Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

YOUTUBE-CLONE/
│
├── client/                     # Frontend (React + Vite)
│
│   ├── public/
│   ├── src/
│   │
│   │   ├── assets/
│   │   ├── Components/
│   │   ├── Layout/
│   │   ├── Pages/
│   │   │   ├── Channel/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── VideoPlayer.jsx
│   │   │
│   │   ├── Routes/
│   │   ├── Services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express)
│
│   ├── Config/
│   │   └── db.js
│   │
│   ├── Controllers/
│   │   ├── Auth.Controller.js
│   │   ├── Channel.Controller.js
│   │   ├── Comment.Controller.js
│   │   └── Video.Controller.js
│   │
│   ├── Middleware/
│   │   └── AuthMiddleware.js
│   │
│   ├── Models/
│   │   ├── Channel.Model.js
│   │   ├── Channel.Video.js
│   │   ├── Comment.Model.js
│   │   ├── User.Model.js
│   │   └── Video.Model.js
│   │
│   ├── Routes/
│   │   ├── Auth.Route.js
│   │   ├── Channel.Route.js
│   │   ├── Comment.Route.js
│   │   └── Video.Route.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md

## Authentication

The project uses JWT (JSON Web Token) authentication.
### Features
- User Registration
- User Login
- Protected Routes
- Token Verification Middleware
- Password Hashing using bcryptjs

## Main Pages

1. Home Page
YouTube Header
Sidebar Navigation
Category Filter Buttons
Search Bar
Video Thumbnails Grid

2. Authentication Pages
Register Page
Username
Email
Password Validation
Login Page
JWT Login Authentication
Redirect to Home Page after Login

3. Video Player Page
Video Playback
Video Details
Like & Dislike Buttons
Comment CRUD Operations

4. Channel Page
Create Channel
Upload Videos
Edit Videos
Delete Videos
Display User Videos

## Search & Filter

1. Search
Users can search videos using the search bar based on:

2. Video Title
Users can filter videos using categories such as:
  "All",
  "Education",
  "Programming",
  "Database",
  "Career"

## API Endpoints

1. Authentication APIs
Method	Endpoint	Description
POST	/api/auth/register	Register User
POST	/api/auth/login	Login User

2. Video APIs
Method	Endpoint	Description
GET	/api/videos	Get All Videos
GET	/api/videos/:id	Get Single Video
POST	/api/create-my-channel-video	Upload Video
PUT	/api/videos/:id	Update Video
DELETE	/api/videos/:id	Delete Video

3. Channel APIs
Method	Endpoint	Description
POST	/api/channel	Create Channel
GET	/api/channel/:id	Get Channel Details
PUT	/api/channel/:id	Customise Channel

4. Comment APIs
Method	Endpoint	Description
POST	/api/comments	Add Comment
PUT	/api/comments/:id	Edit Comment
DELETE	/api/comments/:id	Delete Comment

## Installation & Setup

1. Clone Repository
git clone <your-github-repo-link>
Frontend Setup
cd client
npm install
npm run dev

2. Frontend will run on:

http://localhost:5173
Backend Setup
cd server
npm install
npm run dev

3. Backend will run on:

http://localhost:5000
Environment Variables

Create a .env file inside the server folder.

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

4. Dependencies
Frontend Dependencies
npm install react-router-dom axios lucide-react
Backend Dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

## Responsive Design

The application is fully responsive for:

- Mobile Devices
- Tablets
- Laptops
- Desktop Screens

## Future Improvements
- Video Upload using Cloudinary
- Real YouTube API Integration
- Subscribe Feature
- Watch History
- Playlist Feature
- Dark/Light Theme
- Nested Comments
- Notifications

## Screenshots

Add screenshots of:

Home Page
Login/Register Page
Video Player Page
Channel Page


## Testing Checklist

- User Registration
- User Login
- JWT Authentication
- Video CRUD
- Comment CRUD
- Search Functionality
- Category Filters
- Responsive UI
