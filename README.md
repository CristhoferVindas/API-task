# API-task

# Task Manager API

The **Task Manager API** is a robust RESTful API that allows users to manage their tasks, projects, labels, and activity logs efficiently. This API is designed to handle common task management operations with secure user authentication and role-based access control. Below is a detailed guide to setting up, using, and understanding the API.

## 🚀 Features

- **User Management:** Create, read, update, and delete users.
- **Project Management:** Manage projects and link them to users.
- **Task Management:** Create tasks with priorities, statuses, and due dates.
- **Label Management:** Categorize tasks with labels.
- **Activity Log:** Track actions performed on the system.

## 🛠️ Setup and Installation

### Prerequisites

- Node.js
- MySQL
- Postman (optional, for API testing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DB_HOST=localhost
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=TaskManager
```

### Step 4: Initialize the Database

Use the provided SQL script to create the necessary tables:

```sql
-- Create the database
CREATE DATABASE TaskManager;
USE TaskManager;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    project_id INT,
    user_id INT,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Labels table
CREATE TABLE labels (
    label_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Tasks_Labels table for many-to-many relationship between tasks and labels
CREATE TABLE tasks_labels (
    task_id INT,
    label_id INT,
    PRIMARY KEY (task_id, label_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(label_id) ON DELETE CASCADE
);

-- Activity log table
CREATE TABLE activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    task_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

-- Insert a sample user
INSERT INTO users (name, email, password) 
VALUES ('Admin', 'admin@example.com', 'password123');

-- Insert a sample project
INSERT INTO projects (name, description, user_id) 
VALUES ('Initial Project', 'This is a sample project', 1);

-- Insert a sample task
INSERT INTO tasks (title, description, priority, status, project_id, user_id, due_date) 
VALUES ('Sample Task', 'Description of the sample task', 'High', 'Pending', 1, 1, '2025-01-31');

```

### Step 5: Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

## 📚 API Endpoints

### Users

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| POST   | `/users`     | Create a new user   |
| GET    | `/users`     | Get all users       |
| GET    | `/users/:id` | Get user by ID      |
| PUT    | `/users/:id` | Update user details |
| DELETE | `/users/:id` | Delete a user       |

### Projects

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | `/projects`     | Create a new project   |
| GET    | `/projects`     | Get all projects       |
| GET    | `/projects/:id` | Get project by ID      |
| PUT    | `/projects/:id` | Update project details |
| DELETE | `/projects/:id` | Delete a project       |

### Tasks

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| POST   | `/tasks`     | Create a new task   |
| GET    | `/tasks`     | Get all tasks       |
| GET    | `/tasks/:id` | Get task by ID      |
| PUT    | `/tasks/:id` | Update task details |
| DELETE | `/tasks/:id` | Delete a task       |

### Labels

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| POST   | `/labels`     | Create a new label   |
| GET    | `/labels`     | Get all labels       |
| GET    | `/labels/:id` | Get label by ID      |
| PUT    | `/labels/:id` | Update label details |
| DELETE | `/labels/:id` | Delete a label       |

### Activity Log

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/activity_log` | Get recent system actions |


## 🧪 Testing the API

You can test the API using tools like **Postman**. Below is a sample request to create a new user:

```bash
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```


## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

## 📧 Contact

For questions or support, please contact [vindaz4567@gmail.com].

