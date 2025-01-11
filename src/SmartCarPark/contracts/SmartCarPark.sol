// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartCarPark {


    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Struct to store individual reservation details
    struct Reservation {
        address user; // Address of the user who made the reservation
        bool isReserved; // Indicates if the slot is reserved
        bytes32 accessCode; // Unique access code for the reservation
    }

    // Struct to store comprehensive reservation information
    struct ReservationInfo {
        uint256 spotId; // ID of the parking spot
        uint256 date; // Date of the reservation
        uint256 startSlot; // Start time slot of the reservation
        uint256 endSlot; // End time slot of the reservation
        bytes32 accessCode; // Unique access code for the reservation
    }

    // Struct to store payment
    struct PaymentInfo{
        address user;
        uint256 amount;
        uint256 spotId;
        uint256 startSlot;
        uint256 endSlot;
    }

    // Mapping to store reservation details by spot, date, and timeslot
    mapping(uint256 => mapping(uint256 => mapping(uint256 => Reservation)))
        public reservations;

    // Mapping to track registered users
    mapping(address => bool) public registeredUsers;

    // Array to store the list of registered users
    address[] public userList;

    // Mapping to store reservation IDs for each user
    mapping(address => uint256[]) public userReservations;

    // Array to store all reservation information
    ReservationInfo[] public allReservations;

    // Total parking spots and cost per timeslot
    uint256 public totalSpots;
    uint256 public slotPrice;

    // Owner of the contract for access control
    address public owner;

    // Constructor to initialize parking spots and slot price
    constructor(uint256 _totalSpots, uint256 _slotPrice) {
        owner = msg.sender; // Assign the deployer as the owner
        totalSpots = _totalSpots; // Total available parking spots
        slotPrice = _slotPrice; // Price for reserving a single slot
    }

    


    // Event emitted on successful reservation
    event Reserved(
        address indexed user,
        uint256 spotId,
        uint256 date,
        uint256 startSlot,
        uint256 endSlot,
        bytes32 accessCode
    );

    // Function to check availability for a range of timeslots on a given date
    function checkSpotAvailability(
        uint256 date,
        uint256 startSlot,
        uint256 endSlot
    ) public view returns (bool[] memory) {
        bool[] memory availability = new bool[](totalSpots); // Array to store availability status

        for (uint256 spotId = 0; spotId < totalSpots; spotId++) {
            bool isAvailable = true; // Assume the spot is available
            for (uint256 slot = startSlot; slot < endSlot; slot++) {
                if (reservations[spotId][date][slot].isReserved) {
                    isAvailable = false; // Mark as unavailable if any slot is reserved
                    break;
                }
            }
            availability[spotId] = isAvailable; // Update the availability for the spot
        }
        return availability; // Return the availability status
    }

    // Function to reserve a parking spot for a specified range of timeslots
