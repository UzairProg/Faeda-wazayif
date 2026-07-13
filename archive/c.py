import requests
import json
import time

# إعداد البيانات الأساسية
api_base_url = "https://www.universal-tutorial.com/api/"
api_token = "qeutI6-_wvovNmJrB_fuH8ocRN1H7VW8vOkTyx2UwbT3ukGaHwyTPVwCyJQKEhpDwwY"
user_email = "engmoustafa02@gmail.com"
access_token = None

def get_access_token():
    global access_token
    url = api_base_url + "getaccesstoken"
    headers = {
        "Accept": "application/json",
        "api-token": api_token,
        "user-email": user_email
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        access_token = response.json().get("auth_token")

def get_cities(state_name):
    url = api_base_url + f"cities/{state_name}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to retrieve cities data for {state_name}. Skipping...")
        return []

def create_cities_json():
    global access_token
    get_access_token()
    if not access_token:
        print("No access token available. Exiting...")
        return

    data = {}
    states = ["New York", "California", "Texas"]  # List of states to get cities data for, you can customize this list

    for state in states:
        cities = get_cities(state)
        data[state] = cities
        time.sleep(1)

    # Save the data to a JSON file
    with open('cities_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print("Cities data successfully saved to cities_data.json.")

# Run the function to create the JSON file
create_cities_json()
