---
sidebar_position: 50
sidebar_label : "Flask"
---

# Flask

![Flask](img/flask.png)

Flask is a popular web framework for Python that allows developers to create web applications quickly and easily. Flask is based on the Werkzeug toolkit and the Jinja2 template engine, which provide a flexible and powerful foundation for building web applications. Flask also supports extensions that can add functionality such as database integration, authentication, testing, and more. Flask is designed to be lightweight and modular, so developers can choose the components they need for their project. Flask is also known for its simplicity and elegance, as it follows the principle of "one way to do it" and avoids unnecessary complexity.

Flask is a lightweight and powerful web framework for Python. It allows developers to build web applications quickly and efficiently. Follow these steps to install Flask and create a simple application:

## Installation:

1.  **Prerequisites:**
    
    -   Python installed on your system (preferably Python 3.x).
    -   Pip, the package manager for Python.
2.  **Install Flask:** Open your terminal or command prompt and use pip to install Flask:
    
    Copy code
    
    `pip install flask` 
    

## Create a Simple Flask Application:

**Hello World:** Create a new Python file (e.g., `app.py`) and add the following code:
    
    ```python
    
    `from flask import Flask
    
    app = Flask(__name__)
    
    @app.route('/')
    def hello():
        return 'Hello, World!'
    
    if __name__ == '__main__':
        app.run(debug=True)` 
    ```
     
**Run the Application:** In the terminal, navigate to the directory containing your `app.py` file and run the following command:
  

    `python app.py` 
    
This will start a local development server. You should see output indicating that Flask is running on `http://127.0.0.1:5000/` (or `http://localhost:5000/`).
    
**Access the App:** Open a web browser and navigate to `http://127.0.0.1:5000/` or `http://localhost:5000/`. You should see "Hello, World!" displayed in the browser.
    

### Explaining the Code:

-   `from flask import Flask`: Import the Flask class to create an application.
-   `app = Flask(__name__)`: Create an instance of the Flask class.
-   `@app.route('/')`: Use the `@app.route()` decorator to define a route. In this case, the root URL (`'/'`) triggers the `hello()` function.
-   `def hello():`: This function returns the "Hello, World!" message.
-   `if __name__ == '__main__':`: Ensure the app only runs if the script is executed directly (not imported as a module).
