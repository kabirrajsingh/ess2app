import re
from PdfTextExtractor import extactFromPDF
from ExtractFunctions import check_Possible_Date, identify_dates, get_distance, remove_unicode_chars, get_json


def getKeyValuePairs(joined_values):
  
  date, startaddress, endaddress, distancetravelled, totalamount, modeofpayment, dateflag = '', '', '', '', '', '', False

  for wordnum in range(len(joined_values)):
    joined_values[wordnum] = str(joined_values[wordnum]).replace("\u00a0", " ")

    total = re.search("(Total)", joined_values[wordnum])
    modeofpay = re.search("(Payments\\n|Amount Charged|collected)", joined_values[wordnum])
    distanceCheck = get_distance(joined_values[wordnum])
    ampmcheck = re.compile("AM|PM", re.IGNORECASE)

    if check_Possible_Date(joined_values[wordnum]) != False and dateflag == False:
       date = identify_dates(joined_values[wordnum].split('\n')[0])
       dateflag = True

    if total != None:
      
      totalamount = re.split("Total", joined_values[wordnum])[1]
      #print(totalamount)
      if re.search("ride", joined_values[wordnum - 1]) != None:
        totalamount += " " + str(joined_values[wordnum + 1])
      else:
        totalamount += " " + str(joined_values[wordnum - 1])
      if re.search("(\d+(\.\d+)?)", totalamount) == None:
        c = -2
        while re.search("(\d+(\.\d+)?)", joined_values[wordnum + c]) != None:
          #print(joined_values[wordnum + c])
          #totalamount = re.search(".(\d+(\.\d+)?)", joined_values[wordnum + c]).group()
          
          totalamount += joined_values[wordnum + c] 
          c += 1
      totalamount = " " + remove_unicode_chars(totalamount)
      """else:
         c += 1
         #totalamount += " " + joined_values[wordnum - 2]
      
      if re.search("ride", joined_values[wordnum - 1]) != None:
        totalamount += " " + str(joined_values[wordnum + 1])
      else:
        totalamount += " " + str(joined_values[wordnum - 1])"""

    if modeofpay != None:
      modeofpayment = joined_values[wordnum + 1].split('\n')[0]
      c = 1
      modeofpayment += " , " + str(joined_values[wordnum + 1 + c]).split('\n')[0]
      
        #c += 3
      #print(modeofpayment)

    if distanceCheck != None:
      
      distance = distanceCheck
      
      c = 2
      startaddress = ''
      endaddress = ''
      startaddress = joined_values[wordnum + 1]
        #c += 1
      if ampmcheck.search(joined_values[wordnum + c]) == None:
        while ampmcheck.search(joined_values[wordnum + c]) != None and ampmcheck.search(joined_values[wordnum + c + 1]) == None:
          startaddress += joined_values[wordnum + c]
          c += 1

      endaddress = joined_values[wordnum + c]
      if ((wordnum + c) < len(joined_values)) and (ampmcheck.search(str(joined_values[wordnum + c])) == None) :
        while ampmcheck.search(str(joined_values[wordnum + c])) != None and ampmcheck.search(str(joined_values[wordnum + c + 1])) == None:
          endaddress += joined_values[wordnum + c]
          c += 1
  
      startaddress = startaddress#.split(' | ')[1]
      endaddress = endaddress#.split(' | ')[1]

  return get_json(date, startaddress, endaddress, distance, totalamount, modeofpayment)

#check if the pdf is an uber invoice
def checkUber(joined_values):
    flag = False
    for i in range(len(joined_values)):
        if re.search("Uber", str(joined_values[i])) != None:
            flag = True
            break
    return flag

def parseUberPDF(tokens):
    return getKeyValuePairs(tokens)
    

if __name__ == '__main__':
    path = './samples/UBER_PDFS/UBER_37.pdf'
    tokens = extactFromPDF(path)
    print(parseUberPDF(tokens))
    