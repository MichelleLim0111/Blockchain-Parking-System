import json
import os
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
    # Access the latest deployed contract
    car_park_contract = SmartCarPark[-1]

    # Prompt the user for their Ethereum address
    user_address = eth_add

    # Validate the address format
    if not is_address(user_address):
        print("Invalid Ethereum address.")
        return

    # Check if the user is registered in the system
    try:
        is_registered = car_park_contract.registeredUsers(user_address)
        if not is_registered:
            print("User not registered.")
            return
    except Exception as e:
        print(f"Error checking user registration: {e}")
        return

    try:
        # Read availability details from JSON
        with open("availability_details.json", "r") as f:
            data = json.load(f)
            date_str = data["date_str"]
            reservation_date = data["reservation_date"]
            start_time = data["start_time"]  # Start time in hours (e.g., 9 for 9:00 AM)
            end_time = data["end_time"]      # End time in hours (e.g., 11 for 11:00 AM)
            availability = data["availability"]
    except FileNotFoundError:
        print("Error: Run 'check_availability_range.py' first to generate availability details.")
        return
    except json.JSONDecodeError as e:
        print(f"Error reading availability data: {e}")
        return

    # Display available spots and reservation details
    print(f"Availability on {date_str} from {start_time}:00 to {end_time}:00")
    for spot_id, is_available in enumerate(availability):
        status = "Available" if is_available else "Reserved"
        print(f"Spot {spot_id}: {status}")

    # User input for the spot ID they wish to reserve
    try:
        spot_id = int(input("Enter the spot ID to reserve: "))
        # spot_id = 1
    except ValueError:
        print("Invalid input. Spot ID must be a number.")
        return

    # Validate the spot ID
    if spot_id < 0 or spot_id >= len(availability) or not availability[spot_id]:
        print("Invalid spot selection. It may be already reserved or out of range.")
        return

    # Convert start_time and end_time into timeslot indexes
    start_slot = start_time  # Assuming 1 slot per hour (adjust if using finer granularity)
    end_slot = end_time

    # Calculate the total cost for the reservation (slotPrice * number of slots)
    try:
        slot_price = car_park_contract.slotPrice()
        total_cost = slot_price * (end_slot - start_slot)
    except Exception as e:
        print(f"Error fetching slot price: {e}")
        return

    # Reserve the spot and generate the access code
    try:
        tx = car_park_contract.reserveSpot(
            spot_id,
            reservation_date,
            start_slot,
            end_slot,
            {"from": user_address, "value": total_cost}
        )
        tx.wait(1)  # Wait for the transaction to be mined

        # Retrieve the access code
        access_code = car_park_contract.getAccessCode(spot_id, reservation_date, start_slot, {"from": user_address})

        print("Spot reserved successfully!")
        print(f"Spot ID: {spot_id}")
        print(f"Reservation Date: {date_str}")
        print(f"Start Time: {start_time}:00")
        print(f"End Time: {end_time}:00")
        print(f"Your access code is: {access_code.hex()}")
    except Exception as e:
        print(f"Error during reservation: {e}")
        return

    # Delete the availability file after reservation
    try:
        os.remove("availability_details.json")
        print("Availability file deleted after reservation.")
    except Exception as e:
        print(f"Error deleting file: {e}")
