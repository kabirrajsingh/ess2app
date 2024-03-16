import re
import json
from dateutil import parser

def get_distance(word):
    checkUnit = re.search("(kilometers|kilometres|meters|metres|kms|km|miles)(.*?)", word) #.group() if re.search("(kilometers|kilometres|meters|metres|kms|km|miles)(.*?)(min)", word) else None
    if checkUnit != None:
        extractDist = re.split(r'\b(km|kms|miles)\b', word, flags=re.IGNORECASE)
        distance = re.search("(\d+(\.\d+)?)", str(extractDist[0]))
        if distance != None:
            distance = distance.group()
        return distance
    return None

def check_Possible_Date(word):
  days = re.compile("(Mon|Tues|Wed|Thurs|Fri|Sat|Sun).", re.IGNORECASE)
  months = re.compile("(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sept|Sep|September|Oct|October|Nov|November|Dec|December).", re.IGNORECASE)
  if re.search(days, word) != None or re.search(months, word) != None:
    return word
  else:
    return False

def identify_dates(word):
    detected_dates = []

    date_patterns = re.findall(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', word)

    for pattern in date_patterns:
        try:
            date_obj = parser.parse(pattern, fuzzy=True, dayfirst=True)
            detected_dates.append(date_obj.strftime('%Y-%m-%d'))  # Change the format as needed
        except ValueError:
            pass  # Ignore errors for strings that are not valid dates
        except OverflowError:
            print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")

    if not detected_dates:
              try:
                  date_obj = parser.parse(word, fuzzy=True)
                  detected_dates.append(date_obj.strftime('%Y-%m-%d'))  # Change the format as needed
              except ValueError:
                  # Ignore errors for strings that are not dates
                  pass
              except OverflowError:
                  print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")
    return detected_dates

#preprocess the list of tokens extracted from the pdf
def normalize_and_remove_duplicates(lst):
  finallst = []
  resultlst = []
  
  for i in range(len(lst)):
      lst[i] = str(lst[i]).replace("\ue000", " ")
      newsplit = re.split(r'\n|\xa0', lst[i])
      
      for j in newsplit:
          if j not in finallst:
              finallst.append(j)

  for i in range(len(finallst) - 2):
      finallst[i] = finallst[i].strip()
      if finallst[i] not in finallst[i + 1] and finallst[i] not in finallst[i + 2]:
          resultlst.append(finallst[i])
  if finallst[len(finallst) - 2] not in finallst[len(finallst) - 1]:
      resultlst.append(finallst[len(finallst) - 2])
  resultlst.append(finallst[len(finallst) - 1])
  
  return resultlst

def remove_unicode_chars(input_str):
    result_str = ''.join(char for char in input_str if char.isalnum() or char == '.')
    print(result_str)
    return result_str

def get_json( date, startaddress, endaddress, distancetravelled, totalamount, modeofpayment):  
  
    startaddress = startaddress.replace('\n',' ')
    endaddress = endaddress.replace('\n',' ')
    totalamount = ''.join([i for i in totalamount if i.isalnum() or i == '.'])
    data_dict = {
        "DateOfTravel": date,
        "FromPlace": startaddress,
        "ToPlace": endaddress,
        "DistanceTraveled": distancetravelled.replace(' ',''),
        "ExpensesIncurred": totalamount.replace(' ',''),
        "PaymentMode": modeofpayment,
        "TravelMode": "cab",
    }
    # Convert the dictionary to a JSON string
    json_data = json.dumps(data_dict, indent = 2)  # Optional: Use indent for pretty formatting

    # Print or save the JSON string
    return json_data




