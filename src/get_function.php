<?php
session_start();

try {
    // Check if the user is logged in
    if (!isset($_SESSION['username'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['error' => 'User not logged in']);
        exit;
    }

    // Database connection
    $db = new PDO('sqlite:user_database.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Retrieve the username from the session
    $username = $_SESSION['username'];

    // Fetch the eth_add for the user from the database
    $stmt = $db->prepare('SELECT eth_add FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if the user was found
    if (!$result) {
        http_response_code(404); // Not Found
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    // Return the eth_add as a JSON response
    echo json_encode(['eth_add' => $result['eth_add']]);

} catch (Exception $e) {
    // Handle errors (database or other)
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => $e->getMessage()]);
}
?>
