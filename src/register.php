<?php
try {
    // Function to fetch accounts from Ganache using JSON-RPC
    function getEthAccounts($ganacheRpcUrl) {
        $payload = [
            'jsonrpc' => '2.0',
            'method' => 'eth_accounts',
            'params' => [],
            'id' => 1,
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $ganacheRpcUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            throw new Exception('cURL error: ' . curl_error($ch));
        }

        curl_close($ch);

        $result = json_decode($response, true);
        if (isset($result['error'])) {
            throw new Exception('RPC error: ' . $result['error']['message']);
        }

        return $result['result'];
    }

    // Connect to Ganache
    $ganacheRpcUrl = 'http://127.0.0.1:7545';
    $ethAccounts = getEthAccounts($ganacheRpcUrl);

    if (empty($ethAccounts)) {
        throw new Exception('No Ethereum accounts found!');
    }

    // Database connection
    $db = new PDO('sqlite:user_database.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Sanitize user inputs
    $eth_add = filter_input(INPUT_POST, 'eth_add', FILTER_SANITIZE_STRING); 
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    $role = "user";

    if (!$eth_add || !$username || !$password) {
        echo 'Invalid input!';
        exit;
    }

    // Hash the password
    $options = ['cost' => 14];
    $hashedPassword = password_hash($password, CRYPT_SHA512, $options);

    // Retrieve the current maximum user ID from the database
    $stmt = $db->query('SELECT MAX(user_id) AS max_id FROM users');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $maxId = $result['max_id'] ?? 0;

    // Calculate the new user ID
    $newUserId = $maxId + 1;

    // Calculate the Ethereum account index based on the new user ID
    $ethIndex = ($newUserId - 1) % count($ethAccounts);
    $ethAddress = $ethAccounts[$ethIndex];

    // Insert the data into the database, including the Ethereum account
    $stmt = $db->prepare('INSERT INTO users (user_id, username, eth_add, hashed_pw, role) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$newUserId, $username, $eth_add, $hashedPassword, $role]);

    echo 'Registration successful! Assigned Ethereum Address: ' . $ethAddress;
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>
