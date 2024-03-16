import easyocr
from dateutil import parser
import re


def identify_dates(words_list):
    detected_dates = []
    for word in words_list:
        # Apply the date pattern to each word
          date_patterns = re.findall(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', word)

          for pattern in date_patterns:
              try:
                  date_obj = parser.parse(pattern, fuzzy=True, dayfirst=True)
                  detected_dates.append(date_obj.strftime('%Y-%m-%d'))  
              except ValueError:
                  pass  
              except OverflowError:
                  print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")

    if not detected_dates:
        for word in words_list:
              try:
                  date_obj = parser.parse(word, fuzzy=True)
                  detected_dates.append(date_obj.strftime('%Y-%m-%d'))  
              except ValueError:
               
                  pass
              except OverflowError:
                  print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")
    return detected_dates


def extract_locations(text_list):
    start_location = None
    end_location = None

    for i, text in enumerate(text_list):

        upper_text = text.upper()
        # Remove ':' from the end of the string
        cleaned_text = re.sub(r':\s*$', '', text)

        # Check for FROM keywords
        from_match = re.search(r'\b(?:FROM|FRM)\b', upper_text)
        if from_match:
       
            from_indices = [m.start() for m in re.finditer(r'\b(?:FROM|FRM)\b', upper_text)]
            for index in from_indices:
              
                if ':' in cleaned_text[index + from_match.end():]:
      
                    start_location = cleaned_text[index + from_match.end() + 1:].lstrip()
                else:
             
                    start_location = cleaned_text[index + from_match.end():].lstrip()

        # Check for TO keywords
        to_match = re.search(r'\bTO\b', upper_text)
        if to_match:
       
            to_indices = [m.start() for m in re.finditer(r'\bTO\b', upper_text)]
            for index in to_indices:
             
                if ':' in cleaned_text[index + to_match.end():]:
               
                    end_location = cleaned_text[index + to_match.end() + 1:].lstrip()
                else:
                    
                    end_location = cleaned_text[index + to_match.end():].lstrip()

    # If start location is still None, take the word before 'TO' as the start place
    if start_location is None and end_location is not None:
        start_location = re.search(r'\b(\S+)\s+TO\b', ' '.join(text_list[:i])).group(1) if i > 0 else None

    return start_location, end_location

def extract_distance(text_list):
    distance = None

    for text in text_list:

        upper_text = text.upper()

        # Check for distance keywords
        distance_match = re.search(r'\b(?:DISTANCE|KMS|KM?)\b', upper_text)
        if distance_match:

                distance = text_list[text_list.index(text) + 1].lstrip() if text_list.index(text) + 1 < len(text_list) else text[distance_match.end():].strip()

    # If distance is still None, check for numbers after distance-related keywords
    if distance is None:
        for text in text_list:
           
            upper_text = text.upper()

            # Check for distance-related keywords
            distance_related_match = re.search(r'\b(?:DISTANCE|KMS|KM?)\b', upper_text)
            if distance_related_match:
                # Find the number after the keyword
                number_match = re.search(r'\b(\d+)\b', text_list[text_list.index(text) + 1])
                distance = number_match.group(1) if number_match else None

                if distance:
                    # Check if 'KMS' or 'KM' comes after the distance
                    if 'KMS' in text_list[text_list.index(text) + 1].upper():
                        distance += ' KMS'
                    elif 'KM' in text_list[text_list.index(text) + 1].upper():
                        distance += ' KM'

    return distance


def extract_total_amount(text_list):
    total_amount = None

    for i, text in enumerate(text_list):

        upper_text = text.upper()

   
        #total_amount_match = re.search(r'\b(?:RS\s*[:=]|FARE\s*[:=]|AMOUNT\s*[:=]|RS\s*₹)\s*([0-9,.]+)\b', upper_text)
        total_amount_match = re.search(r'\b(?:RS\s*[:=]|FARE\s*[:=]|AMOUNT\s*[:=]|RS\s*[₹*])\s*([0-9,.]+)\b', upper_text)

        if total_amount_match:
            # Extract the numeric part after the keyword
            total_amount = total_amount_match.group(1)

            # Check if there is a word after "RS" or "₹"
            next_word = text_list[i].strip() if i + 1 < len(text_list) else None

            # Set total_amount to the next word if it exists
            if next_word:
                total_amount = next_word
        if not total_amount and '*' in text:
            
            total_amount = text.split('*')[-1].strip()
            break 

    return total_amount

def extract_TravelMode(words_list):
    flight_terms = {'flight', 'airplane', 'airline', 'airport'}
    bus_auto_terms = {'bus', 'auto', 'car', 'transport', 'vehicle'}

    words_lower = [word.lower() for word in words_list]

    contains_flight = any(term in words_lower for term in flight_terms)

    # Check for bus/auto-related terms including compound terms
    contains_bus_auto = any(
        term in words_lower or any(sub_term in term for sub_term in bus_auto_terms) 
        for term in words_lower
    )

    if contains_flight:
        return 'flight'
    elif contains_bus_auto:
        return 'bus/auto'
    else:
        return None

def parseImage(img_path):
    reader = easyocr.Reader(['en'], gpu = True)
    results = reader.readtext(img_path, detail = 0)

    detected_dates= identify_dates(results)
    start,end = extract_locations(results)
    distance = extract_distance(results)
    amount = extract_total_amount(results)
    travelMode = extract_TravelMode(results)

    data_dict = {
    "DateOfTravel": detected_dates,
    "FromPlace": start.capitalize(),
    "ToPlace": end.capitalize(),
    "TravelMode": travelMode,
    "DistanceTraveled": distance,
    "ExpensesIncurred": amount,
    }

    return data_dict





