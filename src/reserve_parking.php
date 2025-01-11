<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['spot_ID']) || !isset($data['date']) || !isset($data['start_time']) || !isset($data['end_time'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$spot_ID = intval($data['spot_ID']);
$date = escapeshellarg($data['date']);
$start_time = intval($data['start_time']);
$end_time = intval($data['end_time']);

$command = "python3 reserve_spot.py $spot_ID $date $start_time $end_time";
$output = shell_exec($command);

if ($output === null) {
    echo json_encode(['success' => false, 'error' => 'Error executing script']);
    exit;
}

echo $output;
?>
