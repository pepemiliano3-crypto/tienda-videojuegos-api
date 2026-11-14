-- ============================================================
-- Tema 16: Tienda Digital de Venta de Videojuegos
-- Base de datos: tienda_videojuegos_db
-- Orden: primero las tablas independientes, al final las que tienen llaves foráneas
-- ============================================================

-- 1. DESARROLLADORAS (independiente)
CREATE TABLE desarrolladoras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    pais VARCHAR(60) NOT NULL
);

-- 2. VIDEOJUEGOS (depende de desarrolladoras)
CREATE TABLE videojuegos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    precio NUMERIC(8,2) NOT NULL CHECK (precio >= 0),
    desarrolladora_id INT NOT NULL,
    CONSTRAINT fk_desarrolladora
        FOREIGN KEY (desarrolladora_id)
        REFERENCES desarrolladoras(id)
        ON DELETE RESTRICT
);

-- 3. USUARIOS (independiente)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. LICENCIAS (tabla intermedia: depende de usuarios y videojuegos)
CREATE TABLE licencias (
    id SERIAL PRIMARY KEY,
    fecha_compra DATE NOT NULL DEFAULT CURRENT_DATE,
    codigo_activacion VARCHAR(25) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    videojuego_id INT NOT NULL,
    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_videojuego
        FOREIGN KEY (videojuego_id)
        REFERENCES videojuegos(id)
        ON DELETE RESTRICT
);

-- ============================================================
-- DATOS DE PRUEBA (10 registros por tabla)
-- ============================================================
INSERT INTO desarrolladoras (nombre, pais) VALUES
('Nintendo', 'Japón'),
('Epic Games', 'Estados Unidos'),
('CD Projekt Red', 'Polonia'),
('Valve', 'Estados Unidos'),
('Ubisoft', 'Francia'),
('Rockstar Games', 'Estados Unidos'),
('FromSoftware', 'Japón'),
('Mojang Studios', 'Suecia'),
('Supergiant Games', 'Estados Unidos'),
('Capcom', 'Japón');

INSERT INTO videojuegos (titulo, genero, precio, desarrolladora_id) VALUES
('The Witcher 3: Wild Hunt', 'RPG', 349.99, 3),
('Half-Life 2', 'Shooter', 139.00, 4),
('Fortnite', 'Battle Royale', 0.00, 2),
('Far Cry 6', 'Shooter', 899.00, 5),
('Red Dead Redemption 2', 'Acción', 1099.00, 6),
('Elden Ring', 'RPG', 999.00, 7),
('Minecraft', 'Sandbox', 449.00, 8),
('Hades', 'Roguelike', 299.00, 9),
('Resident Evil 4', 'Terror', 799.00, 10),
('Super Mario Odyssey', 'Plataformas', 1299.00, 1);

INSERT INTO usuarios (nickname, correo, fecha_registro) VALUES
('ShadowKnight', 'shadowknight@correo.com', '2025-01-15'),
('LunaGamer', 'luna.gamer@correo.com', '2025-02-03'),
('PixelWizard', 'pixel.wizard@correo.com', '2025-03-21'),
('NovaStrike', 'nova.strike@correo.com', '2025-05-10'),
('CyberFox', 'cyber.fox@correo.com', '2025-06-28'),
('DragonSlayer', 'dragon.slayer@correo.com', '2025-08-14'),
('MaverickPlay', 'maverick.play@correo.com', '2025-09-02'),
('StarRunner', 'star.runner@correo.com', '2025-10-19'),
('IronPixel', 'iron.pixel@correo.com', '2026-01-07'),
('GhostRider', 'ghost.rider@correo.com', '2026-03-25');

INSERT INTO licencias (fecha_compra, codigo_activacion, usuario_id, videojuego_id) VALUES
('2026-02-01', 'WTCH-3A9K-1X7Z', 1, 1),
('2026-02-05', 'HLFL-2B4M-8Q3P', 2, 2),
('2026-03-12', 'FRTN-7C2D-5R9T', 3, 3),
('2026-03-30', 'FRCY-6D8E-2W4L', 4, 4),
('2026-04-18', 'RDRD-2F5G-9H1J', 5, 5),
('2026-05-22', 'ELDN-RNG7-3K6M', 6, 6),
('2026-06-09', 'MNCR-AFT1-4N8B', 7, 7),
('2026-07-14', 'HADS-9L3V-6C2X', 8, 8),
('2026-08-03', 'RSDT-4E7Y-1U5I', 9, 9),
('2026-09-27', 'SMOD-1Y6O-7P3A', 10, 10);

-- Verificación
SELECT * FROM desarrolladoras;
SELECT * FROM videojuegos;
SELECT * FROM usuarios;
SELECT * FROM licencias;
