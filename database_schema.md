# Database Schema

This document outlines the database schema for the Task Management web application.
The application uses SQLAlchemy as an ORM.

## Table: `users`

Stores information about both administrators and employees.

| Column          | Type                               | Constraints                                     | Description                                         |
|-----------------|------------------------------------|-------------------------------------------------|-----------------------------------------------------|
| `id`            | Integer                            | PRIMARY KEY, Auto-increment                     | Unique identifier for the user.                     |
| `username`      | String(80)                         | UNIQUE, NOT NULL                                | User's chosen username.                             |
| `email`         | String(120)                        | UNIQUE, NOT NULL                                | User's email address, used for login.               |
| `password_hash` | String(256)                        | NOT NULL                                        | Hashed password for the user.                       |
| `is_admin`      | Boolean                            | Default: `False`                                | Flag indicating if the user is an administrator.    |
| `is_approved`   | Boolean                            | Default: `False`                                | Flag indicating if an employee's registration is approved by an admin. Admins are auto-approved. |
| `registered_on` | DateTime                           | NOT NULL, Default: `datetime.utcnow`            | Timestamp of when the user registered.              |

**Relationships:**
*   One-to-Many with `tasks` (as `assignee`): A user can be assigned many tasks.
*   One-to-Many with `tasks` (as `assigned_by`): An admin user can assign (create) many tasks.

## Table: `tasks`

Stores information about tasks assigned to employees.

| Column            | Type        | Constraints                          | Description                                        |
|-------------------|-------------|--------------------------------------|----------------------------------------------------|
| `id`              | Integer     | PRIMARY KEY, Auto-increment          | Unique identifier for the task.                    |
| `title`           | String(100) | NOT NULL                             | Title of the task.                                 |
| `description`     | Text        | Nullable                             | Detailed description of the task.                  |
| `assigned_to_id`  | Integer     | FOREIGN KEY (`users.id`), NOT NULL   | ID of the employee to whom the task is assigned.   |
| `assigned_by_id`  | Integer     | FOREIGN KEY (`users.id`), NOT NULL   | ID of the admin who assigned the task.             |
| `created_at`      | DateTime    | Default: `datetime.utcnow`           | Timestamp of when the task was created.            |
| `assignment_date` | DateTime    | NOT NULL, Default: `datetime.utcnow` | Date when the task was officially assigned.        |
| `completion_date` | DateTime    | Nullable                             | Deadline for task completion.                      |
| `status`          | String(50)  | Default: `'Pending'`                 | Current status of the task (e.g., 'Pending', 'In Progress', 'Completed'). |

**Relationships:**
*   Many-to-One with `users` (as `assignee`): Each task is assigned to one user.
*   Many-to-One with `users` (as `assigned_by`): Each task is created by one admin user.

## Notes:

*   **Password Hashing:** Passwords are not stored in plaintext. `werkzeug.security` is used for hashing and checking passwords.
*   **Timestamps:** `datetime.utcnow` is generally used for consistency across timezones, stored as UTC in the database.
*   **Flask-Login:** The `User` model includes `UserMixin` for integration with Flask-Login.
*   **Scalability:** For a larger application, consider:
    *   A separate `roles` table and a `user_roles` many-to-many link table if more complex roles than just "admin" and "employee" are needed.
    *   A dedicated `registration_requests` table if the approval process becomes more complex (e.g., storing reasons for rejection, approval history).
    *   Indexing on frequently queried columns (e.g., `users.email`, `tasks.assigned_to_id`, `tasks.status`).
