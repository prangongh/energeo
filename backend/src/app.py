from flask import Flask, request, jsonify
from main import main

app = Flask(__name__)

@app.route('/query')
def get_query():
    location = request.args.get('location')
    return_data = main(location)
    return jsonify(return_data)


if __name__ == "__main__":
    app.run()