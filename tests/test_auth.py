import unittest
from backend import create_app, db
from backend.models import User
from werkzeug.security import generate_password_hash

class AuthTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config.from_mapping(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:', # Use in-memory SQLite for tests
            WTF_CSRF_ENABLED=False, # Disable CSRF for testing forms if you use Flask-WTF
            LOGIN_DISABLED=False, # Ensure login is not disabled globally for tests
            SECRET_KEY='test-secret-key'
        )
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            # You might want to create a default admin user or other users for testing
            # For example:
            # admin = User(username='testadmin', email='admin@example.com', is_admin=True, is_approved=True)
            # admin.set_password('adminpass')
            # db.session.add(admin)
            # db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register_page(self):
        response = self.client.get('/auth/register')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Register', response.data)

    def test_login_page(self):
        response = self.client.get('/auth/login')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Login', response.data)

    def test_successful_registration_first_user_is_admin(self):
        with self.app.app_context():
            self.assertEqual(User.query.count(), 0) # Ensure no users exist

        response = self.client.post('/auth/register', data={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
            # 'is_admin' checkbox is implicitly handled by backend for first user
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200) # Should redirect to login
        self.assertIn(b'Admin account created successfully! Please log in.', response.data)

        with self.app.app_context():
            user = User.query.filter_by(email='test@example.com').first()
            self.assertIsNotNone(user)
            self.assertTrue(user.is_admin)
            self.assertTrue(user.is_approved)

    def test_successful_employee_registration(self):
        # Create an admin first
        with self.app.app_context():
            admin = User(username='admin', email='admin@example.com', is_admin=True, is_approved=True)
            admin.set_password('adminpass')
            db.session.add(admin)
            db.session.commit()

        response = self.client.post('/auth/register', data={
            'username': 'employee1',
            'email': 'emp1@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        }, follow_redirects=True)

        self.assertEqual(response.status_code, 200) # Should redirect to login
        self.assertIn(b'Registration successful! Your account is pending admin approval.', response.data)

        with self.app.app_context():
            user = User.query.filter_by(email='emp1@example.com').first()
            self.assertIsNotNone(user)
            self.assertFalse(user.is_admin)
            self.assertFalse(user.is_approved)

    def test_login_logout_approved_user(self):
        # Register and approve a user
        with self.app.app_context():
            user = User(username='approveduser', email='approved@example.com', is_approved=True)
            user.set_password('testpass')
            db.session.add(user)
            db.session.commit()

        # Login
        response_login = self.client.post('/auth/login', data={
            'email': 'approved@example.com',
            'password': 'testpass'
        }, follow_redirects=True)
        self.assertEqual(response_login.status_code, 200)
        self.assertIn(b'Logged in successfully!', response_login.data)
        self.assertIn(b'My Tasks', response_login.data) # Should go to employee dashboard

        # Check current_user is set (requires more direct testing or specific page content)
        # For example, access a protected route
        response_protected = self.client.get('/employee/dashboard', follow_redirects=True)
        self.assertIn(b'My Tasks', response_protected.data)
        self.assertNotIn(b'Admin Dashboard', response_protected.data)


        # Logout
        response_logout = self.client.get('/auth/logout', follow_redirects=True)
        self.assertEqual(response_logout.status_code, 200)
        self.assertIn(b'You have been logged out.', response_logout.data)
        self.assertIn(b'Login', response_logout.data) # Should be back on login page

    def test_login_unapproved_user(self):
        with self.app.app_context():
            user = User(username='unapproved', email='unapproved@example.com', is_approved=False)
            user.set_password('testpass')
            db.session.add(user)
            db.session.commit()

        response = self.client.post('/auth/login', data={
            'email': 'unapproved@example.com',
            'password': 'testpass'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200) # Stays on login page
        self.assertIn(b'Your account is not yet approved by an administrator.', response.data)
        self.assertIn(b'Login', response.data) # Should remain on login page or show login form

    def test_login_admin_user(self):
        with self.app.app_context():
            admin = User(username='adminlogin', email='adminlogin@example.com', is_admin=True, is_approved=True)
            admin.set_password('adminpass')
            db.session.add(admin)
            db.session.commit()

        response = self.client.post('/auth/login', data={
            'email': 'adminlogin@example.com',
            'password': 'adminpass'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Logged in successfully!', response.data)
        self.assertIn(b'Admin Dashboard', response.data) # Should go to admin dashboard


if __name__ == '__main__':
    unittest.main()
