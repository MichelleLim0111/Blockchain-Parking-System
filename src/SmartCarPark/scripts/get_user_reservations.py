from brownie import SmartCarPark
from eth_utils import is_address
from datetime import datetime
import pytz

# Specify the intended timezone (e.g., 'Asia/Kuala_Lumpur')
TARGET_TIMEZONE = pytz.timezone("Asia/Kuala_Lumpur")

def main():
    # Access the latest deployed contract
    car_park_contract = SmartCarPark[-1]

    # Prompt the user for their Ethereum address
    user_address = input("Enter your Ethereum address: ").strip()

    # Validate the address format
    if not is_address(user_address):
        print("Invalid Ethereum address.")
        return

    # Check if the user is registered
    try:
        is_registered = car_park_contract.registeredUsers(user_address)
        if not is_registered:
            print("User not registered.")
            return
    except Exception as e:
        print(f"Error checking user registration: {e}")
        return

    # Retrieve user reservations
    try:
        user_info = car_park_contract.getUserReservations(user_address)
        if not user_info:
            print("No reservations found for this user.")
            return

        print("User Reservation Details:")
        for reservation in user_info:
            spot_id = reservation['spotId']
            reservation_date = datetime.fromtimestamp(reservation['date'], tz=TARGET_TIMEZONE).strftime('%Y-%m-%d')
            start_time = reservation['startSlot']
            end_time = reservation['endSlot']
            access_code = reservation['accessCode']

            print(f"Spot ID: {spot_id}")
            print(f"Reservation Date: {reservation_date}")
            print(f"Start Time: {start_time}:00")
            print(f"End Time: {end_time}:00")
            print(f"Access Code: {access_code.hex()}")
            print("-" * 30)

    except Exception as e:
        print(f"Error retrieving reservations: {e}")
