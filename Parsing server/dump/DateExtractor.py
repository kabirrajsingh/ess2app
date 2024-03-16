import re
from dateutil import parser


# def identify_dates(word):
#     detected_dates = []

#     date_patterns = re.findall(r'\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b', word)

#     for pattern in date_patterns:
#         try:
#             date_obj = parser.parse(pattern, fuzzy=True, dayfirst=True)
#             detected_dates.append(date_obj.strftime('%Y-%m-%d'))  # Change the format as needed
#         except ValueError:
#             pass  # Ignore errors for strings that are not valid dates
#         except OverflowError:
#             print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")

#     if not detected_dates:
#               try:
#                   date_obj = parser.parse(word, fuzzy=True)
#                   detected_dates.append(date_obj.strftime('%Y-%m-%d'))  # Change the format as needed
#               except ValueError:
#                   # Ignore errors for strings that are not dates
#                   pass
#               except OverflowError:
#                   print(f"OverflowError: Unable to parse date for '{word}' due to overflow.")
#     return detected_dates