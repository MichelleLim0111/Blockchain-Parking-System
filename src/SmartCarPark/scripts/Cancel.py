from brownie import SmartCarPark, accounts
from datetime import datetime
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
    # Load the deployed contract
    car_park_contract = SmartCarPark[-1]

    # Prompt the user to input their Ethereum address
    user_address = eth_add

    # Prompt the user to input their private key for verification
    try:
        user_private_key = input("Enter your private key: ")
        account = accounts.add(user_private_key)

        # Verify if the private key matches the provided Ethereum address
        if account.address.lower() != user_address.lower():
            print("Error: The private key does not match the Ethereum address.")
            return
    except Exception as e:
        print(f"Failed to verify the private key: {e}")
        return
    

    # Get all reservations made by the user
    try:
        user_reservations = car_park_contract.getUserReservations(account.address)
        if not user_reservations:
            print("You have no reservations.")
            return
    except Exception as e:
        print(f"Failed to retrieve reservations: {e}")
        return

    # Display reservations
    print("\nYour Reservations:")
    for i, res in enumerate(user_reservations):
        spot_id = res["spotId"]
        date = datetime.fromtimestamp(res["date"]).strftime("%Y-%m-%d")
        start_slot = res["startSlot"]
        end_slot = res["endSlot"]
        print(f"{i + 1}. Spot ID: {spot_id}, Date: {date}, Start Slot: {start_slot}, End Slot: {end_slot}")

    # Prompt user to select a reservation to cancel
    try:
        selection = int(input("\nEnter the number of the reservation you want to cancel: ")) - 1
        # selection = 1
        if selection < 0 or selection >= len(user_reservations):
            print("Invalid selection.")
            return

        # Retrieve reservation details
        reservation = user_reservations[selection]
        spot_id = reservation["spotId"]
        date = reservation["date"]
        start_slot = reservation["startSlot"]
        end_slot = reservation["endSlot"]

        # Call the cancelReservation function on the contract
        tx = car_park_contract.cancelReservation(
            spot_id,
            date,
            start_slot,
            end_slot,
            {"from": account}
        )
        tx.wait(1)  # Wait for transaction confirmation
        print("Reservation successfully cancelled.")
    except Exception as e:
        print(f"Failed to cancel reservation: {e}")
