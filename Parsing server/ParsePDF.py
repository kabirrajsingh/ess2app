from OlaParser import parseOlaPDF,checkOla
from UberParser import parseUberPDF,checkUber
from NammaYatriParser import parseNYPDF
from PdfTextExtractor import extactFromPDF
from RapidoParser import parseRapidoPDF,checkRapido
from CheckAggregator import checkAggregator

def parsePdf(file_path):
    try:
        #get text from pdf and pass to parsers based on the aggregator
        extracted_pdf = extactFromPDF(file_path)

        aggregator = checkAggregator(extracted_pdf)

        if aggregator == "Ola":
            print("Ola")
            return parseOlaPDF(extracted_pdf)
        elif aggregator == "Uber":
            return parseUberPDF(extracted_pdf)
        elif aggregator == "Rapido":
            return parseRapidoPDF(extracted_pdf)
        else:
            return parseNYPDF(extracted_pdf)
    except Exception as e:
        raise