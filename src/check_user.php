<?php
try {
    // Connect to the database
    $db = new PDO('sqlite:user_database.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get the username from the query string
    $username = filter_input(INPUT_GET, 'username', FILTER_SANITIZE_STRING);

    // Check if the username exists
    $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $isTaken = $stmt->fetchColumn() > 0;

    // Return the result as JSON
    echo json_encode(['isTaken' => $isTaken]);
} catch (Exception $e) {
    echo json_encode(['isTaken' => false, 'error' => $e->getMessage()]);
}
