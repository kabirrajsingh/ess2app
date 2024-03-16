import re
from PdfTextExtractor import extactFromPDF
from ExtractFunctions import identify_dates, get_distance, get_json, check_Possible_Date

#use the tokens extracted from the pdf to get the key value pairs of the required fields
def getKeyValuePairs(joined_values):
  date, startAdd, endAdd, distanceTravelled, expenseIncurred = " ", " ", " ", " ", " "

  for wordnum in range(len(joined_values)):
    if type(joined_values[wordnum]) != str:
        joined_values[wordnum] = str(joined_values[wordnum])

    expense = re.search("(Final Amount Paid)", joined_values[wordnum])

    lastSection = re.search("(Driver Name)", joined_values[wordnum])
    distanceCheck = get_distance(joined_values[wordnum])

    if check_Possible_Date(joined_values[wordnum ]) != False:
        date = identify_dates(joined_values[wordnum])


    if expense != None:
        expenseIncurred = joined_values[wordnum + 1].split('\n')[0]

    if distanceCheck != None:
        distance = distanceCheck

    if lastSection != None:
        startAdd = joined_values[wordnum + 5]
        endAdd = joined_values[wordnum + 7]

  return get_json( date, startAdd, endAdd, distance, expenseIncurred, "Not Mentioned")


def parseNYPDF(tokens):
    return getKeyValuePairs(tokens)
    

if __name__ == '__main__':
    path = './samples/NY1.pdf'
    tokens = extactFromPDF(path)
    print(parseNYPDF(tokens))
    