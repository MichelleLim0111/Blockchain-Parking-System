<?php
header('Content-Type: application/json');

// Read raw input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$data['date'] = '2024-12-19';
$data['start_time'] = '10:00';
$data['end_time'] = '11:00';
// Validate input
if (!isset($data['date'], $data['start_time'], $data['end_time'])) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// // Sanitize inputs
// putenv("DATE=2024-12-19");
// putenv("START_TIME=10:00");
// putenv("END_TIME=11:00");


// $projectPath = "C:\\Users\\Admin\\Visual_Studio\\blockchain";
// $venvActivateCommand = ".venv\\Scripts\\activate";
// $scriptPath = "src\\SmartCarPark\\scripts\\check_spot_availability.py";

// // Construct the command
// $command = "cd $projectPath && $venvActivateCommand && brownie run $scriptPath main --network ganache-local";
// exec($command, $output, $status);

// // Check if the Python script executed successfully
// if ($status !== 0) {
//     echo json_encode(['success' => false, 'error' => 'Error executing Python script']);
//     error_log("Python Script Error: " . implode("\n", $output));
//     exit;
// }

// Load the output JSON file
$jsonFilePath = 'C:\Users\Admin\Visual_Studio\blockchain\src\SmartCarPark\availability_details.json';
if (!file_exists($jsonFilePath) || !is_readable($jsonFilePath)) {
    echo json_encode(['success' => false, 'error' => 'Availability file not found']);
    exit;
}

$jsonContent = file_get_contents($jsonFilePath);
$decodedData = json_decode($jsonContent, true);

// Check for decoding errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Error reading availability data']);
    exit;
}

// Return the data
echo json_encode(['success' => true, 'availability' => $decodedData['availability']]);
