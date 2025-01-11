# Example: Remove a user
from brownie import SmartCarPark
from eth_utils import is_address

def main():
    car_park_contract = SmartCarPark[-1]  # Get the latest deployed contract
    # Specify the address of the user to remove
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
            print(f"User {user_address} not registered.")
            return 
        else:
            print(f"User {user_address} already registered.")
            
    except Exception as e:
        print(f"Error checking user registration: {e}")
        return
    
    car_park_contract.removeUser(user_address, {'from': user_address})  # Call removeUser from an authorized account
    print(f"User {user_address} removed successfully!")
