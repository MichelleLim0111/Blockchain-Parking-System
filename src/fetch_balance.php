<?php
session_start();

require 'C:/Users\Admin/Visual_Studio/blockchain/vendor/autoload.php'; // Composer's autoloader

use Ethereum\Ethereum;
use Ethereum\DataType\EthD20;
use Ethereum\DataType\EthBlockParam;

try {
    // Database connection
    $db = new PDO('sqlite:user_database.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the user is logged in
    if (!isset($_SESSION['username'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'User not logged in']);
        exit;
    }

    $username = $_SESSION['username'];

    // Fetch user's Ethereum address from the database
    $query = $db->prepare('SELECT eth_add FROM users WHERE username = :username');
    $query->bindValue(':username', $username, PDO::PARAM_STR);
    $query->execute();

    $user = $query->fetch(PDO::FETCH_ASSOC);

    if (!$user || empty($user['eth_add'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Ethereum address not found for user']);
        exit;
    }

    $ethAddress = $user['eth_add'];

    // Connect to Ganache
    $ganacheRpcUrl = 'http://127.0.0.1:7545'; // Ganache RPC URL
    $eth = new Ethereum($ganacheRpcUrl);

    // Fetch the balance
    $balanceInWei = $eth->eth_getBalance(new EthD20($ethAddress), new EthBlockParam('latest'))->val();

    // Convert balance from Wei to Ether
    $etherBalance = bcdiv($balanceInWei, bcpow('10', '18', 18), 18); // Handle precision

    // Return the balance
    echo json_encode([
        'username' => $username,
        'eth_add' => $ethAddress,
        'balance' => number_format($etherBalance, 5) . ' ETH', // Display up to 5 decimal places
    ]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Error retrieving balance: ' . $e->getMessage()]);
}
