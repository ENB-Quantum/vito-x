# This file can be used as the entry point to run the Flask application,
# especially if not using the `flask run` command directly with an app factory.

from . import create_app

app = create_app()

if __name__ == '__main__':
    # Note: For development server only. Use a production WSGI server for deployment.
    app.run(debug=True)
