# Student Tracker App

A full-stack task management web application built using the MERN stack backend technologies.

This project helps students manage their daily study tasks, track deadlines, monitor progress, and organize work efficiently.

---

## Features

* User Signup and Login Authentication
* Secure Password Hashing using Passport.js
* Session Management with MongoDB Store
* Add New Tasks
* View All Tasks
* Separate Dashboard for Each User
* Start / Complete Tasks
* Delete Tasks
* Remaining Days Calculation
* Overdue Task Reminder Alerts
* Flash Messages for Success and Errors
* Protected Routes using Middleware
* Error Handling System
* Responsive Bootstrap UI

---

## Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* Passport.js
* passport-local
* passport-local-mongoose

### Other Packages

* express-session
* connect-mongo
* connect-flash
* ejs-mate
* dotenv

---

## Folder Structure

```bash
student_tracker/
│
├── models/
├── views/
├── public/
├── utils/
├── middleware.js
├── index.js
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/rushi-38/task-tracker.git
```

### Go Inside Project

```bash
cd task-tracker
```

### Install Dependencies

```bash
npm install
```

### Run Server

```bash
nodemon index.js
```

---

## Environment Variables

Create a `.env` file and add:

```env
ATLASDB_URL=your_mongodb_connection_url
SECRET=your_secret_key
```

---

## Main Functionalities

### Authentication

* Signup
* Login
* Logout
* Password Hashing and Salting

### Task Management

* Add Task
* Start Task
* Complete Task
* Delete Task
* View Task Details

### Security

* User-specific task visibility
* Route protection middleware
* Session-based authentication

---

## Future Improvements

* Email Reminder Notifications
* Task Categories
* Task Priority Levels
* Search and Filter Tasks
* Calendar Integration
* Dark Mode
* REST API Version
* React Frontend

---

## Learning Outcomes

Through this project I learned:

* Authentication using Passport.js
* Session Handling
* MongoDB Relationships
* Middleware Usage
* MVC Structure
* Error Handling
* CRUD Operations
* User Authorization
* Deployment Preparation

---

## Author

Rushikesh Yewale

GitHub:
https://github.com/rushi-38
