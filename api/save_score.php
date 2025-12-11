<?php
// api/save_score.php
header('Content-Type: application/json');

// Permitir solicitudes desde el mismo origen (y otros si fuera necesario)
// Permitir solicitudes desde el mismo origen y desde GitHub Pages
header("Access-Control-Allow-Origin: *"); // En producción real esto debería ser específico, pero para Ngrok/* es útil.
// O si quieres ser estricto: 
// $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// if ($origin === 'https://kitzu007.github.io' || $origin === 'http://localhost') {
//    header("Access-Control-Allow-Origin: $origin");
// }
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir conexión
require_once '../db_connect.php';

// Obtener datos del cuerpo de la solicitud JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Verificar que llegaron los datos necesarios
if (
    !isset($data['player_name']) ||
    !isset($data['score']) ||
    !isset($data['duration_seconds']) ||
    !isset($data['moves_count']) ||
    !isset($data['death_type'])
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Sanitizar y Preparar variables
$player_name = strip_tags($data['player_name']);
$score = (int) $data['score'];
$duration = (int) $data['duration_seconds'];
$moves = (int) $data['moves_count'];
$max_speed = isset($data['max_speed_ms']) ? (int) $data['max_speed_ms'] : 100;
$death_type = strip_tags($data['death_type']);
$platform = isset($data['platform']) ? strip_tags($data['platform']) : 'Unknown';

try {
    // Preparar INSERT SQL
    $stmt = $pdo->prepare("INSERT INTO snake_analytics (player_name, score, duration_seconds, moves_count, max_speed_ms, death_type, platform) VALUES (?, ?, ?, ?, ?, ?, ?)");

    // Ejecutar
    $stmt->execute([$player_name, $score, $duration, $moves, $max_speed, $death_type, $platform]);

    echo json_encode(['success' => true, 'message' => 'Score saved successfully']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>