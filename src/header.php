<?php
session_start();

$timeout_duration = 3000; 

// Check if a session exists
if (isset($_SESSION['username'])) {
    // Check if the session timestamp is set
    if (isset($_SESSION['last_activity'])) {
        // Calculate the session lifetime
        $elapsed_time = time() - $_SESSION['last_activity'];

        if ($elapsed_time > $timeout_duration) {
            // Session expired, destroy it
            session_unset(); // Clear session variables
            session_destroy(); // Destroy the session
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Session expired.']);
            exit;
        }
    }

    // Update the session's last activity timestamp
    $_SESSION['last_activity'] = time();

    http_response_code(200); // OK
    echo json_encode(['username' => $_SESSION['username']]);
    
} else {
    http_response_code(401); // Unauthorized
    echo json_encode(['error' => 'User not logged in']);
}

?>
