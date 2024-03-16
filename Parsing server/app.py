from flask import Flask, request
from flask_cors import CORS
import json

from ImageScreenshotParser import parse_images
from dotenv import load_dotenv
from roboflow import Roboflow
from ParsePDF import parsePdf
import os

load_dotenv()
app = Flask(__name__)
CORS(app) 

# UPLOAD_DIR = 'C:/Tally/New folder/Tally Log/2023-10-09-ESS2/uploads'
UPLOAD_DIR = os.environ.get("UPLOAD_DIR")
ROBOFLOW_API_KEY = os.environ.get("ROBOFLOW_API_KEY")
ROBOFLOW_MODEL_NAME = os.environ.get("ROBOFLOW_MODEL_NAME")

#initialize roboflow detection model
rf = Roboflow(api_key=ROBOFLOW_API_KEY)
project = rf.workspace().project(ROBOFLOW_MODEL_NAME)
model = project.version(3).model


@app.errorhandler(Exception)
def handle_error(e):
    error_message = "An error occurred: {}".format(str(e))
    return json.dumps({'error': error_message}), 500

#parse images and screenshots
@app.route('/parse-image', methods=['POST'])
def parse_image():
    try:
        fileUrl = request.form['fileUrl']
        
        file_path = UPLOAD_DIR + '/' + fileUrl
        print(file_path)
        result = parse_images(file_path,model)
        return result  
    except Exception as e:
        raise
#parse pdf receipts
@app.route('/parse-pdf', methods=['POST'])
def parse_pdf():
    try:
        fileUrl = request.form['fileUrl']
        
        file_path = UPLOAD_DIR + '/' + fileUrl
        print('here'+file_path)

        #get text from pdf and pass to parsers based on the aggregator
        result = parsePdf(file_path)
        print(result)
        return result
    except Exception as e:
        raise

# @app.route('/test', methods=['GET'])
# def test():
#     return parseScreenshot("./rapido-ss-1_jpg.rf.ea453942ca2eea783b10b2a18614b271.jpg",model)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
