# A backend service where users can create teams, manage members, and handle a simple task board withcolumns: TODO → DOING → DONE.

--- 

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-b23a48.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red.svg)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)

## 🚀 Quick Start (5 Minutes)
### Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Git installed
- A modern browser

## Setup Steps
```bash
# 1. Create folder
mkdir server 

# 2. Clone repository
git clone https://github.com/indxr1904/todo-app.git

# 3. Setup Backend
cd backend
npm install
cp .env.example .env   # Add your PORT & JWT secret
npm start              # Starts backend at http://localhost:3000

```

## 🔐 Environment Variables

## Backend (backend/.env)

```
# ===============================
# Server Configuration
# ===============================
# Port on which the backend server will run
PORT=5000

# ===============================
# Authentication / Security
# ===============================
# Secret key used to sign JWT tokens
# Keep this value strong and private
JWT_SECRET=your_jwt_secret

```
## API Documentation (Postman)

This project includes a Postman collection for all API endpoints.

### File:
task-board-api.postman_collection.json

### How to use:

1. Download the file from this repository
2. Open Postman
3. Click **Import**
4. Upload `task-board-api.postman_collection.json`
5. Set environment variables:
   - baseUrl = http://localhost:3000
   - token = JWT token
   - teamId
   - taskId

All endpoints are organized into folders:
- Auth
- Teams
- Tasks (includes activities)

## Features
- JWT Authentication
- Team management
- Task board (TODO / DOING / DONE)
- Pagination, search, filtering
- Activity logs with background worker
- In-memory caching
- Rate limiting

---

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- Node-cache
- node-cron

## Background Worker
- Activity logs are processed every 10 seconds using cron.

## Caching
### In-memory cache is applied to:
GET /teams/:teamId/tasks
Cache invalidates on task create/update/move/delete.


# MongoDB Schema

```md
# MongoDB Schema

## User
- email: String (unique)
- password: String
- createdAt
- updatedAt

## Team
- name: String
- createdBy: ObjectId (User)
- members: [ObjectId(User)]
- createdAt
- updatedAt

## Task
- teamId: ObjectId (Team)
- title: String
- description: String
- assignedTo: ObjectId (User)
- status: TODO | DOING | DONE
- comments: [{ text, createdBy, createdAt }]
- createdAt
- updatedAt

## Activity
- taskId: ObjectId (Task)
- action: CREATED | UPDATED | MOVED | ASSIGNED
- userId: ObjectId (User)
- timestamp
```

# Architecture Notes

## Authentication
JWT-based authentication using middleware to protect routes.

## Authorization
- Only team creators can manage members.
- Only team members can access tasks.

## Caching Strategy
Cache-aside pattern using in-memory NodeCache.
- Key format: tasks:{teamId}:{page}:{limit}:{search}:{assignedTo}
- TTL: 60 seconds
- Invalidated on task create/update/move/delete.

## Background Jobs
Activity events are queued in memory and processed by a cron worker every 10 seconds.
Worker inserts logs into MongoDB activity_logs collection.

## Rate Limiting
Applied using express-rate-limit:
- /login → 5 requests / 15 min
- /api/activities → 10 requests / 15 min

## Error Handling
Standard HTTP status codes with JSON responses.

## 👨‍💻 Author

### Inderjeet Singh
### Full-Stack Developer (MERN)
- GitHub: https://github.com/indxr1904
- LinkedIn: https://linkedin.com/in/inderjeet-singh-b71505250

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.

**Made with ❤️ to support coding community**

**Happy Coding! 🎉**
