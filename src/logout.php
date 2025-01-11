<?php
session_start();

// Destroy session data
session_unset();
session_destroy();

// Output a JSON response indicating the logout was successful
echo json_encode(['message' => 'Logout successful']);
?>
<script>
  // Clear localStorage when the user logs out
  localStorage.clear();

  // Optionally, you can also redirect the user to a login page or homepage
  window.location.href = '/login'; // Change '/login' to your actual login or home page URL
</script>
