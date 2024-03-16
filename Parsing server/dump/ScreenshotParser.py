import easyocr
from PIL import Image
from dump.DateExtractor import identify_dates
from ExtractFunctions import get_distance
import re

def checkTime(word):

  time_pattern = re.compile(r'^(0?[1-9]|1[0-9]|2[0-3]):[0-5][0-9]( (AM|PM|am|pm))?')

  if time_pattern.match(word):
      return True
  else:
      return False

def get_addresses(image_path,model):
    predictions = model.predict(image_path, confidence=40, overlap=30)

    
    reader = easyocr.Reader(['en'], gpu = True)

    image = Image.open(image_path)

    # Get the dimensions (width x height) of the image
    imagewidth, imageheight = image.size

    addresses = {
        "from" : "",
        "to" : ""
    }
    for predictNo in range(len(predictions)):
        classname = predictions[predictNo]["class"]
        if addresses[classname] == "":
            x1, y1 = 0, (predictions[predictNo]["y"] - predictions[predictNo]["height"]/2)
            x2, y2 = imagewidth, (predictions[predictNo]["y"] + predictions[predictNo]["height"]/2)
            image.crop((x1, y1, x2, y2)).save("croppedimage.jpg")
            addresses[classname] = reader.readtext("croppedimage.jpg", detail = 0)
            addresses[classname] = ' '.join(addresses[classname])

    return addresses


def parseScreenshot(image_path,model):
    addresses = get_addresses(image_path,model)
    
    data_dict = {
        "FromPlace": addresses["from"],
        "ToPlace": addresses["to"],
    }

    reader = easyocr.Reader(['en'], gpu = True)

    results = reader.readtext(image_path, detail = 0)

    print(results)

    date = ""
    expense = ""

    classnames = {
        "date" : "",
        "distance" : "",
        "expense" : "",
        "mode_of_pay" : ""
    }
    for phraseNum in range(len(results)):

        days = re.compile("(Mon|Tues|Wed|Thurs|Fri|Sat|Sun)", re.IGNORECASE)
        months = re.compile("(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)", re.IGNORECASE)
        distanceCheck = get_distance(results[phraseNum])
        expenseword = re.compile("(Amount|Payable)", re.IGNORECASE)
        paymodeprev = re.compile("(Paid by|Paid Using|Payment|Payments)", re.IGNORECASE)
        paymodedirect = re.compile("(Cash|UPI|Money|Debit Card|Credit Card)", re.IGNORECASE)

        if re.search(days, results[phraseNum]) and date == "":
            classnames["date"] = identify_dates(results[phraseNum])

        elif re.search(months, results[phraseNum]) and date == "":
            classnames["date"] = identify_dates(results[phraseNum])
            if re.search("Ride", results[phraseNum + 1]) != None: # or checkTime(results[phraseNum].split()[len(results[phraseNum]) - 1]) :
                classnames["expense"] = results[phraseNum + 1]

        elif distanceCheck != None:
            classnames["distance"] = distanceCheck

        elif re.search(expenseword, results[phraseNum]) != None and expense == "":
            classnames["expense"] = " " + results[phraseNum + 1][1:]

        elif re.search(paymodeprev, results[phraseNum]) != None:
            classnames["mode_of_pay"] = results[phraseNum + 1]

        elif re.search(paymodedirect, results[phraseNum]) != None:
            classnames["mode_of_pay"] = results[phraseNum]
    
    data_dict["DateOfTravel"] = classnames["date"]
    data_dict["DistanceTraveled"] = classnames["distance"].replace(" ", "")
    data_dict["ExpensesIncurred"] = classnames["expense"].replace(" ", "")
    print(data_dict)
    return data_dict

    