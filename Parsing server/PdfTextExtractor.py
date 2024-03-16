import fitz  # PyMuPDF
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar, LTRect
import pdfplumber


def text_extraction(element):
    line_text = element.get_text()
    line_formats = []
    for text_line in element:
        if isinstance(text_line, LTTextContainer):
            for character in text_line:
                if isinstance(character, LTChar):
                    line_formats.append(character.fontname)
                    line_formats.append(character.size)
    format_per_line = list(set(line_formats))
    return (line_text, format_per_line)


def extract_table(pdf_path, page_num, table_num):
    pdf = pdfplumber.open(pdf_path)
    table_page = pdf.pages[page_num]
    table = table_page.extract_tables()[table_num]
    pdf.close()  # Close pdfplumber
    return table

def table_converter(table):
    table_string = ''
    for row_num in range(len(table)):
        row = table[row_num]
        cleaned_row = [item.replace('\n', ' ') if item is not None and '\n' in item else 'None' if item is None else item for item in row]
        table_string += ('|' + '|'.join(cleaned_row) + '|' + '\n')
    table_string = table_string[:-1]
    return table_string


def getTextPerPage(pdf_path):
    text_per_page = {}
    for pagenum, page in enumerate(extract_pages(pdf_path)):
        page_text = []
        line_format = []
        text_from_images = []
        text_from_tables = []
        page_content = []
        table_num = 0
        first_element = True
        table_extraction_flag = False

        pdf = pdfplumber.open(pdf_path)
        page_tables = pdf.pages[pagenum]
        tables = page_tables.extract_tables()

        page_elements = [(element.y1, element) for element in page._objs]
        page_elements.sort(key=lambda a: a[0], reverse=True)
        lower_side = float('inf')  # initialize to positive infinity or some other appropriate value
        upper_side = page_elements[0][0] if page_elements else 0

        if table_num < len(tables):
            for row in tables[table_num]:
                for cell in row:
                    if isinstance(cell, LTTextContainer):
                        lower_side = min(lower_side, cell.y0)
                        upper_side = max(upper_side, cell.y1)

        # Ensure lower_side is at least 0
        lower_side = max(lower_side, 0)




        for i, component in enumerate(page_elements):
            pos = component[0]
            element = component[1]

            if isinstance(element, LTTextContainer):
                if not table_extraction_flag:
                    (line_text, format_per_line) = text_extraction(element)
                    page_text.append(line_text)
                    line_format.append(format_per_line)
                    page_content.append(line_text)
                else:
                    pass



            if isinstance(element, LTRect):
                if first_element and (table_num + 1) <= len(tables):
                    table = extract_table(pdf_path, pagenum, table_num)
                    #print("Table Contents:", table)

                    # Filter out rows with None values or empty strings
                    valid_rows = [row for row in table if any(cell for cell in row if cell and str(cell).strip())]

                    # Assuming table is a list of rows
                    # You can modify this part based on the structure of the table object
                    valid_rows = [row for row in table if all(coord is not None for coord in row)]
                    if valid_rows:
                        # Assuming the fourth element in each row is the bottom y-coordinate
                        table_bottom = max(valid_rows)

                        table_string = table_converter(table)
                        text_from_tables.append(table_string)
                        page_content.append(table_string)
                        table_extraction_flag = True
                        first_element = False
                        page_text.append('table')
                        line_format.append('table')

                if element.y0 >= lower_side and element.y1 <= upper_side:
                    pass
                elif i + 1 < len(page_elements) and not isinstance(page_elements[i + 1][1], LTRect):
                    table_extraction_flag = False
                    first_element = True
                    table_num += 1




        dctkey = 'Page_' + str(pagenum)
        text_per_page[dctkey] = page_text, line_format, text_from_images, text_from_tables, page_content

    return text_per_page

# Extract values and join them into a list
def getJoinedValues(text_per_page):
    joined_values = []
    result = []
    for key, values in text_per_page.items():
        joined_values.extend(values)
    for word in joined_values:
      result.extend(word)
    joined_values = [item for sublist in joined_values for item in sublist]
    return joined_values

def extactFromPDF(filepath):
    pdf_doc = fitz.open(filepath)
    text_per_page = getTextPerPage(filepath)
    pdf_doc.close()
    joined_values = getJoinedValues(text_per_page)
    return joined_values