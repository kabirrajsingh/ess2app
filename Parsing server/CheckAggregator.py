from OlaParser import parseOlaPDF,checkOla
from UberParser import parseUberPDF,checkUber
from NammaYatriParser import parseNYPDF
from PdfTextExtractor import extactFromPDF
from RapidoParser import parseRapidoPDF,checkRapido
import re

def checkAggregator(joined_values):
    for i in range(len(joined_values)):
        if re.search("(Driver Trip Invoice)(.*?)(Ola)(.*?)(SAC Code)", str(joined_values[i])) != None:
            print("Ola")
            return "Ola"
        if re.search("Uber", str(joined_values[i])) != None:
            print("Uber")
            return "Uber"
        if re.search("Rapido", str(joined_values[i])) != None:
            print("Rapido")
            return "Rapido"
    print("Generic")
    return "Generic"