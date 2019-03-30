from flask import Flask, request, jsonify
from main import main
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/query')
@cross_origin()
def get_query():
    location = request.args.get('location')
    return_data = main(location)
    return jsonify(return_data)


if __name__ == "__main__":
    app.run()