# scripts/get_registered_users.py
from brownie import SmartCarPark

def main():
    # Load the deployed contract
    car_park_contract = SmartCarPark[-1]

    # Call the smart contract function to get all registered users
    registered_users = car_park_contract.getRegisteredUsers()

    # Display the list of registered users
    if registered_users:
        print("Registered Users:")
        for user in registered_users:
            print(user)
    else:
        print("No registered users found.")
