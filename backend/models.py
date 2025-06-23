from . import db # Import db instance from backend/__init__.py
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256)) # Increased length for stronger hashes
    is_admin = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False) # For employee approval
    registered_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    tasks_assigned = db.relationship('Task', foreign_keys='Task.assigned_to_id', backref='assignee', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    assigned_to_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Admin who assigned

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    assignment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    completion_date = db.Column(db.DateTime, nullable=True) # Deadline
    status = db.Column(db.String(50), default='Pending') # e.g., Pending, In Progress, Completed

    assigned_by = db.relationship('User', foreign_keys=[assigned_by_id], backref='created_tasks', lazy=True)

    def __repr__(self):
        return f'<Task {self.title}>'

# Potential future models:
# class RegistrationRequest(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     request_date = db.Column(db.DateTime, default=datetime.utcnow)
#     status = db.Column(db.String(20), default='pending') # pending, approved, rejected
#     user = db.relationship('User', backref='registration_request', uselist=False)

# For now, User.is_approved will handle this. If more complex workflow is needed,
# a separate RegistrationRequest model might be better.
