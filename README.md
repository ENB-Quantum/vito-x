# Web Application: Admin & Employee Task Management

This project is a web application designed for administrators to manage employees and assign tasks, and for employees to view and manage their assigned tasks.

## Features

*   **Admin Role:**
    *   Secure login.
    *   Approve/reject employee registrations.
    *   Assign tasks to employees with start and completion dates.
    *   Monitor task progress.
*   **Employee Role:**
    *   Secure registration (requires admin approval).
    *   Login.
    *   View assigned tasks and deadlines.
    *   Update task status.

## Technical Stack (Planned)

*   **Backend:** Python (Flask)
*   **Frontend:** HTML, CSS, JavaScript (using Flask's Jinja2 templating)
*   **Database:** SQLite (for development), PostgreSQL (for production - conceptual)
*   **Version Control:** Git

## Project Structure

```
/
├── backend/
│   ├── __init__.py          # Makes 'backend' a Python package
│   ├── app.py               # Main Flask application setup
│   ├── models.py            # Database models (SQLAlchemy)
│   ├── routes.py            # Application routes/views
│   ├── auth.py              # Authentication logic
│   ├── static/              # Backend static files (if any, rarely used with separate frontend)
│   └── templates/           # Backend templates (e.g. error pages, email templates)
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # Main CSS styles
│   │   └── js/
│   │       └── script.js    # Main JS scripts (if needed)
│   └── templates/
│       ├── layout.html          # Base HTML layout
│       ├── login.html           # Login page
│       ├── register.html        # Employee registration page
│       ├── admin_dashboard.html # Admin dashboard (task monitoring)
│       ├── employee_dashboard.html# Employee dashboard (view tasks)
│       ├── admin_manage_users.html # Admin page to manage users (approve/reject)
│       └── admin_assign_task.html # Admin page to assign tasks
├── tests/                   # Unit and integration tests
│   ├── __init__.py          # Makes 'tests' a Python package
│   ├── test_auth.py
│   └── test_tasks.py
├── instance/                # Instance folder for SQLite DB, config files (Flask specific)
├── requirements.txt         # Python dependencies
├── database_schema.md       # Description of database tables
└── README.md                # This file
```

## Setup and Run (Conceptual)

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Initialize the database (Flask-Migrate or custom script):**
    ```bash
    # export FLASK_APP=run.py (or your entry point)
    # flask db init
    # flask db migrate -m "Initial migration"
    # flask db upgrade
    ```
5.  **Create an initial admin user (if applicable, via a CLI command or script).**
6.  **Run the application:**
    ```bash
    # flask run
    ```
This file will be overwritten.
