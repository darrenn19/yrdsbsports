#Tier 2 Senior Boys Ice Hockey Standings
import requests
from bs4 import BeautifulSoup
import json

# URL of the standings page
url = "http://yraa.com/src/standings.php?division=68"

# Send a GET request to fetch the HTML content of the page
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all table rows that contain the standings data
    rows = soup.find_all('tr')
    
    # Initialize an empty list to hold the parsed data
    standings = []
    
    # Headers for columns (use this to match with each row)
    headers = ["Team", "W", "L", "T", "PTS", "GF", "GA", "DIFF"]

    # Iterate through each row in the table (skip header rows)
    for row in rows:
        # Get all the cells in the row
        cols = row.find_all('td')
        
        # If there are any cells in the row, process the data
        if len(cols) > 0:
            # Extract and clean text from each cell
            data = [col.text.strip() for col in cols]
            
            # Skip the rows with headers or glossary text
            if "W:" in data or "L:" in data:
                continue  # Skip rows that contain glossary or headings

            if len(data) > 1:  # Exclude any empty rows
                # Build a dictionary for the team stats
                team_data = {
                    "Team": data[1],  # The team name is in the second column
                    "GP": data[2],
                    "W": data[3],
                    "L": data[4],
                    "T": data[5],
                    "PTS": data[6],
                    "GF": data[7],
                    "GA": data[8],
                    "DIFF": data[9]
                }
                # Append this dictionary to the standings list
                standings.append(team_data)
    
    # Build a cleaner JSON structure
    json_data = {
        "standings": standings
    }

    # Write the data to a JSON file
    with open("ice-hockey/sb2/icehockeysb2standings.json", "w") as json_file:
        json.dump(json_data, json_file, indent=4)

    print("Data successfully saved to icehockeysb2standings.json")
else:
    print("Failed to retrieve the page. Status code:", response.status_code)