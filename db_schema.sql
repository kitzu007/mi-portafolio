-- 1. Crear la Base de Datos (si no existe)
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- 2. Crear la Tabla de Analíticas del Juego
CREATE TABLE IF NOT EXISTS snake_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    duration_seconds INT NOT NULL,
    moves_count INT NOT NULL,
    max_speed_ms INT NOT NULL,
    death_type VARCHAR(20) NOT NULL, -- 'wall' (pared) o 'self' (mismo)
    platform VARCHAR(100), -- Navegador/Dispositivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. (Opcional) Insertar un dato de prueba
INSERT INTO snake_analytics (player_name, score, duration_seconds, moves_count, max_speed_ms, death_type, platform)
VALUES ('Test Player', 10, 120, 50, 80, 'wall', 'Desktop Chrome');
