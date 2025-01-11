# scripts/deploy.py
from brownie import SmartCarPark, accounts, network
from eth_utils import is_address
from web3 import Web3

def main():
    # Ensure you're connected to the correct network (Ganache or any testnet)
    print(f"Current Network: {network.show_active()}")

    # Prompt the user for their Ethereum address
    user_address = input("Enter your Ethereum address: ")

    # Validate the address format
    if not is_address(user_address):
        print("Invalid Ethereum address.")
        return
    
    # Set deployment parameters
    total_spots = 10  # Number of parking spots
    slot_price = Web3.to_wei(0.01, "ether")  # Price per slot (0.01 Ether)

    
    # Load the user as an account
    user = accounts.at(user_address, force=True)
    # Deploy the contract with 10 parking spots
    car_park_contract = SmartCarPark.deploy(total_spots, slot_price, {"from": user})

    print(f"Contract deployed at: {car_park_contract.address}")
    return car_park_contract
