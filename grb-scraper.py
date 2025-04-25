import json
import os
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


def fetch_and_save_content(data, output_dir="municipality_content"):
    """
    Iterates through a list of dictionaries, fetches content from the 'url' key,
    and saves the third row of the infobox table to a file, also downloading images from that row.

    Args:
        data (list): A list of dictionaries, where each dictionary contains a 'url' key.
        output_dir (str, optional): The directory where the content will be saved.
            Defaults to "municipality_content".
    """
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for item in data:
        if 'url' in item:
            url = item['url']
            # Sanitize the municipality name for use as a filename
            municipality_name = item.get('Obcina', 'Unknown').replace("Občina ", "").replace(" ", "_").replace("/", "_")
            page_dir = os.path.join(output_dir, municipality_name) # Create a directory for each page's data
            if not os.path.exists(page_dir):
                os.makedirs(page_dir)
            filename = os.path.join(page_dir, "content.txt") # Save main content to content.txt

            try:
                # Fetch the content
                response = requests.get(url)
                response.raise_for_status()  # Raise an exception for bad status codes

                # Parse HTML
                soup = BeautifulSoup(response.text, 'html.parser')

                # Find the infobox table
                infobox = soup.find("table", {"class": "infobox"})  # Or any specific class the table might have

                if infobox:
                    # Find all rows in the infobox
                    rows = infobox.find_all('tr')
                    if len(rows) > 2:
                        # Get the third row
                        third_row = rows[2]
                        # Extract the text from the third row
                        row_content = third_row.get_text(separator=' ', strip=True)
                        content = f"Third row of infobox from {url}: {row_content}"

                        # Find images in the third row and download them
                        images = third_row.find_all('img')
                        for i, img in enumerate(images):
                            img_url = img.get('src')
                            if img_url:
                                #handle relative urls
                                img_url = urljoin(url, img_url)
                                img_name = os.path.basename('grb.png')
                                if i == 0 and len(images) > 1: 
                                  img_name = os.path.basename('zastava.png')
                                img_path = os.path.join(page_dir, img_name)
                                try:
                                    # Add User-Agent header to the image request
                                    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
                                    img_response = requests.get(img_url, stream=True, headers=headers)
                                    img_response.raise_for_status()
                                    with open(img_path, 'wb') as img_file:
                                        for chunk in img_response.iter_content(chunk_size=8192):
                                            img_file.write(chunk)
                                    print(f"Downloaded image {img_name} from {img_url} and saved to {img_path}")
                                except requests.exceptions.RequestException as e:
                                    print(f"Error downloading image {img_url}: {e}")

                    else:
                        content = f"Infobox table found at {url}, but it has less than 3 rows."
                else:
                    content = f"Infobox table not found at {url}."

                # Save the content to a file
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Content from {url} saved to {filename}")

            except requests.exceptions.RequestException as e:
                print(f"Error fetching {url}: {e}")
            except Exception as e:
                print(f"Error processing {url}: {e}")
        else:
            print(f"URL not found in item: {item}")

def load_data(filename="clean.json"):
    """Loads the data from a JSON file.
    Args:
        filename (str): The name of the JSON file.
    Returns:
        list: The data loaded from the JSON file.
              Returns an empty list if the file does not exist or other error occurs.
    """
    try:
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"Error: File not found: {filename}")
        return []
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return []
    except Exception as e:
        print(f"Error reading file: {e}")
        return []

if __name__ == "__main__":
    data = load_data()
    if data:
        fetch_and_save_content(data)
    else:
        print("No data to process.")
