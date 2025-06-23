from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash # Already in models, but good for explicitness
from .models import User
from . import db, login_manager

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index')) # Redirect to main page if already logged in

    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        is_admin_checkbox = request.form.get('is_admin') # This is for initial admin setup, normally not user-settable

        if not all([username, email, password, confirm_password]):
            flash('All fields are required.', 'danger')
            return redirect(url_for('auth.register'))

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return redirect(url_for('auth.register'))

        existing_user_email = User.query.filter_by(email=email).first()
        if existing_user_email:
            flash('Email address already registered.', 'warning')
            return redirect(url_for('auth.register'))

        existing_user_name = User.query.filter_by(username=username).first()
        if existing_user_name:
            flash('Username already taken.', 'warning')
            return redirect(url_for('auth.register'))

        # Determine if this is the very first user, and if so, make them an admin.
        # This is a simple way to bootstrap the first admin.
        # In a production system, you might have a CLI command or a separate admin creation interface.
        is_first_user = User.query.count() == 0

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        if is_first_user:
            new_user.is_admin = True
            new_user.is_approved = True # Admins are auto-approved
            flash_message = 'Admin account created successfully! Please log in.'
        elif is_admin_checkbox and User.query.filter_by(is_admin=True).count() == 0:
             # Allow creating admin if checkbox is checked AND no admin exists
            new_user.is_admin = True
            new_user.is_approved = True
            flash_message = 'Admin account created successfully! Please log in.'
        else:
            new_user.is_admin = False
            new_user.is_approved = False # Employees need admin approval
            flash_message = 'Registration successful! Your account is pending admin approval.'

        try:
            db.session.add(new_user)
            db.session.commit()
            flash(flash_message, 'success')
            return redirect(url_for('auth.login'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error during registration: {e}', 'danger')
            return redirect(url_for('auth.register'))

    return render_template('register.html', title="Register")


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False

        if not email or not password:
            flash('Email and password are required.', 'danger')
            return redirect(url_for('auth.login'))

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            flash('Invalid email or password. Please try again.', 'danger')
            return redirect(url_for('auth.login'))

        if not user.is_admin and not user.is_approved:
            flash('Your account is not yet approved by an administrator.', 'warning')
            return redirect(url_for('auth.login'))

        login_user(user, remember=remember)
        flash('Logged in successfully!', 'success')

        # Redirect to appropriate dashboard
        if user.is_admin:
            next_page = request.args.get('next') # For redirecting after login_required
            return redirect(next_page or url_for('main.admin_dashboard'))
        else:
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.employee_dashboard'))

    return render_template('login.html', title="Login")

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', 'info')
    return redirect(url_for('auth.login'))

# Alias auth_bp to bp for registration in __init__.py (if needed, but current setup is fine)
# This was a note from plan, current setup in __init__.py registers auth.bp directly.
# from . import auth as auth_blueprint
# app.register_blueprint(auth_blueprint)
# Is correct.Tool output for `create_file_with_block`:
