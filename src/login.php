<?php
session_start(); // Start the session at the beginning of the file

// Connect to the database
$db = new PDO('sqlite:user_database.db');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400); // Bad request
    echo 'Invalid JSON input.';
    exit;
}

$username = filter_var($data['username'], FILTER_SANITIZE_STRING);
$password = filter_var($data['password'], FILTER_SANITIZE_STRING);

// if (!$username || !$password) {
//     http_response_code(400); // Bad request
//     echo 'Invalid input!';
//     exit;
// }

// Check if the username exists in the database
$stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['hashed_pw'])) {
    $_SESSION['username'] = $username; // Set the session variable for the logged-in user

    http_response_code(200); // OK
    echo 'Login successful';
    exit;
} else {
    http_response_code(401); // Unauthorized
    echo 'Invalid username or password.';
    exit;
}
?>
