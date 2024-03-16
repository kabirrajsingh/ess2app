import re
from PdfTextExtractor import extactFromPDF
from ExtractFunctions import check_Possible_Date, identify_dates, get_distance, normalize_and_remove_duplicates, get_json


def getKeyValuePairs(joined_values):
    start = ''
    date = ''
    distance = ''
    totalamount = ''
    dateflag = False
    totalflag = False
    distanceflag = False
    modeflag = False
    custName = str(joined_values[len(joined_values) - 1]).split()
    custName = custName[len(custName) - 1]
    start = ""
    end = ""
    modeofpay = ""
    for wordnum in range(len(joined_values)):
        if type(joined_values[wordnum]) != str:
            joined_values[wordnum] = str(joined_values[wordnum])


        total = re.search("(?<=Total)(.*)", joined_values[wordnum])
        distanceCheck = get_distance(joined_values[wordnum])
        custName = re.search("(?<=Customer Name.)(.*?)( )(.*?)( )", joined_values[wordnum])
        

        if joined_values[wordnum] == 'Time of Ride' and dateflag == False:
            date = identify_dates(joined_values[wordnum - 1]) if identify_dates(joined_values[wordnum - 1]) else identify_dates(joined_values[wordnum + 1])
            dateflag = True
            #print(date)
        if check_Possible_Date(joined_values[wordnum]) and dateflag == False:
            date = identify_dates(joined_values[wordnum])
        elif total != None and totalflag == False:
            totalamount = joined_values[wordnum + 1] 
            if get_distance(joined_values[wordnum + 2]) == None: 
                totalamount += joined_values[wordnum + 2] #joined_values[wordnum + 2][0:1] + joined_values[wordnum + 1]         
            totalflag = True
            #print(totalamount)

        elif distanceCheck != None and distanceflag == False:
            distance = distanceCheck
            distanceflag = True
            #print(dist[0])
            c = 4

            if joined_values[wordnum + c] == "Pin location":
                start = joined_values[wordnum + c]
            else:
                start = joined_values[wordnum + c]
                while re.search("(India)", joined_values[wordnum + c]) == None:
                    c += 1
                    start += joined_values[wordnum + c].split('India')[0]
                start += joined_values[wordnum + c].split('India')[0]
                start += " India"
            c += 1
            
            if joined_values[wordnum + c] == "Pin location":
                end = joined_values[wordnum + c]
            #print(end)
            else:
                end = joined_values[wordnum + c]
            while re.search("(India|Bill Details)", joined_values[wordnum + c]) == None:
                c += 1
                end += joined_values[wordnum + c].split('India')[0]
            c += 1
            end += joined_values[wordnum + c].split('Bill Details')[0] + " India"

            #print("start", start)
            #print("end", end)

        elif re.search("Paid Using", joined_values[wordnum]) and modeflag == False:
            modeofpay = re.split("Paid Using", str(joined_values[wordnum ]))[1]
            if modeofpay == "":
                modeofpay = str(joined_values[wordnum + 1])
            modeflag = True
            #print(modeofpay)


    return get_json( date, start, end, distance, totalamount, modeofpay)


#check if the pdf is a rapido invoice
def checkRapido(joined_values):
    flag = False
    for i in range(len(joined_values)):
        if re.search("Rapido", str(joined_values[i])) != None:
         flag = True
         break
    return flag

def parseRapidoPDF(tokens):
    tokens = normalize_and_remove_duplicates(tokens)
    return getKeyValuePairs(tokens)

if __name__ == '__main__':
    path = './rapido1.pdf'
    tokens = extactFromPDF(path)
    print(parseRapidoPDF(tokens))
    