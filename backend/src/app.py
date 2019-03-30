from flask import Flask, request
from main import main

app = Flask(__name__)

@app.route('/query')
def get_query():
    location = request.args.get('location')
    return main(location)

if __name__ == "__main__":
    app.run()