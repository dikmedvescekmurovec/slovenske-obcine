import json
import os  # Import os module for checking file existence

# Define the name of the file containing your data
file_path = 'public/municipalities-data.json'

# --- Read data from the JSON file ---
municipalities_data = [] # Initialize as empty list

if not os.path.exists(file_path):
    print(f"Error: File not found at '{file_path}'")
    # Exit the script if the file is not found
    exit()

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        # json.load() parses the JSON data from the file into a Python list
        municipalities_data = json.load(f)
    print(f"Successfully loaded data from '{file_path}'")

except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from '{file_path}'. Please check the file format.")
    # Exit if the JSON is invalid
    exit()
except Exception as e:
    print(f"An unexpected error occurred while reading the file: {e}")
    # Exit for other potential file reading errors
    exit()


# --- Find unique values for 'Pokrajina' ---

# Use a set to automatically handle uniqueness
unique_pokrajine = set()

# Iterate through the list of dictionaries
for municipality in municipalities_data:
    # Use .get() to safely access the 'Pokrajina' key
    # It returns None if the key doesn't exist in a dictionary
    pokrajina_value = municipality.get("Pokrajina")

    # Add the value to the set if it's not None and not an empty string
    if pokrajina_value:
        unique_pokrajine.add(pokrajina_value)

# Convert the set back to a list (optional, but often convenient)
unique_pokrajine_list = list(unique_pokrajine)

# Print the result
print("\nUnique Pokrajine values:")
print(unique_pokrajine_list)