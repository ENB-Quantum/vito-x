import unittest
from backend import create_app, db
from backend.models import User, Task
from datetime import datetime, timedelta

class TaskTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config.from_mapping(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:',
            WTF_CSRF_ENABLED=False,
            LOGIN_DISABLED=False, # Make sure login is enabled for testing protected routes
            SECRET_KEY='test-secret-key'
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            # Create users: one admin, one employee
            self.admin_user = User(username='testadmin', email='admin@test.com', is_admin=True, is_approved=True)
            self.admin_user.set_password('adminpass')

            self.employee_user = User(username='testemployee', email='employee@test.com', is_admin=False, is_approved=True)
            self.employee_user.set_password('emppass')

            db.session.add_all([self.admin_user, self.employee_user])
            db.session.commit()

            # Retrieve users with IDs for task assignment
            self.admin_user = User.query.filter_by(email='admin@test.com').first()
            self.employee_user = User.query.filter_by(email='employee@test.com').first()


    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def _login(self, email, password):
        return self.client.post('/auth/login', data=dict(
            email=email,
            password=password
        ), follow_redirects=True)

    def test_admin_can_access_assign_task_page(self):
        self._login('admin@test.com', 'adminpass')
        response = self.client.get('/admin/task/assign')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Assign New Task', response.data)

    def test_employee_cannot_access_assign_task_page(self):
        self._login('employee@test.com', 'emppass')
        response = self.client.get('/admin/task/assign', follow_redirects=True)
        self.assertEqual(response.status_code, 200) # Redirects
        self.assertIn(b'Access denied', response.data) # Flash message
        self.assertIn(b'My Tasks', response.data) # Should be on employee dashboard

    def test_admin_can_assign_task(self):
        self._login('admin@test.com', 'adminpass')
        completion_date = (datetime.utcnow() + timedelta(days=7)).strftime('%Y-%m-%d')

        response = self.client.post('/admin/task/assign', data={
            'title': 'Test Task Alpha',
            'description': 'This is a test task description.',
            'assigned_to_id': self.employee_user.id,
            'completion_date': completion_date
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task assigned successfully!', response.data)
        self.assertIn(b'Admin Dashboard', response.data) # Redirects to admin dashboard

        with self.app.app_context():
            task = Task.query.filter_by(title='Test Task Alpha').first()
            self.assertIsNotNone(task)
            self.assertEqual(task.assigned_to_id, self.employee_user.id)
            self.assertEqual(task.assigned_by_id, self.admin_user.id)
            self.assertEqual(task.status, 'Pending')

    def test_employee_can_view_assigned_tasks(self):
        # Admin assigns a task first
        with self.app.app_context():
            task1 = Task(title='Task for Employee 1', assigned_to_id=self.employee_user.id, assigned_by_id=self.admin_user.id, completion_date=datetime.utcnow() + timedelta(days=5))
            task2 = Task(title='Task for Employee 2', assigned_to_id=self.employee_user.id, assigned_by_id=self.admin_user.id, completion_date=datetime.utcnow() + timedelta(days=10))
            db.session.add_all([task1, task2])
            db.session.commit()

        self._login('employee@test.com', 'emppass')
        response = self.client.get('/employee/dashboard')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task for Employee 1', response.data)
        self.assertIn(b'Task for Employee 2', response.data)
        self.assertIn(b'My Tasks', response.data)

    def test_employee_can_update_task_status(self):
        # Admin assigns a task
        with self.app.app_context():
            task = Task(title='Task to Update', assigned_to_id=self.employee_user.id, assigned_by_id=self.admin_user.id, completion_date=datetime.utcnow() + timedelta(days=3))
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        self._login('employee@test.com', 'emppass')
        response = self.client.post(f'/task/update_status/{task_id}', data={
            'status': 'In Progress'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task status updated.', response.data)
        self.assertIn(b'My Tasks', response.data) # Back to employee dash

        with self.app.app_context():
            updated_task = Task.query.get(task_id)
            self.assertEqual(updated_task.status, 'In Progress')

    def test_admin_can_update_task_status_from_dashboard(self):
        with self.app.app_context():
            task = Task(title='Admin Update Task', assigned_to_id=self.employee_user.id, assigned_by_id=self.admin_user.id, completion_date=datetime.utcnow() + timedelta(days=3))
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        self._login('admin@test.com', 'adminpass')
        response = self.client.post(f'/task/update_status/{task_id}', data={
            'status': 'Completed'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task status updated.', response.data)
        self.assertIn(b'Admin Dashboard', response.data)

        with self.app.app_context():
            updated_task = Task.query.get(task_id)
            self.assertEqual(updated_task.status, 'Completed')

    def test_admin_can_delete_task(self):
        with self.app.app_context():
            task_to_delete = Task(title='Task To Delete', assigned_to_id=self.employee_user.id, assigned_by_id=self.admin_user.id, completion_date=datetime.utcnow() + timedelta(days=1))
            db.session.add(task_to_delete)
            db.session.commit()
            task_id = task_to_delete.id
            self.assertIsNotNone(Task.query.get(task_id))


        self._login('admin@test.com', 'adminpass')
        response = self.client.post(f'/admin/task/delete/{task_id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Task deleted successfully.', response.data)
        self.assertIn(b'Admin Dashboard', response.data)

        with self.app.app_context():
            deleted_task = Task.query.get(task_id)
            self.assertIsNone(deleted_task)

if __name__ == '__main__':
    unittest.main()
