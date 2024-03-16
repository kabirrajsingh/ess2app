import easyocr
from PIL import Image
from ExtractFunctions import get_distance,identify_dates
import json
import re

#extract the numeric value from string of types Distance1.5km, Expense₹100, etc
def extract_numeric_value(string):
    numeric_value = re.findall(r'\d+\.?\d*', string)
    if numeric_value:
        numeric_str = numeric_value[0]
        
        # Check if the string does not contain '?' or '₹'
        if '?' not in string and '₹' not in string:
            # Check if the first digit is 2 or 7 and drop it
            if numeric_str[0] in ['2', '7','8']:
                numeric_str = numeric_str[1:]
        
        return float(numeric_str)  # Convert the modified string to a float
    else:
        return None  # Return None if no numeric value is found
    
#extract the details from the image using the model
def extract_details(image_path, model):
    predictions = model.predict(image_path, confidence = 15, overlap = 30).json()
    reader = easyocr.Reader(['en'], gpu = True)
    classnames = {
        "date" : "",
        "distance" : "",
        "expense" : "",
        "from" : "",
        "to" : "",
        "mode_of_pay" : ""
    }

    for predictNo in predictions['predictions']:
        classname = predictNo['class']
        if classnames[classname] == "":
            x1, y1 = (predictNo['x'] - predictNo['width']/2), (predictNo['y'] - predictNo['height']/2)
            x2, y2 = (predictNo['x'] + predictNo['width']/2), (predictNo['y'] + predictNo['height']/2)
            image = Image.open(image_path)
            imagecreated = image.crop((x1, y1, x2, y2)).save("croppedimage.png")
            classnames[classname] = reader.readtext("croppedimage.png", detail = 0)
            classnames[classname] = ' '.join(classnames[classname])
    
    return classnames

#parse the image and return the json
def parse_images(filepath,model):
    result_dict = extract_details(filepath, model)
    print(result_dict)
    data_dict = {
        "DateOfTravel": identify_dates(result_dict["date"]),
        "FromPlace": result_dict["from"],
        "ToPlace": result_dict["to"],
        "DistanceTraveled": extract_numeric_value(result_dict["distance"].replace(' ','')),
        "ExpensesIncurred": extract_numeric_value(result_dict["expense"].replace(' ','')),
        "PaymentMode": result_dict["mode_of_pay"],
        "TravelMode": "cab"
    }
    print(data_dict)
    return json.dumps(data_dict, indent = 2)