function reserveSpot(
    uint256 spotId,
    uint256 date,
    uint256 startSlot,
    uint256 endSlot
) external payable returns (bytes32) {
    require(registeredUsers[msg.sender], "User not registered"); // Ensure user is registered
    require(endSlot > startSlot, "Invalid time range"); // Validate time range

    uint256 totalDuration = endSlot - startSlot; // Calculate reservation duration
    uint256 totalCost = totalDuration * slotPrice; // Calculate total cost

    require(msg.value >= totalCost, "Insufficient funds"); // Ensure payment matches the cost

    // Ensure all requested timeslots are available
    for (uint256 slot = startSlot; slot < endSlot; slot++) {
        require(
            !reservations[spotId][date][slot].isReserved,
            "One or more timeslots are already reserved"
        );
        reservations[spotId][date][slot] = Reservation(
            msg.sender,
            true,
            bytes32(0)
        ); // Reserve the slot
    }

    // Generate a unique access code for the reservation
    bytes32 accessCode = keccak256(
        abi.encodePacked(
            msg.sender,
            spotId,
            date,
            startSlot,
            endSlot,
            block.timestamp
        )
    );

    // Assign access code to all reserved slots
    for (uint256 slot = startSlot; slot < endSlot; slot++) {
        reservations[spotId][date][slot].accessCode = accessCode;
    }

    // Store detailed reservation information
    ReservationInfo memory newReservation = ReservationInfo(
        spotId,
        date,
        startSlot,
        endSlot,
        accessCode
    );
    allReservations.push(newReservation); // Add to all reservations

    uint256 reservationId = allReservations.length - 1; // Get reservation ID
    userReservations[msg.sender].push(reservationId); // Link to user

    // Refund excess payment if applicable
    if (msg.value > totalCost) {
        payable(msg.sender).transfer(msg.value - totalCost);
    }

    emit Reserved(msg.sender, spotId, date, startSlot, endSlot, accessCode);
    return accessCode; // Return the access code to the user
}


    // Function to retrieve access code for a specific reservation slot
    function getAccessCode(
        uint256 spotId,
        uint256 date,
        uint256 timeSlot
    ) external view returns (bytes32) {
        require(
            reservations[spotId][date][timeSlot].user == msg.sender,
            "Not your reservation"
        ); // Ensure caller owns the reservation
        return reservations[spotId][date][timeSlot].accessCode; // Return the access code
    }

    // Function to get all reservations made by a specific user
    function getUserReservations(
        address user
    ) external view returns (ReservationInfo[] memory) {
        uint256[] memory reservationIds = userReservations[user]; // Get reservation IDs
        ReservationInfo[] memory userReservationDetails = new ReservationInfo[](
            reservationIds.length
        );

        for (uint256 i = 0; i < reservationIds.length; i++) {
            userReservationDetails[i] = allReservations[reservationIds[i]];
        }

        return userReservationDetails; // Return user's reservation details
    }

    // Function to register a new user
    function registerUser(address user) external {
        require(msg.sender == user, "Only the user can register user"); // User must self-register
        require(!registeredUsers[user], "User is already registered"); // Ensure user isn't already registered
        registeredUsers[user] = true; // Mark user as registered
        userList.push(user); // Add to user list
    }

    // Function to remove a user from the registered list
    function removeUser(address user) external {
        require(msg.sender == user, "Only the user can remove himself"); // User must self-remove
        require(registeredUsers[user], "User is not registered"); // Ensure user is registered

        registeredUsers[user] = false; // Remove from registration

        // Remove user from the user list
        for (uint256 i = 0; i < userList.length; i++) {
            if (userList[i] == user) {
                userList[i] = userList[userList.length - 1]; // Replace with last user
                userList.pop(); // Remove last element
                break;
            }
        }
    }

    // Function to get all registered users
    function getRegisteredUsers() external view returns (address[] memory) {
        return userList; // Return the list of users
    }

    // Function for the owner to retrieve all funds
    event FundsRetrieved(uint amount, address to);

    function retrievePayments() public onlyOwner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds to retrieve");
        payable(owner).transfer(balance);
        emit FundsRetrieved(balance, owner);
    }

    function cancelReservation(
        uint256 spotId,
        uint256 date,
        uint256 startSlot,
        uint256 endSlot
    ) external {
        uint256 refundAmount = 0;

        for (uint256 slot = startSlot; slot < endSlot; slot++) {
            require(
                reservations[spotId][date][slot].user == msg.sender,
                "Not your reservation"
            ); // Ensure caller owns the reservation

            reservations[spotId][date][slot] = Reservation(address(0), false, bytes32(0)); // Free the slot
        }

        // Calculate refund amount
        uint256 totalDuration = endSlot - startSlot;
        refundAmount = totalDuration * slotPrice;

        // Remove reservation from user's record
        uint256[] storage userRes = userReservations[msg.sender];
        for (uint256 i = 0; i < userRes.length; i++) {
            if (
                allReservations[userRes[i]].spotId == spotId &&
                allReservations[userRes[i]].date == date &&
                allReservations[userRes[i]].startSlot == startSlot &&
                allReservations[userRes[i]].endSlot == endSlot
            ) {
                userRes[i] = userRes[userRes.length - 1];
                userRes.pop();
                break;
            }
        }

        // Transfer refund to user
        payable(msg.sender).transfer(refundAmount);

        emit Reserved(msg.sender, spotId, date, startSlot, endSlot, bytes32(0));
    }

}
