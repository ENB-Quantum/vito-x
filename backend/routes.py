from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from .models import Task, User
from . import db
from datetime import datetime

# Using a Blueprint for better organization
bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    if current_user.is_authenticated:
        if current_user.is_admin:
            return redirect(url_for('main.admin_dashboard'))
        else:
            return redirect(url_for('main.employee_dashboard'))
    return redirect(url_for('auth.login'))

@bp.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        flash('Access denied: Admins only.', 'danger')
        return redirect(url_for('main.employee_dashboard'))

    tasks = Task.query.all()
    employees = User.query.filter_by(is_admin=False).all()
    return render_template('admin_dashboard.html', tasks=tasks, employees=employees, title="Admin Dashboard")

@bp.route('/admin/manage_users')
@login_required
def admin_manage_users():
    if not current_user.is_admin:
        flash('Access denied: Admins only.', 'danger')
        return redirect(url_for('main.index'))

    pending_users = User.query.filter_by(is_approved=False, is_admin=False).all()
    approved_users = User.query.filter_by(is_approved=True, is_admin=False).all()
    return render_template('admin_manage_users.html', pending_users=pending_users, approved_users=approved_users, title="Manage Users")

@bp.route('/admin/approve_user/<int:user_id>', methods=['POST'])
@login_required
def approve_user(user_id):
    if not current_user.is_admin:
        flash('Access denied.', 'danger')
        return redirect(url_for('main.index'))
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        flash('Cannot change approval status of an admin.', 'warning')
        return redirect(url_for('main.admin_manage_users'))
    user.is_approved = True
    db.session.commit()
    flash(f'User {user.username} approved.', 'success')
    return redirect(url_for('main.admin_manage_users'))

@bp.route('/admin/reject_user/<int:user_id>', methods=['POST'])
@login_required
def reject_user(user_id):
    # For now, rejecting means deleting the user if they were never approved.
    # Or simply marking them as not approved if they were previously.
    # A more robust system might move them to a 'rejected_users' table or similar.
    if not current_user.is_admin:
        flash('Access denied.', 'danger')
        return redirect(url_for('main.index'))
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        flash('Cannot reject an admin.', 'warning')
        return redirect(url_for('main.admin_manage_users'))

    if not user.is_approved: # If they were pending, and are rejected, we can delete them.
        # Or, simply set is_approved to False (if we want to keep their record but inactive)
        # For simplicity here, let's assume rejection of a pending user means removal.
        # Consider implications: what if they try to register again?
        # A softer approach: user.is_approved = False; user.is_active = False (add is_active field)
        flash(f'User {user.username} was pending and has been marked as not approved. Consider deleting if necessary.', 'info')
        user.is_approved = False # Explicitly set to false
        # db.session.delete(user) # Uncomment to delete
    else: # If they were approved and admin is 'rejecting' (deactivating)
        user.is_approved = False
        flash(f'User {user.username} access revoked.', 'success')

    db.session.commit()
    return redirect(url_for('main.admin_manage_users'))


@bp.route('/admin/task/assign', methods=['GET', 'POST'])
@login_required
def admin_assign_task():
    if not current_user.is_admin:
        flash('Access denied.', 'danger')
        return redirect(url_for('main.index'))

    employees = User.query.filter_by(is_admin=False, is_approved=True).all()

    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        assigned_to_id = request.form.get('assigned_to_id')
        completion_date_str = request.form.get('completion_date') # Expected format: YYYY-MM-DD

        if not all([title, assigned_to_id, completion_date_str]):
            flash('Title, assigned employee, and completion date are required.', 'danger')
        else:
            try:
                completion_date = datetime.strptime(completion_date_str, '%Y-%m-%d')
                # Optionally add time if your input type is datetime-local
                # completion_date = datetime.strptime(completion_date_str, '%Y-%m-%dT%H:%M')

                new_task = Task(
                    title=title,
                    description=description,
                    assigned_to_id=int(assigned_to_id),
                    assigned_by_id=current_user.id,
                    completion_date=completion_date,
                    status='Pending'
                )
                db.session.add(new_task)
                db.session.commit()
                flash('Task assigned successfully!', 'success')
                return redirect(url_for('main.admin_dashboard'))
            except ValueError:
                flash('Invalid date format for completion date. Use YYYY-MM-DD.', 'danger')
            except Exception as e:
                db.session.rollback()
                flash(f'Error assigning task: {e}', 'danger')

    return render_template('admin_assign_task.html', employees=employees, title="Assign Task")

@bp.route('/employee/dashboard')
@login_required
def employee_dashboard():
    if current_user.is_admin:
        # Admin should go to admin dashboard
        return redirect(url_for('main.admin_dashboard'))
    if not current_user.is_approved:
        flash('Your account is not yet approved. Please contact an administrator.', 'warning')
        # Log out the user or redirect to a pending approval page
        return redirect(url_for('auth.logout'))

    tasks = Task.query.filter_by(assigned_to_id=current_user.id).order_by(Task.completion_date.asc()).all()
    return render_template('employee_dashboard.html', tasks=tasks, title="My Tasks")

@bp.route('/task/update_status/<int:task_id>', methods=['POST'])
@login_required
def update_task_status(task_id):
    task = Task.query.get_or_404(task_id)
    if task.assigned_to_id != current_user.id and not current_user.is_admin:
        flash('You are not authorized to update this task.', 'danger')
        return redirect(url_for('main.employee_dashboard'))

    new_status = request.form.get('status')
    if new_status not in ['Pending', 'In Progress', 'Completed']:
        flash('Invalid status.', 'danger')
    else:
        task.status = new_status
        db.session.commit()
        flash('Task status updated.', 'success')

    if current_user.is_admin:
        return redirect(url_for('main.admin_dashboard'))
    return redirect(url_for('main.employee_dashboard'))

# Placeholder for deleting a task - only admin
@bp.route('/admin/task/delete/<int:task_id>', methods=['POST'])
@login_required
def delete_task(task_id):
    if not current_user.is_admin:
        flash('Access denied.', 'danger')
        return redirect(url_for('main.index'))

    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    flash('Task deleted successfully.', 'success')
    return redirect(url_for('main.admin_dashboard'))
