# This file makes the 'backend' directory a Python package.
# It can also be used for application factory setup in Flask.

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    # Adjust template_folder and static_folder to point to the frontend directory
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder='../frontend/templates',
        static_folder='../frontend/static'
    )

    # Configuration
    # Load default config
    app.config.from_mapping(
        SECRET_KEY='dev', # Change this in production!
        SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(app.instance_path, 'app.db'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass # Already exists

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login' # Route for login page

    # Import and register blueprints
    from . import routes
    from . import auth
    from . import models # Ensure models are loaded for db creation

    app.register_blueprint(routes.bp)
    app.register_blueprint(auth.auth_bp) # Corrected blueprint registration

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all() # Creates tables from SQLAlchemy models

    @login_manager.user_loader
    def load_user(user_id):
        # Import here to avoid circular dependency
        from .models import User
        return User.query.get(int(user_id))

    # Context processor to inject variables into all templates
    @app.context_processor
    def inject_current_year():
        from datetime import datetime
        return {'get_current_year': datetime.utcnow().year}

    return app
