import re
from PdfTextExtractor import extactFromPDF
from ExtractFunctions import identify_dates, get_distance, get_json


def checkPossibleDate(word):
    date = ""
    days = re.compile("(Mon|Tues|Wed|Thurs|Fri|Sat|Sun).", re.IGNORECASE)
    months = re.compile("(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec).", re.IGNORECASE)
    if re.search(days, word) != None or re.search(months, word) != None:
        return True
    else:
        return False
        

#use the tokens extracted from the pdf to get the key value pairs of the required fields
def getKeyValuePairs(joined_values):
    date, startaddress, endaddress, distance, totalamount, modeofpayment, dateflag, distanceflag, crnflag, startflag, totalflag, =  "", "", "", "", "", "", False, False, False, False, False
    
    #date = identify_dates(str(joined_values[0])) # or use invoiceDate = re.search("(?<=Invoice Date )(.*?)(\\n)", joined_values[wordnum])
    
    for wordnum in range(len(joined_values)):

        if type(joined_values[wordnum]) != str:
            joined_values[wordnum] = str(joined_values[wordnum])

        totalbill = re.search("(Total Bill|Fare)", joined_values[wordnum])
        totalpayable = re.search("(Payable)", joined_values[wordnum])
        distanceCheck = get_distance(joined_values[wordnum])
        locationCheck = re.search("([0-9]|[0-9] | [0-9]):[0-5][0-9] [APap][Mm]", joined_values[wordnum])
        modeofpay = re.search("(Payment\\n)", joined_values[wordnum])

        if checkPossibleDate(joined_values[wordnum]) == True and dateflag == False:
            dateflag = True
            date = identify_dates(joined_values[wordnum]) #.split('\n')[1]) if len(joined_values[wordnum].split('\n')) > 1 else joined_values[wordnum]

        if re.search("CRN", joined_values[wordnum]) != None and crnflag == False:
            totalamount = " " + str(joined_values[wordnum - 1])
            crnflag = True
     
        if distanceCheck != None :
            distance = distanceCheck
           
        elif locationCheck != None and startflag == False:
            distance = joined_values[wordnum].split('\n')[1]

            c = 1
            startaddress = distance
            while re.search("([0-9]|[0-9] | [0-9]):[0-5][0-9] [APap][Mm]", str(joined_values[wordnum + c])) == None and c < 20   :
                startaddress += str(joined_values[wordnum + c])
                c += 1

            startaddress = startaddress.split("The fares are")[0]
            startaddress = startaddress.split("Total")[0]
            if re.search("India", startaddress) != None:
                startaddress, endaddress = startaddress.split("India")[0], startaddress.split("India")[1]
            c += 1
            while (wordnum + c) < len(joined_values) and re.search("(Payment|For trip|\[)", str(joined_values[wordnum + c])) == None and c < 40:
                #print(str(joined_values[wordnum + c]))
                endaddress += str(joined_values[wordnum + c])
                c += 1

            startflag = True

        elif modeofpay != None:
            modeofpayment = joined_values[wordnum + 1].split('\n')[0]
            c = 2
            while (wordnum + 1 + c) < len(joined_values) and re.search("In case of any complaint|Driver Trip", str(joined_values[wordnum + 1 + c])) == None:
                modeofpayment += ", " + str(joined_values[wordnum + 1 + c]).split('\n')[0]
                c += 2
                
    if modeofpayment.find('cash') != -1:
        modeofpayment = 'cash'
    return get_json(date, startaddress, endaddress, distance, totalamount, modeofpayment)

#check if the pdf is an ola invoice
def checkOla(joined_values):
    flag = False
    for i in range(len(joined_values)):
        if re.search("(Driver Trip Invoice)(.*?)(Ola)(.*?)(SAC Code)", str(joined_values[i])) != None:
            flag = True
            break
    return flag

def parseOlaPDF(tokens):
    return getKeyValuePairs(tokens)
    
if __name__ == '__main__':
    path = './samples/sohil pdfs/sohil ola 6.pdf'
    tokens = extactFromPDF(path)
    print(parseOlaPDF(tokens))


    