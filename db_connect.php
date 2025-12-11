<?php
// db_connect.php
// Configuración de conexión a la Base de Datos

$host = 'localhost';
$port = '3308'; // Puerto específico de tu WAMP
$db   = 'portfolio_db';
$user = 'root'; // Usuario por defecto de WAMP
$pass = '';     // Contraseña por defecto (vacía)

$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass);
    // Configurar errores para que lancen excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (\PDOException $e) {
    // Si falla, devolvemos error JSON y terminamos
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}
?>
