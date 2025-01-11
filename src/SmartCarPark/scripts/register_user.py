# scripts/register_users.py
from brownie import SmartCarPark
from eth_utils import is_address
import pip._vendor.requests as requests

# URL of your PHP endpoint
url = "http://localhost/get_function.php"

cookies = {
    'PHPSESSID': 'o96j77a4nml5rd1r0q3dmnoiep'
}

try:
    response = requests.get(url, cookies=cookies)
    response.raise_for_status()  # Raise HTTPError for bad responses

    data = response.json()
    if 'eth_add' in data:
        eth_add = data['eth_add']

        # Perform transaction logic here
    else:
        print("Error:", data.get('error', 'Unknown error'))

except requests.RequestException as e:
    print("HTTP Request failed:", e)

def main():
    car_park_contract = SmartCarPark[-1]  # Use the last deployed contract

    # Prompt the user for their Ethereum address
    user_address = eth_add

    # Validate the address format
    if not is_address(user_address):
        print("Invalid Ethereum address.")
        return

    # Check if the user is registered
    try:
        is_registered = car_park_contract.registeredUsers(user_address)
        if not is_registered:
            tx = car_park_contract.registerUser(user_address, {"from": user_address})
            tx.wait(1)
            print(f"User {user_address} registered.")
            
        else:
            print(f"User {user_address} already registered.")
            
    except Exception as e:
        print(f"Error checking user registration: {e}")
        return
