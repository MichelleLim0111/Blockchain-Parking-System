from brownie import Contract, accounts, network, SmartCarPark

def retrieve_funds():
    try:
        # Ensure correct network
        print(f"Active network: {network.show_active()}")

        # Retrieve the deployed contract address dynamically
        deployed_contract_address = SmartCarPark[-1].address  # Fetches the latest deployed instance
        print(f"Deployed contract address: {deployed_contract_address}")

        # Access the deployed contract
        car_park_contract = Contract.from_abi(
            "SmartCarPark",
            deployed_contract_address,
            SmartCarPark.abi
        )

        # Dynamically retrieve the owner's address from the contract
        contract_owner_address = car_park_contract.owner()

        # Add the owner's account dynamically using private key input (securely manage this in production)
        owner_private_key = input("Enter the private key of the owner: ")
        owner_account = accounts.add(owner_private_key)

        # Verify ownership
        if contract_owner_address != owner_account.address:
            raise PermissionError("The provided private key does not match the owner's address.")
        print(f"Verified owner: {contract_owner_address}")

        # Check contract balance
        contract_balance = car_park_contract.balance()
        print(f"Contract balance: {contract_balance / 10**18} ETH")
        if contract_balance == 0:
            raise ValueError("No funds available in the contract to retrieve.")

        # Retrieve payments
        print("Retrieving funds...")
        tx = car_park_contract.retrievePayments({"from": owner_account})
        tx.wait(1)
        print(f"Funds retrieved! Tx hash: {tx.txid}")

        # Verify owner's updated balance
        updated_owner_balance = owner_account.balance()
        print(f"Updated owner balance: {updated_owner_balance / 10**18} ETH")

    except PermissionError as e:
        print(f"{e}")
    except ValueError as e:
        print(f"{e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    retrieve_funds()
