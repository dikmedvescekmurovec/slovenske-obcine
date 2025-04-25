import json
import re

import requests
from bs4 import BeautifulSoup


def scrape_municipalities():
    url = f"https://sl.wikipedia.org/wiki/Seznam_ob%C4%8Din_v_Sloveniji"
    
    try:
        f = open("municipalities-data.json", "w", encoding="utf-8") # Changed to "w" to overwrite
        # Fetch the page
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        table = soup.find("table", {"class": "wikitable"})
        
        # Get headers
        headers = []
        for th in table.find('tr').find_all('th'):
            headers.append(th.get_text(strip=True))
        
        # Collect table data
        table_data = []
        for row in table.find_all('tr')[1:]:  # Skip header row
            cells = row.find_all(['td', 'th'])
            row_data = {}
            
            for i, cell in enumerate(cells):
                # Clean the cell text
                text = cell.get_text(' ', strip=True)
                text = text.split('[')[0]  # Remove footnotes like [1]
                
                # Use header as key if available
                if i < len(headers):
                    row_data[headers[i]] = text
                
                # Get the URL of the second column
                if i == 1:  # Assuming the second column contains the link
                    a_tag = cell.find('a')
                    if a_tag:
                        href = a_tag.get('href')
                        absolute_url = f"https://sl.wikipedia.org{href}" if href.startswith('/') else href
                        row_data['url'] = absolute_url
                    else:
                        row_data['url'] = None  # Or some default value like ""
            
            if row_data:  # Only add if we got data
                table_data.append(row_data)
        
        json.dump(table_data, f, indent=2, ensure_ascii=False) # added ensure_ascii
        f.close()
        print("Data successfully written to municipalities-data.json")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching the page: {e}")
        return None
    except Exception as e:
        print(f"Error processing the data: {e}")
        return None




def to_camel_case(text):
    """
    Converts a string to camel case, replacing special characters and removing parentheses.

    Args:
        text (str): The input string.

    Returns:
        str: The camel case version of the string.
    """
    # Replace special characters
    text = text.replace("ž", "z").replace("č", "c").replace("š", "s").replace("Ž", "Z").replace("Č", "C").replace("Š", "S")
    # Remove anything in parentheses
    text = re.sub(r"\([^)]*\)", "", text)
    # Remove special characters and replace spaces/underscores with spaces
    text = re.sub(r"[^a-zA-Z0-9\s_]", "", text)
    text = text.replace("_", " ").replace(" ", " ")

    words = text.split()
    if not words:
        return ''
    return words[0] + ''.join(word.capitalize() for word in words[1:])


def convert_keys_to_camel_case(data):
    """
    Recursively converts the keys of a dictionary to camel case.

    Args:
        data (dict): The input dictionary.

    Returns:
        dict: A new dictionary with camel case keys.
    """
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            new_key = to_camel_case(key)
            new_data[new_key] = convert_keys_to_camel_case(value)  # Recurse
        return new_data
    elif isinstance(data, list):
        return [convert_keys_to_camel_case(item) for item in data]  # Recurse
    else:
        return data


def format_json(input_filename='municipalities-data.json', output_filename='output.json'):
    """
    Formats a JSON file to be more readable and converts keys to camel case.
    Handles potential errors.

    Args:
        input_filename (str, optional): The name of the input JSON file.
            Defaults to 'municipalities-data.json'.
        output_filename (str, optional): The name of the output JSON file.
            Defaults to 'output.json'.
    """
    try:
        with open(input_filename, 'r', encoding='utf-8') as infile:
            try:
                data = json.load(infile)
                data_with_camel_case_keys = convert_keys_to_camel_case(data) # Convert keys to camel case
            except json.JSONDecodeError as e:
                print(f"Error: Invalid JSON in file '{input_filename}': {e}")
                return  # Stop processing if the JSON is invalid

        with open(output_filename, 'w', encoding='utf-8') as outfile:
            json.dump(data_with_camel_case_keys, outfile, ensure_ascii=False, indent=2)
        print(f"Successfully formatted JSON with camel case keys from '{input_filename}' to '{output_filename}'")

    except FileNotFoundError:
        print(f"Error: File not found: '{input_filename}'")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")



scrape_municipalities()
format_json()