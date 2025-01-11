import os
import json
from datetime import datetime
from brownie import SmartCarPark
from datetime import datetime, timedelta
def main():
    # Load the deployed contract
    car_park_contract = SmartCarPark[-1]

    # Initialize date
    date_str = None

    # Calculate tomorrow's date and the day after tomorrow
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    day_after_tomorrow = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

    # Loop to get valid input
    while date_str != tomorrow and date_str != day_after_tomorrow:
        if date_str is not None:
            print(f"Please enter only tomorrow ({tomorrow}) or the day after tomorrow ({day_after_tomorrow}).")
        date_str = input(f"Enter the date (YYYY-MM-DD), only tomorrow ({tomorrow}) or the day after ({day_after_tomorrow}): ")

    start_time = -1
    end_time = -1

    while start_time < 10 or start_time > 21:
        try:
            if end_time != -1:
                print("Invalid timeslot. Please choose between 10 and 21.")
            start_time = int(input("Enter the start time (hour only, 10-21): "))
        except ValueError:
            print("Invalid input. Please enter an integer.")

    while end_time <= start_time or end_time > 22:
        try:
            if end_time != -1:
                print(f"Invalid end time. Please choose between {start_time + 1} and 22.")
            end_time = int(input(f"Enter the end time (hour only, {start_time + 1}-22): "))
        except ValueError:
            print("Invalid input. Please enter an integer.")

    reservation_date = int(datetime.strptime(date_str, "%Y-%m-%d").timestamp())

    # Check availability across the specified time range
    availability = car_park_contract.checkSpotAvailability(reservation_date, start_time, end_time)

    # Display available spots and reservation details
    print(f"Availability on {date_str} from {start_time}:00 to {end_time}:00")
    for spot_id, is_available in enumerate(availability):
        status = "Available" if is_available else "Reserved"
        print(f"Spot {spot_id}: {status}")

    # Save all details in JSON format
    availability_data = {
        "date_str": date_str,
        "reservation_date": reservation_date,
        "start_time": start_time,
        "end_time": end_time,
        "availability": availability  # This will store as a list in JSON
    }

    with open("availability_details.json", "w") as f:
        json.dump(availability_data, f)
        print("Availability information saved to 'availability_details.json'")