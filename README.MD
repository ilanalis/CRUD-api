### SIMPLE CRUD API

This is a training project from [RS School](https://rs.school/) that requires implementing a simple CRUD application.
This is a simple backend application that lets you create, read, update, and delete users. The project was made as part of the RS School training and helps to understand how basic server logic works — handling requests, sending responses, and working with data in memory.

### Objectives

- Build a simple RESTful API using Node.js without frameworks

- Implement basic CRUD operations (Create, Read, Update, Delete) for users

- Handle requests and responses manually

- Practice working with HTTP methods and status codes

- Strengthen understanding of backend architecture fundamentals

### Stack

Node.js – JavaScript runtime for building the server

TypeScript – A strongly typed language that builds on JavaScript

ts-node – Runs TypeScript files directly without precompilation

dotenv – Loads environment variables from a .env file

### Getting Started

1. Install dependencies

```
npm install
```

2. Set environment variables:

- Rename the .env.example file to .env.
- Fill out the necessary environment variables in the .env file based on the provided examples.

3. Run dev server

```
npm run start:dev
```

4. Run prod server

```
npm run start:prod
```

### Using the Application

The server listens on a port defined in the .env file (e.g., http://localhost:4000). You can interact with the API using tools like Postman or curl.

#### Available Endpoints:

- GET /api/users – Get all users

- GET /api/users/:id – Get a user by ID

- POST /api/users – Create a new user

- PUT /api/users/:id – Update a user by ID

- DELETE /api/users/:id – Delete a user by ID

Request body format for POST and PUT:

```
{
  "username": "John Doe",
  "age": 30,
  "hobbies": ["reading", "gaming"]
}
```

The application stores data in memory, so data will reset after the server restarts.
